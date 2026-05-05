const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { foodId } = event

  if (!foodId) {
    return { success: false, error: '美食ID不能为空' }
  }

  const db = cloud.database()

  try {
    const res = await db.collection('foods').doc(foodId).get()

    if (!res.data) {
      return { success: false, error: '美食不存在' }
    }

    return {
      success: true,
      food: res.data
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
