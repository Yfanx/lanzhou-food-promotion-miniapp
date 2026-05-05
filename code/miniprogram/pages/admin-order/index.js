const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')

Page({
  data: {
    orders: [],
    loading: true,
    page: 1,
    hasMore: true,
    statusFilter: null
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadOrders()
  },

  async loadOrders() {
    this.setData({ loading: true, page: 1 })
    try {
      const res = await cloud.callFunction('getAllOrders', {
        page: 1,
        limit: 20,
        status: this.data.statusFilter
      })
      const result = res.result || res
      const orders = result.orders || []
      this.setData({
        orders,
        loading: false,
        hasMore: orders.length >= 20
      })
    } catch (error) {
      console.error('load all orders failed', error)
      this.setData({ loading: false })
    }
  },

  async loadMore() {
    if (!this.data.hasMore) {
      return
    }

    const nextPage = this.data.page + 1
    try {
      const res = await cloud.callFunction('getAllOrders', {
        page: nextPage,
        limit: 20,
        status: this.data.statusFilter
      })
      const result = res.result || res
      const nextOrders = result.orders || []
      this.setData({
        orders: this.data.orders.concat(nextOrders),
        page: nextPage,
        hasMore: nextOrders.length >= 20
      })
    } catch (error) {
      console.error('load more orders failed', error)
    }
  },

  onStatusFilterChange(e) {
    const { status } = e.currentTarget.dataset
    this.setData({ statusFilter: status === '' ? null : status })
    this.loadOrders()
  },

  async updateOrderStatus(e) {
    const { id, status } = e.currentTarget.dataset
    try {
      await cloud.callFunction('updateOrderStatus', {
        orderId: id,
        status: Number(status)
      })
      wx.showToast({ title: '更新成功', icon: 'success' })
      this.loadOrders()
    } catch (error) {
      wx.showToast({ title: '更新失败', icon: 'none' })
    }
  }
})
