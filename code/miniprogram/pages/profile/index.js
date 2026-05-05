const app = getApp()
const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages } = require('../../utils/cloud-images')

function buildRecommendationState(list = []) {
  return {
    recommendations: list,
    featuredRecommendation: list[0] || null,
    secondaryRecommendation: list[1] || null
  }
}

function buildProfileState(userInfo) {
  const isLoggedIn = !!userInfo
  return {
    userInfo,
    isLoggedIn,
    profileName: isLoggedIn ? (userInfo.nickName || '丝路寻味者') : '点击登录',
    profileSubtitle: isLoggedIn
      ? '已同步你的文化收藏、活动报名与浏览足迹'
      : '登录后可同步你的专题收藏、活动报名和文化浏览记录'
  }
}

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    profileName: '点击登录',
    profileSubtitle: '登录后可同步你的专题收藏、活动报名和文化浏览记录',
    activeTab: '我的收藏',
    stats: [
      { title: '已浏览专题', value: '24' },
      { title: '已收藏内容', value: '12' }
    ],
    actions: [
      { id: 'favorites', title: '我的文化收藏' },
      { id: 'stories', title: '我的分享内容' },
      { id: 'orders', title: '我的体验预约' }
    ],
    recommendations: [],
    featuredRecommendation: null,
    secondaryRecommendation: null
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    this.checkLogin()
  },

  async checkLogin() {
    const userInfo = app.globalData.userInfo
    this.setData(Object.assign(
      {},
      buildProfileState(userInfo),
      buildRecommendationState(await deepResolveDisplayImages(mockData.getArticles().slice(0, 2)))
    ))
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/auth/index' })
  },

  handleAvatarTap() {
    if (!this.data.isLoggedIn) {
      this.goToLogin()
    }
  },

  logout() {
    app.logout()
    this.setData(Object.assign(
      {},
      buildProfileState(null),
      buildRecommendationState(mockData.getArticles().slice(0, 2))
    ))
    wx.showToast({ title: '已退出登录', icon: 'success' })
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/index' })
  },

  goToMenu(e) {
    const { id } = e.currentTarget.dataset
    if (!this.data.isLoggedIn) {
      this.goToLogin()
      return
    }

    const urlMap = {
      orders: '/pages/orders/index',
      favorites: '/pages/favorites/index',
      stories: '/pages/my-stories/index',
      votes: '/pages/my-votes/index',
      settings: '/pages/settings/index'
    }

    if (urlMap[id]) {
      wx.navigateTo({ url: urlMap[id] })
    }
  },

  selectTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  onLoginSuccess(userInfo) {
    this.setData(Object.assign(
      {},
      buildProfileState(userInfo),
      buildRecommendationState(mockData.getArticles().slice(0, 2))
    ))
  }
})
