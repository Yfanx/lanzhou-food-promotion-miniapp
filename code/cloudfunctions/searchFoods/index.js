const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { keyword, categoryId, page = 1, limit = 10 } = event

  const db = cloud.database()
  const _ = db.command
  const $ = db.command

  try {
    let query = db.collection('foods')

    // 按分类筛选
    if (categoryId) {
      query = query.where({ categoryId })
    }

    // 按关键词搜索（名称或描述）
    if (keyword && keyword.trim()) {
      const keywordTrimmed = keyword.trim()
      query = query.where(
        $.or([
          { name: db.RegExp({ regexp: keywordTrimmed, options: 'i' }) },
          { brief: db.RegExp({ regexp: keywordTrimmed, options: 'i' }) },
          { tags: db.RegExp({ regexp: keywordTrimmed, options: 'i' }) }
        ])
      )
    }

    // 按排序
    query = query.orderBy('createTime', 'desc')

    // 分页查询
    const offset = (page - 1) * limit
    const res = await query.skip(offset).limit(limit).get()

    // 获取总数
    let countQuery = db.collection('foods')
    if (categoryId) {
      countQuery = countQuery.where({ categoryId })
    }
    if (keyword && keyword.trim()) {
      countQuery = countQuery.where(
        $.or([
          { name: db.RegExp({ regexp: keyword.trim(), options: 'i' }) },
          { brief: db.RegExp({ regexp: keyword.trim(), options: 'i' }) },
          { tags: db.RegExp({ regexp: keyword.trim(), options: 'i' }) }
        ])
      )
    }
    const countRes = await countQuery.count()

    return {
      success: true,
      foods: res.data,
      total: countRes.total,
      page,
      limit
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
