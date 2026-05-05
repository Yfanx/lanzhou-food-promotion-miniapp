// pages/announcement/index.js
const mockData = require('../../utils/mock-data')

Page({
  data: {
    announcements: [],
    loading: true
  },

  onLoad() {
    this.loadAnnouncements()
  },

  async loadAnnouncements() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('announcements')
        .where({ status: 1 })
        .orderBy('createTime', 'desc')
        .get()
      this.setData({
        announcements: res.data.length ? res.data : mockData.getAnnouncements(),
        loading: false
      })
    } catch (e) {
      console.error('加载公告失败', e)
      this.setData({ announcements: mockData.getAnnouncements(), loading: false })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/announcement-detail/index?id=${id}`
    })
  }
})
