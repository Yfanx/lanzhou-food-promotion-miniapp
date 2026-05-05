const cloud = require('../../utils/cloud.js')
const { deepResolveCloudImages } = require('../../utils/cloud-images')

Page({
  data: {
    banners: [],
    loading: true,
    showForm: false,
    formData: {
      image: '',
      link: '',
      order: 0
    },
    editingId: null
  },

  onLoad() {
    this.loadBanners()
  },

  async loadBanners() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getBannerList')
      const result = res.result || res
      this.setData({
        banners: deepResolveCloudImages(result.banners || []),
        loading: false
      })
    } catch (e) {
      console.error('加载轮播图失败', e)
      this.setData({ loading: false })
    }
  },

  showAddForm() {
    this.setData({
      showForm: true,
      formData: { image: '', link: '', order: 0 },
      editingId: null
    })
  },

  showEditForm(e) {
    const { banner } = e.currentTarget.dataset
    this.setData({
      showForm: true,
      formData: Object.assign({}, banner),
      editingId: banner._id
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

  async chooseImage() {
    const res = await wx.chooseImage({ count: 1 })
    if (res.tempFilePaths.length > 0) {
      const uploadRes = await cloud.uploadImage(res.tempFilePaths[0])
      const formData = Object.assign({}, this.data.formData, { image: uploadRes.url })
      this.setData({
        formData
      })
    }
  },

  async saveBanner() {
    const { formData, editingId } = this.data
    if (!formData.image) {
      return wx.showToast({ title: '请选择图片', icon: 'none' })
    }

    try {
      if (editingId) {
        await cloud.callFunction('updateBanner', Object.assign({ id: editingId }, formData))
      } else {
        await cloud.callFunction('addBanner', formData)
      }
      this.hideForm()
      this.loadBanners()
      wx.showToast({ title: '保存成功' })
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  async deleteBanner(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个轮播图吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteBanner', { id })
            this.loadBanners()
            wx.showToast({ title: '删除成功' })
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
