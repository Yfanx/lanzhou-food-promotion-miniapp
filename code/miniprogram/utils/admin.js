const app = getApp()

async function ensureAdminAccess() {
  try {
    if (!app.globalData.openid) {
      return false
    }

    await app.checkAdmin()
    return !!app.globalData.isAdmin
  } catch (error) {
    console.error('ensureAdminAccess failed', error)
    return false
  }
}

async function guardAdminPage(page, fallbackUrl = '/pages/settings/index') {
  const isAdmin = await ensureAdminAccess()
  if (isAdmin) {
    return true
  }

  wx.showToast({
    title: '请使用管理员账号访问',
    icon: 'none'
  })

  setTimeout(() => {
    wx.redirectTo({ url: fallbackUrl })
  }, 800)

  return false
}

module.exports = {
  ensureAdminAccess,
  guardAdminPage
}
