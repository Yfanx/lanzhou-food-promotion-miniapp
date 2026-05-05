const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { id, name, icon, order } = event
  const db = cloud.database()

  if (!id) {
    return { success: false, error: 'ID不能为空' }
  }

  try {
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (icon !== undefined) updateData.icon = icon
    if (order !== undefined) updateData.order = order

    await db.collection('categories').doc(id).update({
      data: updateData
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
