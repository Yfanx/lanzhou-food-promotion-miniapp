const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const { page = 1, limit = 20 } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const offset = (page - 1) * limit
    const res = await db.collection('users')
      .orderBy('createTime', 'desc')
      .skip(offset)
      .limit(limit)
      .get()
    const countRes = await db.collection('users').count()

    return {
      success: true,
      users: res.data,
      total: countRes.total,
      page,
      limit
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
