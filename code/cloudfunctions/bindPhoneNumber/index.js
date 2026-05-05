const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { code } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { success: false, error: 'not_logged_in' }
  }

  if (!code) {
    return { success: false, error: 'missing_code' }
  }

  const db = cloud.database()

  try {
    const phoneRes = await cloud.openapi.phonenumber.getPhoneNumber({
      code
    })

    const phoneInfo = phoneRes.phoneInfo || {}
    const phoneNumber = phoneInfo.phoneNumber
    if (!phoneNumber) {
      return { success: false, error: 'empty_phone' }
    }

    const userRes = await db.collection('users').where({ openid }).limit(1).get()
    const updateData = {
      openid,
      phone: phoneNumber,
      phoneVerified: true,
      phoneVerifiedAt: db.serverDate(),
      lastLoginAt: db.serverDate()
    }

    if (userRes.data.length === 0) {
      await db.collection('users').add({
        data: {
          nickName: '美食探索者',
          avatarUrl: '',
          createTime: db.serverDate(),
          ...updateData
        }
      })
    } else {
      await db.collection('users').doc(userRes.data[0]._id).update({
        data: updateData
      })
    }

    const latestUserRes = await db.collection('users').where({ openid }).limit(1).get()
    const userInfo = latestUserRes.data[0] || {
      openid,
      phone: phoneNumber,
      phoneVerified: true
    }

    return {
      success: true,
      userInfo: {
        openid: userInfo.openid,
        nickName: userInfo.nickName || '美食探索者',
        avatarUrl: userInfo.avatarUrl || '',
        phone: userInfo.phone || phoneNumber,
        phoneVerified: true,
        phoneVerifiedAt: userInfo.phoneVerifiedAt || '',
        lastLoginAt: userInfo.lastLoginAt || '',
        createTime: userInfo.createTime || ''
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'bind_phone_failed'
    }
  }
}
