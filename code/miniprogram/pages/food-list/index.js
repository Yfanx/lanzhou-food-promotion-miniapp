const { filterFoodsByCategory, getFastCatalog, refreshCatalogFromCloud } = require('../../utils/catalog-cache')

Page({
  data: {
    foods: [],
    loading: false,
    page: 1,
    hasMore: true
  },

  onLoad(options) {
    this.allFoods = []
    if (options.categoryId) {
      this.setData({ categoryId: options.categoryId })
    }
    this.bootstrapFoods()
  },

  async bootstrapFoods() {
    try {
      const catalog = await getFastCatalog()
      this.allFoods = (catalog.foods || []).slice()
      this.applyFoods(true)
    } catch (error) {
      console.error('bootstrap foods failed', error)
    }

    this.refreshFoods()
  },

  async refreshFoods() {
    if (this.refreshingFoods) {
      return
    }

    try {
      this.refreshingFoods = true
      const catalog = await refreshCatalogFromCloud()
      this.allFoods = (catalog.foods || []).slice()
      this.applyFoods(true)
    } catch (error) {
      console.error('refresh foods failed', error)
    } finally {
      this.refreshingFoods = false
    }
  },

  applyFoods(refresh) {
    const filteredFoods = filterFoodsByCategory(this.allFoods || [], this.data.categoryId)
    const page = refresh ? 1 : this.data.page
    const pageSize = 10
    const visibleFoods = filteredFoods.slice(0, page * pageSize)

    this.setData({
      foods: visibleFoods,
      loading: false,
      hasMore: filteredFoods.length > visibleFoods.length,
      page
    })
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

    const filteredFoods = filterFoodsByCategory(this.allFoods || [], this.data.categoryId)
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
