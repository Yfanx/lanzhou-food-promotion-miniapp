const cloud = require('../../utils/cloud.js')
const app = getApp()
const { deepResolveDisplayImages } = require('../../utils/cloud-images')

Page({
  data: {
    favorites: [],
    loading: true,
    isLoggedIn: false
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    if (app.globalData.openid) {
      this.loadFavorites()
    }
  },

  checkLogin() {
    const userInfo = app.globalData.userInfo
    this.setData({ isLoggedIn: !!userInfo })
    if (userInfo) {
      this.loadFavorites()
    } else {
      this.setData({ loading: false })
    }
  },

  async loadFavorites() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getMyFavorites', {})
      const result = res.result || res
      this.setData({
        favorites: await deepResolveDisplayImages(result.favorites || []),
        loading: false
      })
    } catch (error) {
      console.error('load favorites failed', error)
      this.setData({ loading: false })
    }
  },

  async removeFavorite(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认取消',
      content: '确定要取消收藏吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteFavorite', { id })
            wx.showToast({ title: '已取消收藏' })
            this.loadFavorites()
          } catch (error) {
            wx.showToast({ title: '操作失败', icon: 'none' })
          }
        }
      }
    })
  },

  goToFoodDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/food-detail/index?id=${id}` })
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/auth/index' })
  }
})
