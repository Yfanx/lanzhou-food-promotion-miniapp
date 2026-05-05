const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { id } = event

  if (!id) {
    return { success: false, error: '文章ID不能为空' }
  }

  const db = cloud.database()

  try {
    const res = await db.collection('articles').doc(id).get()
    return {
      success: true,
      article: res.data
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}