const app = getApp()
const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')
const { getFastCatalog } = require('../../utils/catalog-cache')

function getCategoryName(categoryId) {
  const category = mockData.getCategories().find((item) => item._id === categoryId)
  return category ? category.name : '地方风味'
}

Page({
  data: {
    food: null,
    images: [],
    loading: true,
    reviews: [
      { name: '张伟', score: '5.0', text: '这道内容很适合做城市名片展示，画面感和故事感都很完整。' },
      { name: 'Elena S.', score: '4.5', text: '从味道延伸到城市气质的表达很清楚，适合作为宣传项目内容。' }
    ],
    nearbyStores: [
      { name: '金城面馆', distance: '距你 1.2km', status: '可作体验点位', cta: '查看路线' },
      { name: '丝路小馆', distance: '距你 0.8km', status: '适合线下打卡', cta: '前往了解' }
    ]
  },

  onLoad(options) {
    if (options.id) {
      this.showFastFood(options.id)
      this.loadFoodDetail(options.id)
    }
  },

  async showFastFood(id) {
    try {
      const catalog = await getFastCatalog()
      const food = (catalog.foods || []).find((item) => item._id === id)
      if (food) {
        this.applyFood(food)
        return
      }
    } catch (error) {
      console.error('show fast food failed', error)
    }

    const localFood = await deepResolveDisplayImages(mockData.getFoodById(id))
    if (localFood) {
      this.applyFood(localFood)
    }
  },

  async loadFoodDetail(id) {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('foods').doc(id).get()
      const food = res.data && !isInvalidImagePath(res.data.coverImage)
        ? await deepResolveDisplayImages(res.data)
        : await deepResolveDisplayImages(mockData.getFoodById(id))
      if (!food) {
        throw new Error('food_not_found')
      }
      this.applyFood(food)
    } catch (error) {
      console.error('load food detail failed', error)
      if (this.data.food) {
        this.setData({ loading: false })
        return
      }
      const food = await deepResolveDisplayImages(mockData.getFoodById(id))
      if (food) {
        this.applyFood(food)
        return
      }
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  applyFood(food) {
    const images = food.images && food.images.length ? food.images : [food.coverImage]
    this.setData({
      food: Object.assign({}, food, {
        categoryName: getCategoryName(food.categoryId)
      }),
      images,
      loading: false
    })
  },

  previewImage(e) {
    const { src } = e.currentTarget.dataset
    wx.previewImage({
      current: src,
      urls: this.data.images
    })
  },

  goToShare() {
    wx.navigateTo({
      url: `/pages/share/index?foodId=${this.data.food._id}`
    })
  },

  goToVote() {
    wx.navigateTo({ url: '/pages/vote/index' })
  },

  goToGroupBuy() {
    wx.navigateTo({ url: '/pages/groupbuy/index' })
  }
})
