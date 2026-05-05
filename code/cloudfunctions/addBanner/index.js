const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { image, link, order } = event
  const db = cloud.database()

  if (!image) {
    return { success: false, error: '图片不能为空' }
  }

  try {
    const res = await db.collection('carousels').add({
      data: {
        image,
        link: link || '',
        order: order || 0,
        status: 1,
        createTime: new Date()
      }
    })
    return { success: true, id: res._id }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
