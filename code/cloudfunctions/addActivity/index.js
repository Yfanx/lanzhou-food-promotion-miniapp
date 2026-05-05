const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const {
    title,
    brief,
    coverImage,
    startTime,
    endTime,
    signupDeadline,
    type,
    location,
    speaker,
    capacity,
    description,
    status
  } = event
  const db = cloud.database()

  if (!title || !coverImage) {
    return { success: false, error: 'title_or_cover_required' }
  }

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const res = await db.collection('activities').add({
      data: {
        title,
        brief: brief || '',
        coverImage,
        startTime: startTime || '',
        endTime: endTime || '',
        signupDeadline: signupDeadline || '',
        type: type || 'event',
        location: location || '',
        speaker: speaker || '',
        capacity: Number(capacity) || 0,
        description: description || '',
        status: Number(status) || 0,
        createTime: db.serverDate()
      }
    })
    return { success: true, id: res._id }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
