const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const [usersRes, foodsRes, ordersRes, activitiesRes, announcementsRes, votesRes, storiesRes, signupsRes, phoneBoundUsersRes] = await Promise.all([
      db.collection('users').count(),
      db.collection('foods').count(),
      db.collection('orders').count(),
      db.collection('activities').count(),
      db.collection('announcements').count(),
      db.collection('votes').count(),
      db.collection('stories').count(),
      db.collection('activity_signups').count(),
      db.collection('users').where({ phoneVerified: true }).count()
    ])

    return {
      success: true,
      total: {
        users: usersRes.total,
        phoneBoundUsers: phoneBoundUsersRes.total,
        foods: foodsRes.total,
        orders: ordersRes.total,
        activities: activitiesRes.total,
        announcements: announcementsRes.total,
        votes: votesRes.total,
        stories: storiesRes.total,
        signups: signupsRes.total
      }
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
