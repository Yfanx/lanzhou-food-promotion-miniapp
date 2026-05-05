const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function normalizeOptions(options = []) {
  return options.map((option, index) => ({
    id: Number.isFinite(Number(option.id)) ? Number(option.id) : index,
    name: option.name || option.text || `Option ${index + 1}`,
    count: Number(option.count) || 0
  }))
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { page = 1, limit = 20 } = event

  if (!openid) {
    return { success: false, error: 'not_logged_in' }
  }

  const db = cloud.database()

  try {
    const res = await db.collection('vote_records')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .skip((page - 1) * limit)
      .limit(limit)
      .get()

    const records = []
    for (const record of res.data) {
      try {
        const voteRes = await db.collection('votes').doc(record.voteId).get()
        if (voteRes.data) {
          const options = normalizeOptions(voteRes.data.options)
          const option = options.find((item) => item.id === Number(record.optionId))
          records.push({
            ...record,
            voteTitle: voteRes.data.title,
            votedOption: option ? option.name : 'Unknown'
          })
        }
      } catch (e) {
        console.error('load vote detail failed', e)
      }
    }

    const countRes = await db.collection('vote_records')
      .where({ _openid: openid })
      .count()

    return {
      success: true,
      voteRecords: records,
      total: countRes.total
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
