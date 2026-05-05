// pages/settings/index.js
const app = getApp()

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    isAdmin: false
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const userInfo = app.globalData.userInfo
    const isAdmin = app.globalData.isAdmin
    this.setData({
      userInfo,
      isLoggedIn: !!userInfo,
      isAdmin: isAdmin || false
    })
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/auth/index' })
  },

  goToPhoneBinding() {
    wx.navigateTo({ url: '/pages/auth/index?bindPhone=1' })
  },

  goToAdmin() {
    if (!this.data.isAdmin) {
      wx.showToast({ title: '无权限访问', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/admin-dashboard/index' })
  },

  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '缓存已清除', icon: 'success' })
        }
      }
    })
  },

  aboutUs() {
    wx.showModal({
      title: '关于',
      content: '兰州美食文化宣传小程序 v1.0.0\n\n探索丝路风味，传承美食文化。',
      showCancel: false
    })
  },

  logout() {
    app.logout()
    wx.showToast({ title: '已退出', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})
