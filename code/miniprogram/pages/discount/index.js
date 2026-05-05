// pages/discount/index.js
const mockData = require('../../utils/mock-data')

Page({
  data: {
    products: [],
    loading: true
  },

  onLoad() {
    this.loadProducts()
  },

  async loadProducts() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('foods')
        .where({ status: 1, isDiscount: 1 })
        .orderBy('sort', 'asc')
        .get()
      this.setData({
        products: res.data.length ? res.data : mockData.getDiscountFoods(),
        loading: false
      })
    } catch (e) {
      console.error('加载特价美食失败', e)
      this.setData({ products: mockData.getDiscountFoods(), loading: false })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/food-detail/index?id=${id}`
    })
  }
})
