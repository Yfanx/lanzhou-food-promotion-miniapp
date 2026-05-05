const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')

Page({
  data: {
    announcements: [],
    loading: true,
    showForm: false,
    formData: {
      title: '',
      content: '',
      type: 0
    },
    editingId: null
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadAnnouncements()
  },

  async loadAnnouncements() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getAnnouncementList')
      const result = res.result || res
      this.setData({
        announcements: result.announcements || [],
        loading: false
      })
    } catch (e) {
      console.error('加载公告失败', e)
      this.setData({ loading: false })
    }
  },

  showAddForm() {
    this.setData({
      showForm: true,
      formData: { title: '', content: '', type: 0 },
      editingId: null
    })
  },

  showEditForm(e) {
    const { ann } = e.currentTarget.dataset
    this.setData({
      showForm: true,
      formData: { title: ann.title, content: ann.content, type: ann.type },
      editingId: ann._id
    })
  },

  hideForm() {
    this.setData({ showForm: false })
  },

  onFormChange(e) {
    const { field, value } = e.currentTarget.dataset
    const formData = Object.assign({}, this.data.formData)
    formData[field] = value
    this.setData({
      formData
    })
  },

  async saveAnnouncement() {
    const { formData, editingId } = this.data
    if (!formData.title || !formData.content) {
      return wx.showToast({ title: '请填写完整信息', icon: 'none' })
    }

    try {
      if (editingId) {
        await cloud.callFunction('updateAnnouncement', Object.assign({ id: editingId }, formData))
      } else {
        await cloud.callFunction('addAnnouncement', formData)
      }
      this.hideForm()
      this.loadAnnouncements()
      wx.showToast({ title: '保存成功' })
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  async deleteAnnouncement(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个公告吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteAnnouncement', { id })
            this.loadAnnouncements()
            wx.showToast({ title: '删除成功' })
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
