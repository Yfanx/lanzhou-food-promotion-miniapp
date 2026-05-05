const cloud = require('../../utils/cloud.js')
const mockData = require('../../utils/mock-data')

Page({
  data: {
    announcement: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.loadAnnouncement(options.id)
    }
  },

  async loadAnnouncement(id) {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getAnnouncementDetail', { id })
      const result = res.result || res
      if (result.announcement) {
        this.setData({ announcement: result.announcement, loading: false })
      } else {
        throw new Error('not found')
      }
    } catch (e) {
      const announcement = mockData.getAnnouncements().find(a => a._id === id)
      this.setData({ announcement: announcement || mockData.getAnnouncements()[0], loading: false })
    }
  },

  onShareAppMessage() {
    const { announcement } = this.data
    return {
      title: announcement ? announcement.title : '兰州美食公告',
      path: `/pages/announcement-detail/index?id=${announcement?._id}`,
      imageUrl: announcement?.coverImage
    }
  }
})