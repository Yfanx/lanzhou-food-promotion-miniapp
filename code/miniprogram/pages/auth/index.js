const app = getApp()
const { normalizeUserInfo } = require('../../utils/user')

Page({
  data: {
    canUseGetUserProfile: false,
    requirePhoneBinding: false,
    userInfo: null,
    manualPhone: ''
  },

  onLoad(options) {
    const userInfo = normalizeUserInfo(app.globalData.userInfo)
    const requirePhoneBinding = Boolean(options && options.bindPhone === '1')

    this.setData({
      userInfo,
      requirePhoneBinding,
      manualPhone: userInfo && userInfo.phone ? userInfo.phone : '',
      canUseGetUserProfile: typeof wx.getUserProfile === 'function'
    })

    if (userInfo && !requirePhoneBinding) {
      wx.navigateBack()
    }
  },

  async wxLogin() {
    wx.showLoading({ title: '登录中...' })

    try {
      const userRes = await new Promise((resolve, reject) => {
        if (this.data.canUseGetUserProfile) {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: resolve,
            fail: reject
          })
        } else {
          wx.getUserInfo({
            success: resolve,
            fail: reject
          })
        }
      })

      const loginRes = await wx.cloud.callFunction({
        name: 'login',
        data: {}
      })

      const openid = loginRes.result.openid
      const userInfo = normalizeUserInfo({
        openid,
        nickName: userRes.userInfo && userRes.userInfo.nickName ? userRes.userInfo.nickName : '美食探索者',
        avatarUrl: userRes.userInfo && userRes.userInfo.avatarUrl ? userRes.userInfo.avatarUrl : '',
        phone: '',
        phoneVerified: false,
        lastLoginAt: new Date().toISOString()
      })

      app.setUserInfo(userInfo)
      app.checkAdmin()

      const db = wx.cloud.database()
      const existUser = await db.collection('users').where({ openid }).limit(1).get()

      if (existUser.data.length === 0) {
        await db.collection('users').add({
          data: Object.assign({}, userInfo, {
            phoneVerified: false,
            createTime: db.serverDate(),
            lastLoginAt: db.serverDate()
          })
        })
      } else {
        await db.collection('users').doc(existUser.data[0]._id).update({
          data: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            lastLoginAt: db.serverDate()
          }
        })
      }

      this.setData({
        userInfo,
        manualPhone: userInfo.phone || ''
      })

      wx.hideLoading()
      wx.showToast({
        title: this.data.requirePhoneBinding ? '登录成功，请补充手机号' : '登录成功',
        icon: 'success'
      })

      const pages = getCurrentPages()
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2]
        if (prevPage.onLoginSuccess) {
          prevPage.onLoginSuccess(userInfo)
        }
      }

      setTimeout(() => {
        if (this.data.requirePhoneBinding) {
          return
        }
        wx.navigateBack()
      }, 1200)
    } catch (error) {
      wx.hideLoading()
      console.error('login failed', error)

      if (error.errMsg && error.errMsg.indexOf('auth deny') >= 0) {
        wx.showToast({ title: '你取消了授权', icon: 'none' })
      } else {
        wx.showToast({ title: '登录失败', icon: 'none' })
      }
    }
  },

  async getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '你取消了手机号授权', icon: 'none' })
      return
    }

    if (!app.globalData.openid) {
      wx.showToast({ title: '请先完成微信登录', icon: 'none' })
      return
    }

    wx.showLoading({ title: '绑定中...' })

    try {
      const bindRes = await wx.cloud.callFunction({
        name: 'bindPhoneNumber',
        data: {
          code: e.detail.code
        }
      })

      const result = bindRes.result || {}
      if (!result.success) {
        throw new Error(result.error || 'bind_phone_failed')
      }

      const userInfo = app.setUserInfo(result.userInfo)
      this.setData({
        userInfo,
        manualPhone: userInfo.phone || ''
      })

      wx.hideLoading()
      wx.showToast({ title: '手机号绑定成功', icon: 'success' })

      const pages = getCurrentPages()
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2]
        if (prevPage.onLoginSuccess) {
          prevPage.onLoginSuccess(userInfo)
        }
      }

      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    } catch (error) {
      wx.hideLoading()
      console.error('bind phone failed', error)
      wx.showToast({ title: '绑定失败', icon: 'none' })
    }
  },

  onManualPhoneInput(e) {
    this.setData({
      manualPhone: String(e.detail.value || '').replace(/\D/g, '').slice(0, 11)
    })
  },

  async saveManualPhone() {
    if (!app.globalData.openid) {
      wx.showToast({ title: '请先完成微信登录', icon: 'none' })
      return
    }

    const phone = String(this.data.manualPhone || '').trim()
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })

    try {
      const db = wx.cloud.database()
      const openid = app.globalData.openid
      const userRes = await db.collection('users').where({ openid }).limit(1).get()
      const updatePayload = {
        phone,
        phoneVerified: false,
        phoneVerifiedAt: '',
        lastLoginAt: db.serverDate()
      }

      if (userRes.data.length === 0) {
        await db.collection('users').add({
          data: Object.assign({
            openid,
            nickName: (this.data.userInfo && this.data.userInfo.nickName) || '美食探索者',
            avatarUrl: (this.data.userInfo && this.data.userInfo.avatarUrl) || '',
            createTime: db.serverDate()
          }, updatePayload)
        })
      } else {
        await db.collection('users').doc(userRes.data[0]._id).update({
          data: updatePayload
        })
      }

      const nextUserInfo = normalizeUserInfo(Object.assign({}, this.data.userInfo || {}, {
        openid,
        phone,
        phoneVerified: false
      }))
      const userInfo = app.setUserInfo(nextUserInfo)
      this.setData({
        userInfo,
        manualPhone: phone
      })

      wx.hideLoading()
      wx.showToast({ title: '手机号已保存', icon: 'success' })

      const pages = getCurrentPages()
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2]
        if (prevPage.onLoginSuccess) {
          prevPage.onLoginSuccess(userInfo)
        }
      }

      setTimeout(() => {
        wx.navigateBack()
      }, 900)
    } catch (error) {
      wx.hideLoading()
      console.error('save manual phone failed', error)
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  }
})
