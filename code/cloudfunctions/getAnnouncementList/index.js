const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { page = 1, limit = 20 } = event
  const db = cloud.database()

  try {
    const query = db.collection('announcements')
      .orderBy('createTime', 'desc')

    const offset = (page - 1) * limit
    const res = await query.skip(offset).limit(limit).get()
    const countRes = await query.count()

    return {
      success: true,
      announcements: res.data,
      total: countRes.total
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
