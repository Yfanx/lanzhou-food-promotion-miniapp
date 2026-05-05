const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { foodId, name, brief, coverImage, price } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { success: false, error: '未登录' }
  }

  if (!foodId) {
    return { success: false, error: '美食ID不能为空' }
  }

  const db = cloud.database()

  try {
    // 检查是否已收藏
    const checkRes = await db.collection('favorites')
      .where({ foodId, _openid: openid })
      .count()

    if (checkRes.total > 0) {
      return { success: false, error: '已收藏过该美食' }
    }

    // 添加收藏
    const res = await db.collection('favorites').add({
      data: {
        foodId,
        name: name || '',
        brief: brief || '',
        coverImage: coverImage || '',
        price: price || 0,
        _openid: openid,
        createTime: new Date()
      }
    })

    return { success: true, favoriteId: res._id }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
