const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

function hasUsableImage(list = [], key) {
  return list.some((item) => !isInvalidImagePath(item && item[key]))
}

function buildArchiveState(list = []) {
  return {
    featuredStory: list[0] || null,
    archiveHighlights: list.slice(1, 4)
  }
}

Page({
  data: {
    banners: [],
    promoFeatures: [],
    documentaries: [],
    categories: [],
    activities: [],
    featuredStory: null,
    archiveHighlights: [],
    loading: true
  },

  onLoad() {
    this.loadBanners()
    this.loadPromotions()
    this.loadCategories()
    this.loadArticles()
    this.loadActivities()
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

  async loadArticles() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('articles')
        .where({ type: 'culture', status: 1 })
        .orderBy('createTime', 'desc')
        .limit(4)
        .get()

      const source = res.data.length && hasUsableImage(res.data, 'coverImage')
        ? res.data
        : mockData.getArticles()
      this.setData(buildArchiveState(await deepResolveDisplayImages(source)))
    } catch (error) {
      this.setData(buildArchiveState(await deepResolveDisplayImages(mockData.getArticles())))
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
      this.setData({ activities, loading: false })
    } catch (error) {
      this.setData({
        activities: await deepResolveDisplayImages(mockData.getHomeActivities()),
        loading: false
      })
    }
  },

  goToCategory(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/food-list/index?categoryId=${id}`
    })
  },

  goToFoodList() {
    wx.navigateTo({ url: '/pages/category/index' })
  },

  goToActivity() {
    wx.switchTab({ url: '/pages/activity/index' })
  },

  goToAnnouncement() {
    wx.navigateTo({ url: '/pages/announcement/index' })
  },

  goToPromoPage() {
    wx.switchTab({ url: '/pages/promo/index' })
  },

  goToCulturePage() {
    wx.navigateTo({ url: '/pages/culture/index' })
  },

  goToDocumentary(e) {
    const { documentaryId, articleId, playable } = e.currentTarget.dataset
    const isPlayable = playable === true || playable === 'true' || playable === 1
    if (isPlayable && documentaryId) {
      wx.navigateTo({
        url: `/pages/video-player/index?id=${documentaryId}`
      })
      return
    }

    if (!articleId) {
      this.goToPromoPage()
      return
    }

    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${articleId}`
    })
  },

  goToStoryDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }

    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${id}`
    })
  }
})
