const app = getApp()
const cloud = require('../../utils/cloud.js')

const fallbackVotes = [
  {
    _id: 'vote-1',
    title: 'Best Noodle Shop of 2026',
    endTime: '2026-12-31',
    status: 1,
    options: [
      { id: 0, name: 'Ma Zi Lu', count: 12400 },
      { id: 1, name: 'Xi Jin Du', count: 7200 },
      { id: 2, name: 'Yue Ya Street', count: 5900 }
    ]
  }
]

function normalizeVote(item) {
  const options = (item.options || []).map((option, index) => ({
    id: Number.isFinite(Number(option.id)) ? Number(option.id) : index,
    name: option.name || option.text || `Option ${index + 1}`,
    count: Number(option.count) || 0
  }))

  return Object.assign({}, item, {
    options,
    totalCount: options.reduce((sum, option) => sum + option.count, 0)
  })
}

function getErrorMessage(errorCode) {
  const map = {
    not_logged_in: 'Please login first',
    invalid_params: 'Invalid vote params',
    already_voted: 'You have already voted',
    vote_not_found: 'Vote not found',
    option_not_found: 'Option not found'
  }

  return map[errorCode] || errorCode || 'Vote failed'
}

Page({
  data: {
    votes: [],
    loading: true
  },

  onLoad() {
    this.loadVotes()
  },

  async loadVotes() {
    try {
      const res = await cloud.callFunction('getVoteList', { page: 1, limit: 20 })
      const result = res.result || res
      const list = result.success === false ? [] : (result.votes || [])

      this.setData({
        votes: (list.length ? list : fallbackVotes).map(normalizeVote),
        loading: false
      })
    } catch (e) {
      console.error('load votes failed', e)

      try {
        const db = wx.cloud.database()
        const res = await db.collection('votes')
          .where({ status: 1 })
          .orderBy('createTime', 'desc')
          .get()

        this.setData({
          votes: (res.data.length ? res.data : fallbackVotes).map(normalizeVote),
          loading: false
        })
      } catch (dbError) {
        console.error('load votes from db failed', dbError)
        this.setData({
          votes: fallbackVotes.map(normalizeVote),
          loading: false
        })
      }
    }
  },

  async submitVote(e) {
    const { voteId, optionId } = e.currentTarget.dataset

    if (!app.globalData.openid) {
      wx.showModal({
        title: 'Notice',
        content: 'Please login first',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/profile/index' })
          }
        }
      })
      return
    }

    try {
      const res = await cloud.callFunction('submitVote', {
        voteId,
        optionId: Number(optionId)
      })
      const result = res.result || res

      if (!result.success) {
        wx.showToast({ title: getErrorMessage(result.error), icon: 'none' })
        return
      }

      wx.showToast({ title: 'Vote submitted', icon: 'success' })
      this.loadVotes()
    } catch (e) {
      console.error('submit vote failed', e)
      wx.showToast({ title: 'Vote failed', icon: 'none' })
    }
  }
})
