const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const phone = String(event && event.phone || '').trim()

  if (!openid) {
    return { success: false, error: 'not_logged_in' }
  }

  if (!/^1\d{10}$/.test(phone)) {
    return { success: false, error: 'invalid_phone' }
  }

  const db = cloud.database()

  try {
    const userRes = await db.collection('users').where({ openid }).limit(1).get()
    const updateData = {
      openid,
      phone,
      phoneVerified: false,
      phoneVerifiedAt: '',
      lastLoginAt: db.serverDate()
    }

    if (userRes.data.length === 0) {
      await db.collection('users').add({
        data: Object.assign({
          nickName: '美食探索者',
          avatarUrl: '',
          createTime: db.serverDate()
        }, updateData)
      })
    } else {
      await db.collection('users').doc(userRes.data[0]._id).update({
        data: updateData
      })
    }

    const latestUserRes = await db.collection('users').where({ openid }).limit(1).get()
    const userInfo = latestUserRes.data[0] || {}

    return {
      success: true,
      userInfo: {
        openid,
        nickName: userInfo.nickName || '美食探索者',
        avatarUrl: userInfo.avatarUrl || '',
        phone,
        phoneVerified: false,
        phoneVerifiedAt: '',
        lastLoginAt: userInfo.lastLoginAt || '',
        createTime: userInfo.createTime || ''
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'save_phone_failed'
    }
  }
}
