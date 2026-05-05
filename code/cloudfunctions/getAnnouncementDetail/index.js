const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { id } = event

  if (!id) {
    return { success: false, error: '公告ID不能为空' }
  }

  const db = cloud.database()

  try {
    const res = await db.collection('announcements').doc(id).get()
    return {
      success: true,
      announcement: res.data
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}