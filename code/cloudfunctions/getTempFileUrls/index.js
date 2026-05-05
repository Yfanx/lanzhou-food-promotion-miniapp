const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const fileList = Array.isArray(event.fileList) ? event.fileList.filter(Boolean) : []

  if (!fileList.length) {
    return {
      success: true,
      fileList: []
    }
  }

  try {
    const res = await cloud.getTempFileURL({ fileList })
    return {
      success: true,
      fileList: res.fileList || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'getTempFileURL failed',
      fileList: []
    }
  }
}
