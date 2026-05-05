const cloud = require('../../utils/cloud.js')

Page({
  data: {
    categories: [],
    loading: true,
    showForm: false,
    formData: {
      name: '',
      icon: '',
      order: 0
    },
    editingId: null
  },

  onLoad() {
    this.loadCategories()
  },

  async loadCategories() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getCategoryList')
      const result = res.result || res
      this.setData({
        categories: result.categories || [],
        loading: false
      })
    } catch (e) {
      console.error('加载分类失败', e)
      this.setData({ loading: false })
    }
  },

  showAddForm() {
    this.setData({
      showForm: true,
      formData: { name: '', icon: '', order: 0 },
      editingId: null
    })
  },

  showEditForm(e) {
    const { category } = e.currentTarget.dataset
    this.setData({
      showForm: true,
      formData: Object.assign({}, category),
      editingId: category._id
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

  async saveCategory() {
    const { formData, editingId } = this.data
    if (!formData.name) {
      return wx.showToast({ title: '请输入分类名称', icon: 'none' })
    }

    try {
      if (editingId) {
        await cloud.callFunction('updateCategory', Object.assign({ id: editingId }, formData))
      } else {
        await cloud.callFunction('addCategory', formData)
      }
      this.hideForm()
      this.loadCategories()
      wx.showToast({ title: '保存成功' })
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  async deleteCategory(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个分类吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteCategory', { id })
            this.loadCategories()
            wx.showToast({ title: '删除成功' })
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
