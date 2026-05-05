const cloud = require('../../utils/cloud.js')
const app = getApp()

Page({
  data: {
    voteRecords: [],
    loading: true,
    isLoggedIn: false
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    if (app.globalData.openid) {
      this.loadVoteRecords()
    }
  },

  checkLogin() {
    const userInfo = app.globalData.userInfo
    this.setData({ isLoggedIn: !!userInfo })
    if (userInfo) {
      this.loadVoteRecords()
    } else {
      this.setData({ loading: false })
    }
  },

  async loadVoteRecords() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getMyVotes', {})
      const result = res.result || res
      this.setData({
        voteRecords: result.voteRecords || [],
        loading: false
      })
    } catch (e) {
      console.error('加载投票记录失败', e)
      this.setData({ loading: false })
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/auth/index' })
  }
})
