const { filterFoodsByCategory, getFastCatalog, refreshCatalogFromCloud } = require('../../utils/catalog-cache')

Page({
  data: {
    categories: [],
    selectedCategory: null,
    foods: [],
    loading: false,
    page: 1,
    hasMore: true
  },

  onLoad(options) {
    this.allFoods = []
    this.allCategories = []
    this.setData({ selectedCategory: options.categoryId || null })
    this.bootstrapCatalog()
  },

  async bootstrapCatalog() {
    try {
      const catalog = await getFastCatalog()
      this.applyCatalog(catalog)
    } catch (error) {
      console.error('bootstrap catalog failed', error)
    }

    this.refreshCatalog()
  },

  applyCatalog(catalog) {
    this.allCategories = (catalog.categories || []).slice()
    this.allFoods = (catalog.foods || []).slice()
    this.applySelectedCategory(true)
  },

  async refreshCatalog() {
    if (this.refreshingCatalog) {
      return
    }

    try {
      this.refreshingCatalog = true
      const catalog = await refreshCatalogFromCloud()
      this.applyCatalog(catalog)
    } catch (error) {
      console.error('refresh catalog failed', error)
    } finally {
      this.refreshingCatalog = false
    }
  },

  applySelectedCategory(refresh) {
    const selectedCategory = this.data.selectedCategory
    const filteredFoods = filterFoodsByCategory(this.allFoods || [], selectedCategory)
    const pageSize = 10
    const page = refresh ? 1 : this.data.page
    const visibleFoods = filteredFoods.slice(0, page * pageSize)

    this.setData({
      categories: (this.allCategories || []).slice(),
      foods: visibleFoods,
      loading: false,
      hasMore: filteredFoods.length > visibleFoods.length,
      page
    })
  },

  selectCategory(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      selectedCategory: id,
      foods: [],
      page: 1,
      hasMore: true
    })
    this.applySelectedCategory(true)
  },

  selectAll() {
    this.setData({
      selectedCategory: null,
      foods: [],
      page: 1,
      hasMore: true
    })
    this.applySelectedCategory(true)
  },

  goToFoodDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/food-detail/index?id=${id}`
    })
  },

  onReachBottom() {
    if (this.data.loading || !this.data.hasMore) {
      return
    }

    const selectedCategory = this.data.selectedCategory
    const filteredFoods = filterFoodsByCategory(this.allFoods || [], selectedCategory)
    const nextPage = this.data.page + 1
    const pageSize = 10
    const visibleFoods = filteredFoods.slice(0, nextPage * pageSize)

    this.setData({
      foods: visibleFoods,
      page: nextPage,
      hasMore: filteredFoods.length > visibleFoods.length
    })
  }
})
