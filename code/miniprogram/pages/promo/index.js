const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages } = require('../../utils/cloud-images')

Page({
  data: {
    promoFeatures: [],
    documentaries: [],
    articles: [],
    routes: [
      {
        _id: 'route-1',
        title: '牛肉面城市名片线',
        brief: '从清晨开汤、街口门店到城市记忆，作为项目宣传的主线内容，适合答辩时从首页直接展开。',
        tag: '城市名片'
      },
      {
        _id: 'route-2',
        title: '夜市烟火传播线',
        brief: '围绕夜市、烧烤、小吃摊位和街区人流，突出兰州夜间美食文化的城市氛围。',
        tag: '街区传播'
      },
      {
        _id: 'route-3',
        title: '技艺非遗展示线',
        brief: '聚焦拉面手艺、配汤经验和传统饮食工艺，把项目价值从点餐延伸到文化传播。',
        tag: '非遗表达'
      }
    ]
  },

  async onLoad() {
    this.setData({
      promoFeatures: await deepResolveDisplayImages(mockData.getPromoFeatures()),
      documentaries: await deepResolveDisplayImages(mockData.getDocumentaries()),
      articles: await deepResolveDisplayImages(mockData.getArticles())
    })
  },

  goToArticle(e) {
    const { id, documentaryId, playable } = e.currentTarget.dataset
    const isPlayable = playable === true || playable === 'true' || playable === 1
    if (isPlayable && documentaryId) {
      wx.navigateTo({
        url: `/pages/video-player/index?id=${documentaryId}`
      })
      return
    }

    if (!id) {
      return
    }

    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${id}`
    })
  },

  goToCulturePage() {
    wx.navigateTo({ url: '/pages/culture/index' })
  },

  goToActivityPage() {
    wx.switchTab({ url: '/pages/activity/index' })
  }
})
