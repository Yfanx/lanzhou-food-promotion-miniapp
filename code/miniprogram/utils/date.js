function parseMiniProgramDate(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return value
  }

  const text = String(value).trim()
  if (!text) {
    return null
  }

  if (text.indexOf('T') >= 0) {
    return new Date(text)
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(text)
  }

  return new Date(text.replace(/-/g, '/'))
}

module.exports = {
  parseMiniProgramDate
}
