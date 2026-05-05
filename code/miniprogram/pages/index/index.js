const app = getApp()
const mockData = require('../../utils/mock-data')
const cloud = require('../../utils/cloud')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

function buildHomeFoods(list = []) {
  return {
    hotFoods: list,
    featuredFood: list[0] || null,
    sideHotFoods: list.slice(1, 4)
  }
}

function hasUsableImage(list = [], key) {
  return list.some((item) => !isInvalidImagePath(item && item[key]))
}

Page({
  data: {
    banners: [],
    promoFeatures: [],
    documentaries: [],
    categories: [],
    hotFoods: [],
    featuredFood: null,
    sideHotFoods: [],
    recommendations: [],
    activities: [],
    loading: true
  },

  onLoad() {
    this.loadBanners()
    this.loadPromotions()
    this.loadCategories()
    this.loadHotFoods()
    this.loadActivities()
    if (app.globalData.userInfo) {
      this.loadRecommendations()
    }
  },

  onShow() {
    if (!app.globalData.openid) {
      this.checkLogin()
      return
    }

    this.loadRecommendations()
  },

  async checkLogin() {
    try {
      const userInfo = await app.getUserInfo()
      app.globalData.userInfo = userInfo
      this.loadRecommendations()
    } catch (error) {
      this.setData({ recommendations: [] })
    }
  },

  async loadBanners() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('carousels')
        .where({ status: 1 })
        .orderBy('sort', 'asc')
        .get()

      const rawBanners = (res.data || []).map((item) => Object.assign({}, item, {
        image: item.image || item.Image
      }))
      const banners = await deepResolveDisplayImages(
        hasUsableImage(rawBanners, 'image') ? rawBanners : mockData.getBanners()
      )
      this.setData({ banners })
    } catch (error) {
      this.setData({ banners: await deepResolveDisplayImages(mockData.getBanners()) })
    }
  },

  async loadPromotions() {
    this.setData({
      promoFeatures: await deepResolveDisplayImages(mockData.getPromoFeatures()),
      documentaries: await deepResolveDisplayImages(mockData.getDocumentaries())
    })
  },

  async loadCategories() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('categories')
        .orderBy('sort', 'asc')
        .get()

      const categories = await deepResolveDisplayImages(
        hasUsableImage(res.data || [], 'icon') ? res.data : mockData.getCategories()
      )
      this.setData({ categories })
    } catch (error) {
      this.setData({ categories: await deepResolveDisplayImages(mockData.getCategories()) })
    }
  },

  async loadHotFoods() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('foods')
        .where({ status: 1, isHot: 1 })
        .orderBy('sort', 'asc')
        .limit(10)
        .get()

      const foods = await deepResolveDisplayImages(
        hasUsableImage(res.data || [], 'coverImage') ? res.data : mockData.getHotFoods()
      )
      const nextState = buildHomeFoods(foods)
      nextState.loading = false
      this.setData(nextState)
    } catch (error) {
      const nextState = buildHomeFoods(await deepResolveDisplayImages(mockData.getHotFoods()))
      nextState.loading = false
      this.setData(nextState)
    }
  },

  async loadActivities() {
    try {
      const db = wx.cloud.database()
      const now = new Date()
      const res = await db.collection('activities')
        .where({
          status: 1,
          startTime: db.command.lte(now),
          endTime: db.command.gte(now)
        })
        .orderBy('startTime', 'asc')
        .limit(5)
        .get()

      const activities = await deepResolveDisplayImages(
        hasUsableImage(res.data || [], 'coverImage') ? res.data : mockData.getHomeActivities()
      )
      this.setData({ activities })
    } catch (error) {
      this.setData({ activities: await deepResolveDisplayImages(mockData.getHomeActivities()) })
    }
  },

  async loadRecommendations() {
    if (this.recommendationsLoading) {
      return
    }

    if (!app.globalData.userInfo) {
      this.setData({ recommendations: [] })
      return
    }

    try {
      this.recommendationsLoading = true
      const res = await cloud.callFunction('getRecommendations', { limit: 2 })
      const result = res.result || res
      this.setData({ recommendations: await deepResolveDisplayImages(result.foods || []) })
    } catch (error) {
      this.setData({ recommendations: [] })
    } finally {
      this.recommendationsLoading = false
    }
  },

  goToCategory(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/food-list/index?categoryId=${id}`
    })
  },

  goToFoodDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/food-detail/index?id=${id}`
    })
  },

  goToActivity() {
    wx.switchTab({ url: '/pages/activity/index' })
  },

  goToAnnouncement() {
    wx.navigateTo({ url: '/pages/announcement/index' })
  },

  goToFoodList() {
    wx.switchTab({ url: '/pages/category/index' })
  },

  goToPromoPage() {
    wx.navigateTo({ url: '/pages/promo/index' })
  },

  goToDocumentary(e) {
    const { articleId } = e.currentTarget.dataset
    if (!articleId) {
      this.goToPromoPage()
      return
    }

    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${articleId}`
    })
  },

  goToRecommendation(e) {
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }

    wx.navigateTo({
      url: `/pages/food-detail/index?id=${id}`
    })
  }
})
