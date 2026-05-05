const inflightRequests = {}

function invokeCloudFunction(name, data = {}, timeout = 15000) {
  return new Promise((resolve, reject) => {
    let settled = false

    const timer = setTimeout(() => {
      if (settled) {
        return
      }

      settled = true
      reject(new Error(`cloud_function_timeout:${name}`))
    }, timeout)

    wx.cloud.callFunction({
      name,
      data
    }).then((res) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timer)
      resolve(res)
    }).catch((error) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timer)
      reject(error)
    })
  })
}

async function callFunction(name, data = {}, timeout = 15000, retries = 1) {
  const requestKey = `${name}:${JSON.stringify(data || {})}:${timeout}:${retries}`
  if (inflightRequests[requestKey]) {
    return inflightRequests[requestKey]
  }

  inflightRequests[requestKey] = callFunctionInternal(name, data, timeout, retries)

  try {
    return await inflightRequests[requestKey]
  } finally {
    delete inflightRequests[requestKey]
  }
}

async function callFunctionInternal(name, data = {}, timeout = 15000, retries = 1) {
  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await invokeCloudFunction(name, data, timeout)
    } catch (error) {
      lastError = error
      const message = String(error && error.message || '')
      const retryable = message.indexOf('cloud_function_timeout:') === 0
        || message.indexOf('request:fail') >= 0
        || message.indexOf('network') >= 0

      if (!retryable || attempt >= retries) {
        throw error
      }
    }
  }

  throw lastError || new Error(`cloud_function_failed:${name}`)
}

async function uploadImage(filePath) {
  const ext = filePath.split('.').pop()
  const name = Date.now() + Math.random().toString(36).slice(2, 8)
  const cloudPath = `uploads/${name}.${ext}`

  await wx.cloud.uploadFile({
    cloudPath,
    filePath
  })

  const res = await wx.cloud.getTempFileURL({
    fileList: [cloudPath]
  })

  return {
    url: res.fileList[0].tempFileURL
  }
}

module.exports = {
  callFunction,
  uploadImage
}
