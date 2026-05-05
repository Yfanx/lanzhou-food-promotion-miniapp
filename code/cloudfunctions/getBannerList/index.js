const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()

  try {
    const res = await db.collection('carousels')
      .where({ status: 1 })
      .orderBy('sort', 'asc')
      .get()

    return {
      success: true,
      data: res.data
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
