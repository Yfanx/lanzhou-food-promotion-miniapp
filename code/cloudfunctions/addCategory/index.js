const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { name, icon, order } = event
  const db = cloud.database()

  if (!name) {
    return { success: false, error: '名称不能为空' }
  }

  try {
    const res = await db.collection('categories').add({
      data: {
        name,
        icon: icon || '',
        order: order || 0,
        createTime: new Date()
      }
    })
    return { success: true, id: res._id }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
