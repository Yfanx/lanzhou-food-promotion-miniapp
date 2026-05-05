const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')

Page({
  data: {
    stories: [],
    loading: true,
    statusFilter: 0
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadStories()
  },

  async loadStories() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getStoryList', { status: this.data.statusFilter })
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

  onStatusFilterChange(e) {
    const { status } = e.currentTarget.dataset
    this.setData({ statusFilter: status })
    this.loadStories()
  },

  async approveStory(e) {
    const { id } = e.currentTarget.dataset
    try {
      await cloud.callFunction('approveStory', { id, status: 1 })
      wx.showToast({ title: '审核通过' })
      this.loadStories()
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  async rejectStory(e) {
    const { id } = e.currentTarget.dataset
    try {
      await cloud.callFunction('approveStory', { id, status: -1 })
      wx.showToast({ title: '已拒绝' })
      this.loadStories()
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  async deleteStory(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个故事吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteStory', { id })
            wx.showToast({ title: '删除成功' })
            this.loadStories()
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
