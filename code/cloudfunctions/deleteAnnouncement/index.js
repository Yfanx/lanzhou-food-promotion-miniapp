const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const { id } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    await db.collection('announcements').doc(id).remove()
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
