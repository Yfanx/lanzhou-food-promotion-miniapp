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
    id,
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

  if (!id) {
    return { success: false, error: 'missing_id' }
  }

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (brief !== undefined) updateData.brief = brief
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (startTime !== undefined) updateData.startTime = startTime
    if (endTime !== undefined) updateData.endTime = endTime
    if (signupDeadline !== undefined) updateData.signupDeadline = signupDeadline
    if (type !== undefined) updateData.type = type
    if (location !== undefined) updateData.location = location
    if (speaker !== undefined) updateData.speaker = speaker
    if (capacity !== undefined) updateData.capacity = Number(capacity) || 0
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = Number(status)
    updateData.updateTime = db.serverDate()

    await db.collection('activities').doc(id).update({
      data: updateData
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
