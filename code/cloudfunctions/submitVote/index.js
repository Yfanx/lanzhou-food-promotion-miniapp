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
  const { voteId, optionId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { success: false, error: 'not_logged_in' }
  }

  if (!voteId || optionId === undefined) {
    return { success: false, error: 'invalid_params' }
  }

  const db = cloud.database()

  try {
    const checkRes = await db.collection('vote_records')
      .where({ voteId, _openid: openid })
      .count()

    if (checkRes.total > 0) {
      return { success: false, error: 'already_voted' }
    }

    const voteRes = await db.collection('votes').doc(voteId).get()
    const vote = voteRes.data
      ? { ...voteRes.data, options: normalizeOptions(voteRes.data.options) }
      : null

    if (!vote || !vote.options || !vote.options.length) {
      return { success: false, error: 'vote_not_found' }
    }

    const normalizedOptionId = Number(optionId)
    const optionIndex = vote.options.findIndex((option) => option.id === normalizedOptionId)

    if (optionIndex === -1) {
      return { success: false, error: 'option_not_found' }
    }

    await db.collection('vote_records').add({
      data: {
        voteId,
        optionId: normalizedOptionId,
        _openid: openid,
        createTime: db.serverDate()
      }
    })

    const nextOptions = vote.options.map((option, index) => {
      if (index !== optionIndex) {
        return option
      }

      return {
        ...option,
        count: (Number(option.count) || 0) + 1
      }
    })

    await db.collection('votes').doc(voteId).update({
      data: {
        options: nextOptions
      }
    })

    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
