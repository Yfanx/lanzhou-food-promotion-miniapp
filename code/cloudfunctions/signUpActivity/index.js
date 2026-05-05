const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { activityId, name, phone, remark } = event

  if (!openid) {
    return { success: false, error: '请先登录' }
  }

  if (!activityId) {
    return { success: false, error: '活动ID不能为空' }
  }

  if (!name) {
    return { success: false, error: '姓名不能为空' }
  }

  if (!phone) {
    return { success: false, error: '手机号不能为空' }
  }

  const db = cloud.database()

  try {
    const userRes = await db.collection('users').where({ openid }).limit(1).get()
    const userInfo = userRes.data[0]

    if (!userInfo || !(userInfo.phoneVerified || userInfo.phone)) {
      return { success: false, error: 'phone_required' }
    }

    const activityRes = await db.collection('activities').doc(activityId).get()
    const activity = activityRes.data || {}

    if (activity.signupDeadline && new Date(activity.signupDeadline).getTime() < Date.now()) {
      return { success: false, error: '报名已截止' }
    }

    if (activity.capacity) {
      const signupCount = await db.collection('activity_signups')
        .where({ activityId })
        .count()
      if (signupCount.total >= Number(activity.capacity)) {
        return { success: false, error: '报名人数已满' }
      }
    }

    const existRes = await db.collection('activity_signups')
      .where({ activityId, _openid: openid })
      .count()

    if (existRes.total > 0) {
      return { success: false, error: '您已报过名，请勿重复提交' }
    }

    const res = await db.collection('activity_signups').add({
      data: {
        activityId,
        name,
        phone: userInfo.phone || phone,
        remark: remark || '',
        contactOpenid: openid,
        status: 0,
        createTime: db.serverDate()
      }
    })

    return {
      success: true,
      id: res._id
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
