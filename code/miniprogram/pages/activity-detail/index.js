const mockData = require('../../utils/mock-data')
const app = getApp()
const { requirePhoneBinding } = require('../../utils/user')
const { deepResolveDisplayImages, isInvalidImagePath, resolveImagePath } = require('../../utils/cloud-images')

Page({
  data: {
    activity: null,
    loading: true,
    showSignupModal: false,
    signupForm: {
      name: '',
      phone: '',
      remark: ''
    }
  },

  onLoad(options) {
    if (options.id) {
      this.showFastActivity(options.id)
      this.loadActivity(options.id)
    }
  },

  async showFastActivity(id) {
    const activity = mockData.getActivities().find((item) => item._id === id) || mockData.getActivities()[0]
    if (!activity) {
      return
    }

    this.setData({
      activity: await deepResolveDisplayImages(activity),
      loading: false
    })
  },

  async loadActivity(id) {
    if (!this.data.activity) {
      this.setData({ loading: true })
    }

    try {
      const db = wx.cloud.database()
      const res = await db.collection('activities').doc(id).get()
      if (res.data && !isInvalidImagePath(res.data.coverImage)) {
        this.setData({ activity: await deepResolveDisplayImages(res.data), loading: false })
        return
      }
      throw new Error('not_found')
    } catch (error) {
      if (this.data.activity) {
        this.setData({ loading: false })
        return
      }

      const activity = mockData.getActivities().find((item) => item._id === id)
      const fallback = activity || mockData.getActivities()[0]
      this.setData({
        activity: fallback
          ? await deepResolveDisplayImages(fallback)
          : { coverImage: resolveImagePath('/assets/test-images/activities/activity-1.jpg') },
        loading: false
      })
    }
  },

  goToSignUp() {
    const userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.navigateTo({ url: '/pages/auth/index?bindPhone=1' })
      return
    }

    if (!requirePhoneBinding(userInfo, '活动报名需要手机号')) {
      return
    }

    this.setData({
      showSignupModal: true,
      signupForm: {
        name: userInfo.nickName || '',
        phone: userInfo.phone || '',
        remark: ''
      }
    })
  },

  hideSignupModal() {
    this.setData({ showSignupModal: false })
  },

  stopPropagation() {},

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`signupForm.${field}`]: value
    })
  },

  async submitSignup() {
    const { signupForm, activity } = this.data
    if (!signupForm.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!signupForm.phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!/^1\d{10}$/.test(signupForm.phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }

    try {
      const db = wx.cloud.database()
      const existRes = await db.collection('activity_signups')
        .where({
          activityId: activity._id,
          contactOpenid: app.globalData.openid
        })
        .limit(1)
        .get()

      if (existRes.data && existRes.data.length) {
        wx.showToast({ title: '已报名，请勿重复提交', icon: 'none' })
        return
      }

      await db.collection('activity_signups').add({
        data: {
          activityId: activity._id,
          name: signupForm.name,
          phone: signupForm.phone,
          remark: signupForm.remark || '',
          contactOpenid: app.globalData.openid || '',
          status: 0,
          createTime: new Date()
        }
      })

      wx.showToast({ title: '报名成功' })
      this.setData({ showSignupModal: false })
    } catch (error) {
      wx.showToast({ title: '报名失败', icon: 'none' })
    }
  },

  goToShare() {
    wx.showShareMenu({ withShareTicket: true })
  }
})
