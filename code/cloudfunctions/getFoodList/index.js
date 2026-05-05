const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { categoryId, page = 1, pageSize = 10 } = event
  const db = cloud.database()

  try {
    let query = { status: 1 }
    if (categoryId) {
      query.categoryId = categoryId
    }

    const skip = (page - 1) * pageSize

    const res = await db.collection('foods')
      .where(query)
      .orderBy('sort', 'asc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      success: true,
      data: res.data,
      page,
      pageSize
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
