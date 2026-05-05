const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')
const { deepResolveCloudImages } = require('../../utils/cloud-images')

const TYPE_OPTIONS = ['event', 'lecture']

function getTypeIndex(type) {
  const index = TYPE_OPTIONS.indexOf(type)
  return index > -1 ? index : 0
}

Page({
  data: {
    activities: [],
    loading: true,
    showForm: false,
    typeOptions: TYPE_OPTIONS,
    typeIndex: 0,
    statusOptions: ['未开始', '进行中', '已结束'],
    formData: {
      title: '',
      brief: '',
      coverImage: '',
      startTime: '',
      endTime: '',
      signupDeadline: '',
      type: 'event',
      location: '',
      speaker: '',
      capacity: '',
      description: '',
      status: 0
    },
    editingId: null
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }

    this.loadActivities()
  },

  async loadActivities() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getActivities')
      const result = res.result || res
      this.setData({
        activities: deepResolveCloudImages(result.activities || []),
        loading: false
      })
    } catch (error) {
      console.error('load activities failed', error)
      this.setData({ loading: false })
    }
  },

  getEmptyForm() {
    return {
      title: '',
      brief: '',
      coverImage: '',
      startTime: '',
      endTime: '',
      signupDeadline: '',
      type: 'event',
      location: '',
      speaker: '',
      capacity: '',
      description: '',
      status: 0
    }
  },

  showAddForm() {
    this.setData({
      showForm: true,
      formData: this.getEmptyForm(),
      typeIndex: 0,
      editingId: null
    })
  },

  showEditForm(e) {
    const { activity } = e.currentTarget.dataset
    const type = activity.type || 'event'

    this.setData({
      showForm: true,
      formData: Object.assign({}, this.getEmptyForm(), activity, {
        type,
        capacity: activity.capacity || ''
      }),
      typeIndex: getTypeIndex(type),
      editingId: activity._id
    })
  },

  hideForm() {
    this.setData({ showForm: false })
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  onStatusChange(e) {
    this.setData({
      'formData.status': Number(e.detail.value)
    })
  },

  onTypeChange(e) {
    const index = Number(e.detail.value)
    this.setData({
      typeIndex: index,
      'formData.type': this.data.typeOptions[index] || 'event'
    })
  },

  async chooseImage() {
    const res = await wx.chooseImage({ count: 1 })
    if (res.tempFilePaths.length > 0) {
      const uploadRes = await cloud.uploadImage(res.tempFilePaths[0])
      this.setData({
        'formData.coverImage': uploadRes.url
      })
    }
  },

  async saveActivity() {
    const { formData, editingId } = this.data
    if (!formData.title || !formData.coverImage || !formData.startTime || !formData.endTime) {
      wx.showToast({ title: '请填写完整活动信息', icon: 'none' })
      return
    }

    const payload = Object.assign({}, formData, {
      capacity: Number(formData.capacity) || 0,
      status: Number(formData.status) || 0
    })

    try {
      if (editingId) {
        await cloud.callFunction('updateActivity', Object.assign({ id: editingId }, payload))
      } else {
        await cloud.callFunction('addActivity', payload)
      }

      wx.showToast({ title: '保存成功', icon: 'success' })
      this.hideForm()
      this.loadActivities()
    } catch (error) {
      console.error('save activity failed', error)
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  deleteActivity(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条活动吗？',
      success: async (res) => {
        if (!res.confirm) {
          return
        }

        try {
          await cloud.callFunction('deleteActivity', { id })
          wx.showToast({ title: '删除成功', icon: 'success' })
          this.loadActivities()
        } catch (error) {
          wx.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    })
  }
})
