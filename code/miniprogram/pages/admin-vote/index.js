const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')

function normalizeOptions(options = []) {
  return options.map((option, index) => ({
    id: Number.isFinite(Number(option.id)) ? Number(option.id) : index,
    name: option.name || option.text || '',
    count: Number(option.count) || 0
  }))
}

Page({
  data: {
    votes: [],
    loading: true,
    showForm: false,
    formData: {
      title: '',
      description: '',
      options: [],
      endTime: ''
    },
    editingId: null,
    newOptionText: ''
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadVotes()
  },

  async loadVotes() {
    this.setData({ loading: true })
    try {
      const res = await cloud.callFunction('getVoteList')
      const result = res.result || res
      this.setData({
        votes: (result.votes || []).map((vote) => Object.assign({}, vote, {
          options: normalizeOptions(vote.options)
        })),
        loading: false
      })
    } catch (e) {
      console.error('load votes failed', e)
      this.setData({ loading: false })
    }
  },

  showAddForm() {
    this.setData({
      showForm: true,
      formData: { title: '', description: '', options: [], endTime: '' },
      editingId: null,
      newOptionText: ''
    })
  },

  showEditForm(e) {
    const { vote } = e.currentTarget.dataset
    this.setData({
      showForm: true,
      formData: {
        title: vote.title,
        description: vote.description,
        options: normalizeOptions(vote.options),
        endTime: vote.endTime
      },
      editingId: vote._id,
      newOptionText: ''
    })
  },

  hideForm() {
    this.setData({ showForm: false })
  },

  onFormChange(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    const formData = Object.assign({}, this.data.formData)
    formData[field] = value
    this.setData({
      formData
    })
  },

  onNewOptionChange(e) {
    this.setData({ newOptionText: e.detail.value })
  },

  addOption() {
    const { newOptionText, formData } = this.data
    if (!newOptionText.trim()) {
      return wx.showToast({ title: 'Enter option text', icon: 'none' })
    }

    const options = formData.options.concat([{ name: newOptionText.trim(), count: 0 }])
    this.setData({
      formData: Object.assign({}, formData, { options }),
      newOptionText: ''
    })
  },

  removeOption(e) {
    const { index } = e.currentTarget.dataset
    const { formData } = this.data
    const options = formData.options.filter((_, i) => i !== index)
    this.setData({ formData: Object.assign({}, formData, { options }) })
  },

  async saveVote() {
    const { formData, editingId } = this.data
    const payload = Object.assign({}, formData, {
      options: normalizeOptions(formData.options).filter((option) => option.name)
    })

    if (!payload.title || payload.options.length < 2) {
      return wx.showToast({ title: 'Fill required fields', icon: 'none' })
    }

    try {
      if (editingId) {
        await cloud.callFunction('updateVote', Object.assign({ id: editingId }, payload))
      } else {
        await cloud.callFunction('addVote', payload)
      }

      this.hideForm()
      this.loadVotes()
      wx.showToast({ title: 'Saved', icon: 'success' })
    } catch (e) {
      wx.showToast({ title: 'Save failed', icon: 'none' })
    }
  },

  async deleteVote(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: 'Confirm',
      content: 'Delete this vote?',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.callFunction('deleteVote', { id })
            this.loadVotes()
            wx.showToast({ title: 'Deleted', icon: 'success' })
          } catch (e) {
            wx.showToast({ title: 'Delete failed', icon: 'none' })
          }
        }
      }
    })
  }
})
