const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { id } = event

  if (!id) {
    return { success: false, error: '活动ID不能为空' }
  }

  const db = cloud.database()

  try {
    const res = await db.collection('activities').doc(id).get()
    return {
      success: true,
      activity: res.data
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}