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

function requirePhoneBinding(userInfo, message = '请先绑定手机号') {
  if (userInfo && (userInfo.phoneVerified || userInfo.phone)) {
    return true
  }

  wx.showModal({
    title: '需要手机号',
    content: `${message}，然后再继续当前操作。`,
    confirmText: '去绑定',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({ url: '/pages/auth/index?bindPhone=1' })
      }
    }
  })

  return false
}

module.exports = {
  normalizeUserInfo,
  requirePhoneBinding
}
