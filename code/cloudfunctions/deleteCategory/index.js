const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { id } = event
  const db = cloud.database()

  if (!id) {
    return { success: false, error: 'ID不能为空' }
  }

  try {
    await db.collection('categories').doc(id).remove()
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
