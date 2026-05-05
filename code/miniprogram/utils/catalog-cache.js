const mockData = require('./mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('./cloud-images')

const CACHE_KEY = 'catalogCache'
const CACHE_TTL = 10 * 60 * 1000

const memoryCache = {
  categories: null,
  foods: null,
  fetchedAt: 0
}

function hasUsableImage(list = [], key) {
  return list.some((item) => !isInvalidImagePath(item && item[key]))
}

function normalizeFoods(list = []) {
  return (list || []).map((item) => {
    const next = Object.assign({}, item)
    if (!next.images || !next.images.length) {
      next.images = next.coverImage ? [next.coverImage] : []
    }
    return next
  })
}

function filterFoodsByCategory(foods = [], categoryId) {
  if (!categoryId) {
    return foods.slice()
  }
  return foods.filter((item) => item.categoryId === categoryId)
}

async function buildLocalCatalog() {
  return {
    categories: await deepResolveDisplayImages(mockData.getCategories()),
    foods: await deepResolveDisplayImages(mockData.getFoods())
  }
}

function getValidMemoryCache() {
  if (
    memoryCache.categories
    && memoryCache.foods
    && Date.now() - Number(memoryCache.fetchedAt || 0) < CACHE_TTL
  ) {
    return {
      categories: memoryCache.categories.slice(),
      foods: memoryCache.foods.slice(),
      fetchedAt: memoryCache.fetchedAt
    }
  }

  return null
}

function getValidStorageCache() {
  const cached = wx.getStorageSync(CACHE_KEY)
  if (
    cached
    && Array.isArray(cached.categories)
    && Array.isArray(cached.foods)
    && Date.now() - Number(cached.fetchedAt || 0) < CACHE_TTL
  ) {
    memoryCache.categories = cached.categories.slice()
    memoryCache.foods = cached.foods.slice()
    memoryCache.fetchedAt = Number(cached.fetchedAt || 0)
    return {
      categories: cached.categories.slice(),
      foods: cached.foods.slice(),
      fetchedAt: memoryCache.fetchedAt
    }
  }

  return null
}

function saveCatalogCache(catalog) {
  const payload = {
    categories: (catalog.categories || []).slice(),
    foods: (catalog.foods || []).slice(),
    fetchedAt: Date.now()
  }

  memoryCache.categories = payload.categories.slice()
  memoryCache.foods = payload.foods.slice()
  memoryCache.fetchedAt = payload.fetchedAt
  wx.setStorageSync(CACHE_KEY, payload)
  return payload
}

async function getFastCatalog() {
  return getValidMemoryCache() || getValidStorageCache() || buildLocalCatalog()
}

async function refreshCatalogFromCloud() {
  const db = wx.cloud.database()
  const results = await Promise.allSettled([
    db.collection('categories').orderBy('sort', 'asc').get(),
    db.collection('foods').where({ status: 1 }).orderBy('sort', 'asc').get()
  ])

  const localCatalog = await buildLocalCatalog()
  const categoryRes = results[0].status === 'fulfilled' ? results[0].value : null
  const foodRes = results[1].status === 'fulfilled' ? results[1].value : null

  const categories = categoryRes && hasUsableImage(categoryRes.data || [], 'icon')
    ? await deepResolveDisplayImages(categoryRes.data || [])
    : localCatalog.categories
  const foods = foodRes && hasUsableImage(foodRes.data || [], 'coverImage')
    ? normalizeFoods(await deepResolveDisplayImages(foodRes.data || []))
    : localCatalog.foods

  return saveCatalogCache({
    categories,
    foods
  })
}

module.exports = {
  CACHE_TTL,
  filterFoodsByCategory,
  getFastCatalog,
  refreshCatalogFromCloud
}
