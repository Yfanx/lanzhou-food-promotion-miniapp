const cloud = require('./utils/cloud')
const ADMIN_CACHE_KEY = 'adminCheckCache'
const ADMIN_CACHE_TTL = 10 * 60 * 1000

function normalizeUserInfo(userInfo) {
  if (!userInfo) {
    return null
  }

  return {
    openid: userInfo.openid || '',
    nickName: userInfo.nickName || '美食探索者',
    avatarUrl: userInfo.avatarUrl || '',
    phone: userInfo.phone || '',
    phoneVerified: Boolean(userInfo.phoneVerified || userInfo.phone),
    phoneVerifiedAt: userInfo.phoneVerifiedAt || '',
    lastLoginAt: userInfo.lastLoginAt || '',
    createTime: userInfo.createTime || ''
  }
}

App({
  globalData: {
    env: 'cloud1-7glyj8fy8135ce71',
    openid: null,
    userInfo: null,
    isAdmin: false
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    wx.cloud.init({
      env: this.globalData.env,
      traceUser: true
    })

    this.checkLogin()
  },

  async checkLogin() {
    try {
      const userInfo = await this.getUserInfo()
      this.globalData.userInfo = userInfo
      this.checkAdmin()
    } catch (error) {
      console.log('用户未登录')
    }
  },

  async getUserInfo() {
    return new Promise((resolve, reject) => {
      const cachedUserInfo = wx.getStorageSync('userInfo')
      if (cachedUserInfo) {
        const userInfo = normalizeUserInfo(cachedUserInfo)
        this.globalData.openid = userInfo.openid
        resolve(userInfo)
        return
      }

      reject(new Error('用户未登录'))
    })
  },

  setUserInfo(userInfo) {
    const normalizedUserInfo = normalizeUserInfo(userInfo)
    this.globalData.userInfo = normalizedUserInfo
    this.globalData.openid = normalizedUserInfo ? normalizedUserInfo.openid : null

    if (normalizedUserInfo) {
      wx.setStorageSync('userInfo', normalizedUserInfo)
    } else {
      wx.removeStorageSync('userInfo')
    }

    return normalizedUserInfo
  },

  async checkAdmin() {
    const openid = this.globalData.openid
    if (!openid) {
      this.globalData.isAdmin = false
      return false
    }

    const cached = wx.getStorageSync(ADMIN_CACHE_KEY)
    if (
      cached
      && cached.openid === openid
      && cached.checkedAt
      && Date.now() - Number(cached.checkedAt) < ADMIN_CACHE_TTL
    ) {
      this.globalData.isAdmin = Boolean(cached.isAdmin)
      return this.globalData.isAdmin
    }

    try {
      const res = await cloud.callFunction('checkAdmin', {}, 12000, 1)
      const result = res.result || res
      this.globalData.isAdmin = Boolean(result && result.isAdmin)
      wx.setStorageSync(ADMIN_CACHE_KEY, {
        openid,
        isAdmin: this.globalData.isAdmin,
        checkedAt: Date.now()
      })
    } catch (error) {
      console.warn('check admin failed', error)
      this.globalData.isAdmin = false
    }

    return this.globalData.isAdmin
  },

  async login(phone) {
    try {
      const loginRes = await wx.cloud.callFunction({
        name: 'login',
        data: {}
      })

      const result = loginRes.result || {}
      const openid = result.openid || ''
      const safePhone = phone || ''
      const nickSuffix = safePhone ? safePhone.slice(-4) : ''

      const userInfo = this.setUserInfo({
        openid,
        phone: safePhone,
        nickName: nickSuffix ? `用户${nickSuffix}` : '微信用户',
        avatarUrl: '',
        phoneVerified: Boolean(safePhone),
        lastLoginAt: new Date().toISOString()
      })

      await this.checkAdmin()
      return userInfo
    } catch (error) {
      console.error('登录失败', error)
      throw error
    }
  },

  logout() {
    this.globalData.openid = null
    this.globalData.userInfo = null
    this.globalData.isAdmin = false
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync(ADMIN_CACHE_KEY)
  }
})
