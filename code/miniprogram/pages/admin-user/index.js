const cloud = require('../../utils/cloud.js')
const { guardAdminPage } = require('../../utils/admin.js')

function normalizeUser(user = {}) {
  const nickName = user.nickName || '匿名用户'
  return Object.assign({}, user, {
    nickName,
    avatarUrl: user.avatarUrl || '',
    phone: user.phone || '',
    phoneVerified: Boolean(user.phoneVerified || user.phone),
    displayInitial: nickName.charAt(0),
    phoneStatusText: user.phoneVerified || user.phone ? '已验证' : '未验证'
  })
}

Page({
  data: {
    users: [],
    loading: true,
    page: 1,
    hasMore: true
  },

  async onLoad() {
    const allowed = await guardAdminPage(this)
    if (!allowed) {
      return
    }
    this.loadUsers()
  },

  async loadUsers() {
    this.setData({ loading: true, page: 1 })
    try {
      const res = await cloud.callFunction('getUserList', { page: 1, limit: 20 })
      const result = res.result || res
      const users = (result.users || []).map(normalizeUser)
      this.setData({
        users,
        loading: false,
        page: 1,
        hasMore: users.length >= 20
      })
    } catch (error) {
      console.error('load users failed', error)
      this.setData({ loading: false })
    }
  },

  async loadMore() {
    if (!this.data.hasMore) {
      return
    }

    const nextPage = this.data.page + 1
    try {
      const res = await cloud.callFunction('getUserList', { page: nextPage, limit: 20 })
      const result = res.result || res
      const nextUsers = (result.users || []).map(normalizeUser)
      this.setData({
        users: this.data.users.concat(nextUsers),
        page: nextPage,
        hasMore: nextUsers.length >= 20
      })
    } catch (error) {
      console.error('load more users failed', error)
    }
  }
})
