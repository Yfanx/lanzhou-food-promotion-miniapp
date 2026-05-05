const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { id } = event

  if (!id) {
    return { success: false, error: '收藏ID不能为空' }
  }

  const db = cloud.database()

  try {
    await db.collection('favorites').doc(id).remove()
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}