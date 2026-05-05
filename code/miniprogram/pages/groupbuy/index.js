const mockData = require('../../utils/mock-data')
const app = getApp()
const { requirePhoneBinding } = require('../../utils/user')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

function buildProductState(products) {
  return {
    products: products || [],
    featuredProduct: products && products[0] ? products[0] : null,
    otherProducts: products ? products.slice(1) : []
  }
}

Page({
  data: {
    products: [],
    featuredProduct: null,
    otherProducts: [],
    loading: true
  },

  onLoad() {
    this.loadProducts()
  },

  async loadProducts() {
    const localState = buildProductState(await deepResolveDisplayImages(mockData.getGroupBuyProducts()))
    localState.loading = false
    this.setData(localState)

    try {
      const db = wx.cloud.database()
      const res = await db.collection('group_buy_products')
        .where({ status: 1 })
        .orderBy('sort', 'asc')
        .get()

      const source = res.data.length && res.data.some((item) => !isInvalidImagePath(item.coverImage))
        ? res.data
        : mockData.getGroupBuyProducts()
      const nextState = buildProductState(await deepResolveDisplayImages(source))
      nextState.loading = false
      this.setData(nextState)
    } catch (error) {
      console.error('load group-buy products failed', error)
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/food-detail/index?id=${id}`
    })
  },

  async quickOrder(e) {
    const { index = 0 } = e.currentTarget.dataset
    const product = this.data.products[Number(index)]
    const userInfo = app.globalData.userInfo

    if (!product) {
      wx.showToast({ title: '商品信息异常', icon: 'none' })
      return
    }

    if (!userInfo) {
      wx.navigateTo({ url: '/pages/auth/index?bindPhone=1' })
      return
    }

    if (!requirePhoneBinding(userInfo, '团购下单需要手机号')) {
      return
    }

    try {
      const db = wx.cloud.database()
      const orderNo = `ORD${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      await db.collection('orders').add({
        data: {
          orderNo,
          userId: userInfo.openid || app.globalData.openid || '',
          contactName: userInfo.nickName || '微信用户',
          contactPhone: userInfo.phone || '',
          foods: [
            {
              foodId: product.foodId,
              name: product.name,
              price: product.groupPrice,
              count: 1
            }
          ],
          totalPrice: Number(product.groupPrice || 0),
          status: 0,
          createTime: new Date(),
          updateTime: new Date()
        }
      })

      wx.showToast({ title: '下单成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/orders/index' })
      }, 800)
    } catch (error) {
      wx.showToast({ title: '下单失败', icon: 'none' })
    }
  }
})
