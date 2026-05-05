const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function normalizeVote(vote) {
  const options = (vote.options || []).map((option, index) => ({
    id: Number.isFinite(Number(option.id)) ? Number(option.id) : index,
    name: option.name || option.text || `Option ${index + 1}`,
    count: Number(option.count) || 0
  }))

  return {
    ...vote,
    options,
    totalCount: options.reduce((sum, option) => sum + option.count, 0)
  }
}

exports.main = async (event) => {
  const { page = 1, limit = 20 } = event
  const db = cloud.database()

  try {
    const query = db.collection('votes').orderBy('createTime', 'desc')
    const offset = (page - 1) * limit
    const res = await query.skip(offset).limit(limit).get()
    const countRes = await db.collection('votes').count()

    return {
      success: true,
      votes: res.data.map(normalizeVote),
      total: countRes.total
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
