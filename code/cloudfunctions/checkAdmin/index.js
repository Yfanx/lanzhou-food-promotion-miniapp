const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { success: false, isAdmin: false }
  }

  const db = cloud.database()

  try {
    // 查询 admins 集合
    const res = await db.collection('admins')
      .where({ openid, status: 1 })
      .count()

    return {
      success: true,
      isAdmin: res.total > 0
    }
  } catch (e) {
    return {
      success: false,
      isAdmin: false,
      error: e.message
    }
  }
}
