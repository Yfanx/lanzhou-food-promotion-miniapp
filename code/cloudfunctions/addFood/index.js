const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()

  if (!event.name) {
    return { success: false, error: 'missing_name' }
  }

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const res = await db.collection('foods').add({
      data: {
        ...event,
        isHot: event.isHot ? 1 : 0,
        isDiscount: event.isDiscount ? 1 : 0,
        status: event.status !== undefined ? event.status : 1,
        createTime: db.serverDate()
      }
    })
    return { success: true, id: res._id }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
