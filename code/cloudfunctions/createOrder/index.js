const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { foods, totalPrice, contactName } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { success: false, error: '未登录' }
  }

  if (!foods || foods.length === 0) {
    return { success: false, error: '订单商品不能为空' }
  }

  const db = cloud.database()

  try {
    const userRes = await db.collection('users').where({ openid }).limit(1).get()
    const userInfo = userRes.data[0]

    if (!userInfo || !(userInfo.phoneVerified || userInfo.phone)) {
      return { success: false, error: 'phone_required' }
    }

    const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase()

    const order = {
      orderNo,
      userId: openid,
      contactName: contactName || userInfo.nickName || '微信用户',
      contactPhone: userInfo.phone,
      foods,
      totalPrice,
      status: 0,
      createTime: new Date(),
      updateTime: new Date()
    }

    const res = await db.collection('orders').add({ data: order })

    return {
      success: true,
      orderId: res._id,
      orderNo
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
