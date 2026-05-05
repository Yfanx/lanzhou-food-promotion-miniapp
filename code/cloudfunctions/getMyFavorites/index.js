const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { page = 1, limit = 20 } = event

  if (!openid) {
    return { success: false, error: '未登录' }
  }

  const db = cloud.database()

  try {
    const res = await db.collection('favorites')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .skip((page - 1) * limit)
      .limit(limit)
      .get()

    const countRes = await db.collection('favorites')
      .where({ _openid: openid })
      .count()

    return {
      success: true,
      favorites: res.data,
      total: countRes.total
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}