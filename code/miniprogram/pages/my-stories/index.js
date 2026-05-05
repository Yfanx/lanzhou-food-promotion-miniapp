const cloud = require('../../utils/cloud.js')
const app = getApp()

Page({
  data: {
    stories: [],
    loading: true,
    isLoggedIn: false
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    if (app.globalData.openid) {
      this.loadStories()
    }
  },

  checkLogin() {
    const userInfo = app.globalData.userInfo
    this.setData({ isLoggedIn: !!userInfo })
    if (userInfo) {
      this.loadStories()
    } else {
      this.setData({ loading: false })
    }
  },

  async loadStories() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getMyStories', {})
      const result = res.result || res
      this.setData({
        stories: result.stories || [],
        loading: false
      })
    } catch (e) {
      console.error('加载故事失败', e)
      this.setData({ loading: false })
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/auth/index' })
  }
})
