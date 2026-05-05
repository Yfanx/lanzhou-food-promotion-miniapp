const CLOUD_IMAGE_PREFIX = 'cloud://cloud1-7glyj8fy8135ce71/test-images/'
const LOCAL_IMAGE_PREFIX = '/assets/test-images/'

function isInvalidImagePath(value) {
  const text = String(value || '').trim().toLowerCase()
  return !text || text === 'placeholder' || text === 'null' || text === 'undefined' || text.endsWith('/placeholder')
}

function resolveImagePath(value) {
  if (typeof value !== 'string') {
    return value
  }

  if (isInvalidImagePath(value)) {
    return ''
  }

  if (value.startsWith(CLOUD_IMAGE_PREFIX)) {
    return `${LOCAL_IMAGE_PREFIX}${value.slice(CLOUD_IMAGE_PREFIX.length)}`
  }

  if (value.startsWith(LOCAL_IMAGE_PREFIX)) {
    return value
  }

  if (value.startsWith('cloud://')) {
    return value
  }

  return value
}

function deepResolveCloudImages(input) {
  if (Array.isArray(input)) {
    return input.map((item) => deepResolveCloudImages(item))
  }

  if (!input || typeof input !== 'object') {
    return resolveImagePath(input)
  }

  const result = {}
  Object.keys(input).forEach((key) => {
    result[key] = deepResolveCloudImages(input[key])
  })
  return result
}

async function deepResolveDisplayImages(input) {
  return deepResolveCloudImages(input)
}

module.exports = {
  CLOUD_IMAGE_PREFIX,
  LOCAL_IMAGE_PREFIX,
  isInvalidImagePath,
  resolveImagePath,
  deepResolveCloudImages,
  deepResolveDisplayImages
}
