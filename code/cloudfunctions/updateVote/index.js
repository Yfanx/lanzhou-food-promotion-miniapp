const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function normalizeOptions(options = []) {
  return options.map((option, index) => ({
    id: Number.isFinite(Number(option.id)) ? Number(option.id) : index,
    name: option.name || option.text || '',
    count: Number(option.count) || 0
  }))
}

async function isAdmin(db, openid) {
  const adminRes = await db.collection('admins').where({ openid, status: 1 }).limit(1).get()
  return adminRes.data.length > 0
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()
  const { id, title, description, options, endTime, status } = event

  try {
    if (!openid || !(await isAdmin(db, openid))) {
      return { success: false, error: 'forbidden' }
    }

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (options !== undefined) updateData.options = normalizeOptions(options)
    if (endTime !== undefined) updateData.endTime = endTime
    if (status !== undefined) updateData.status = status
    updateData.updateTime = db.serverDate()

    await db.collection('votes').doc(id).update({
      data: updateData
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
