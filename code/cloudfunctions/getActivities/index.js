const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { page = 1, limit = 10, status, type } = event

  const db = cloud.database()

  try {
    const where = {}
    if (status !== undefined && status !== null) {
      where.status = status
    }
    if (type) {
      where.type = type
    }

    const offset = (page - 1) * limit
    const res = await db.collection('activities')
      .where(where)
      .orderBy('startTime', 'asc')
      .skip(offset)
      .limit(limit)
      .get()

    const countRes = await db.collection('activities').where(where).count()

    return {
      success: true,
      activities: (res.data || []).map((item) => ({
        ...item,
        type: item.type || 'event',
        location: item.location || '',
        speaker: item.speaker || '',
        capacity: item.capacity || 0,
        signupDeadline: item.signupDeadline || item.endTime || ''
      })),
      total: countRes.total,
      page,
      limit
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
