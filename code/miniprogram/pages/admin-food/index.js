const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')
const { deepResolveCloudImages } = require('../../utils/cloud-images')

Page({
  data: {
    foods: [],
    loading: true,
    page: 1,
    hasMore: true,
    showModal: false,
    isEdit: false,
    editId: '',
    form: {
      name: '',
      brief: '',
      price: '',
      originalPrice: '',
      stock: '',
      categoryId: '',
      isHot: false,
      isDiscount: false
    }
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadFoods()
  },

  async loadFoods() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getFoodList', { page: 1, limit: 20 })
      const result = res.result || res
      this.setData({
        foods: deepResolveCloudImages(result.foods || []),
        loading: false,
        hasMore: (result.foods || []).length >= 20,
        page: 1
      })
    } catch (e) {
      console.error('加载美食失败', e)
      this.setData({ loading: false })
    }
  },

  async loadMore() {
    if (!this.data.hasMore) return
    const nextPage = this.data.page + 1
    try {
      const res = await cloud.callFunction('getFoodList', { page: nextPage, limit: 20 })
      const result = res.result || res
      const nextFoods = deepResolveCloudImages(result.foods || [])
      this.setData({
        foods: this.data.foods.concat(nextFoods),
        page: nextPage,
        hasMore: nextFoods.length >= 20
      })
    } catch (e) {
      console.error('加载更多失败', e)
    }
  },

  showAddModal() {
    this.setData({
      showModal: true,
      isEdit: false,
      editId: '',
      form: {
        name: '',
        brief: '',
        price: '',
        originalPrice: '',
        stock: '',
        categoryId: '',
        isHot: false,
        isDiscount: false
      }
    })
  },

  showEditModal(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showModal: true,
      isEdit: true,
      editId: item._id,
      form: {
        name: item.name || '',
        brief: item.brief || '',
        price: item.price || '',
        originalPrice: item.originalPrice || '',
        stock: item.stock || '',
        categoryId: item.categoryId || '',
        isHot: !!item.isHot,
        isDiscount: !!item.isDiscount
      }
    })
  },

  hideModal() {
    this.setData({ showModal: false })
  },

  stopPropagation() {},

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`form.${field}`]: value
    })
  },

  onSwitchChange(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`form.${field}`]: value
    })
  },

  async submitForm() {
    const { form, isEdit, editId } = this.data
    if (!form.name) {
      wx.showToast({ title: '请输入美食名称', icon: 'none' })
      return
    }

    try {
      if (isEdit) {
        await cloud.callFunction('updateFood', {
          id: editId,
          name: form.name,
          brief: form.brief,
          price: Number(form.price) || 0,
          originalPrice: Number(form.originalPrice) || 0,
          stock: Number(form.stock) || 0,
          categoryId: form.categoryId,
          isHot: form.isHot,
          isDiscount: form.isDiscount
        })
        wx.showToast({ title: '保存成功' })
      } else {
        await cloud.callFunction('addFood', {
          name: form.name,
          brief: form.brief,
          price: Number(form.price) || 0,
          originalPrice: Number(form.originalPrice) || 0,
          stock: Number(form.stock) || 0,
          categoryId: form.categoryId,
          isHot: form.isHot,
          isDiscount: form.isDiscount
        })
        wx.showToast({ title: '添加成功' })
      }
      this.setData({ showModal: false })
      this.loadFoods()
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' })
      console.error(e)
    }
  },

  async deleteFood(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个美食吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteFood', { id })
            wx.showToast({ title: '删除成功' })
            this.loadFoods()
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
