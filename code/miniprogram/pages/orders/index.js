const app = getApp()

Page({
  data: {
    orders: [],
    loading: true,
    isLoggedIn: false,
    statusMap: {
      0: '待确认',
      1: '已受理',
      2: '待体验',
      3: '已完成',
      '-1': '已取消'
    }
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    if (app.globalData.openid) {
      this.loadOrders()
    }
  },

  checkLogin() {
    const userInfo = app.globalData.userInfo
    this.setData({ isLoggedIn: !!userInfo })
    if (userInfo) {
      this.loadOrders()
    } else {
      this.setData({ loading: false })
    }
  },

  async loadOrders() {
    this.setData({ loading: true })
    try {
      const db = wx.cloud.database()
      const openid = app.globalData.openid
      const res = await db.collection('orders')
        .where({ userId: openid })
        .orderBy('createTime', 'desc')
        .get()
      this.setData({
        orders: res.data || [],
        loading: false
      })
    } catch (e) {
      console.error('load experience records failed', e)
      this.setData({ loading: false })
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/auth/index' })
  },

  goToFoodDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/food-detail/index?id=${id}` })
  }
})
