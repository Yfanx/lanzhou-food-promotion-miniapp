const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 获取 openid
  const openid = wxContext.OPENID

  return {
    success: true,
    openid
  }
}
