const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { page = 1, pageSize = 10, status } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { success: false, error: '未登录' }
  }

  const db = cloud.database()

  try {
    const query = { userId: openid }
    if (status !== undefined && status !== null) {
      query.status = status
    }

    const skip = (page - 1) * pageSize

    const res = await db.collection('orders')
      .where(query)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    const countRes = await db.collection('orders').where(query).count()

    return {
      success: true,
      orders: res.data,
      data: res.data,
      total: countRes.total,
      page,
      pageSize
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
