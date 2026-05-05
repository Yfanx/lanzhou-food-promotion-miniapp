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
    profileSubtitle: isLoggedIn ? '美食探索家 · 入驻于 2026 年' : '登录后同步你的收藏、团购和投票记录'
  }
}

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    profileName: '点击登录',
    profileSubtitle: '登录后同步你的收藏、团购和投票记录',
    activeTab: '我的分享',
    stats: [
      { title: '已探索美食', value: '24' },
      { title: '可用优惠券', value: '12' }
    ],
    actions: [
      { id: 'history', title: '活动记录' },
      { id: 'orders', title: '我的团购' },
      { id: 'favorites', title: '文化收藏' }
    ],
    recommendations: [],
    featuredRecommendation: null,
    secondaryRecommendation: null,
    menuItems: [
      { id: 'orders', title: '我的订单', icon: 'order.png' },
      { id: 'favorites', title: '我的收藏', icon: 'favor.png' },
      { id: 'stories', title: '我的分享', icon: 'share.png' },
      { id: 'votes', title: '我的投票', icon: 'vote.png' },
      { id: 'settings', title: '设置', icon: 'setting.png' }
    ]
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
      buildRecommendationState(await deepResolveDisplayImages(mockData.getHotFoods(2)))
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
      buildRecommendationState(mockData.getHotFoods(2))
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
      buildRecommendationState(mockData.getHotFoods(2))
    ))
  }
})
