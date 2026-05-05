const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')

Page({
  data: {
    stats: {
      users: 0,
      phoneBoundUsers: 0,
      foods: 0,
      orders: 0,
      activities: 0,
      announcements: 0,
      votes: 0,
      stories: 0,
      signups: 0
    },
    loading: true
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadStats()
  },

  async onShow() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadStats()
  },

  async loadStats() {
    this.setData({ loading: true })

    try {
      const res = await cloud.callFunction('getStats')
      const result = res.result || res

      if (result.success) {
        this.setData({
          stats: result.total,
          loading: false
        })
        return
      }

      throw new Error(result.error || 'get_stats_failed')
    } catch (error) {
      console.error('load admin stats failed', error)
      this.setData({ loading: false })
      wx.showToast({ title: '统计加载失败', icon: 'none' })
    }
  },

  navigateTo(e) {
    const { page } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/${page}/index`
    })
  }
})
