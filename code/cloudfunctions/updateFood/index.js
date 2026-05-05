const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { id, ...rest } = event
  const db = cloud.database()

  if (!id) {
    return { success: false, error: 'missing_id' }
  }

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const updateData = { ...rest }
    if (updateData.isHot !== undefined) updateData.isHot = updateData.isHot ? 1 : 0
    if (updateData.isDiscount !== undefined) updateData.isDiscount = updateData.isDiscount ? 1 : 0
    updateData.updateTime = db.serverDate()

    await db.collection('foods').doc(id).update({
      data: updateData
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
