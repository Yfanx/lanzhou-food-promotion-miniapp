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
        title: '牛肉面城市线',
        brief: '从清晨开汤、街口门店到城市记忆，适合做核心宣传主线。',
        tag: '城市名片'
      },
      {
        _id: 'route-2',
        title: '夜市烟火线',
        brief: '围绕夜市、炭火、烤肉和小吃摊位，展示兰州夜间文化氛围。',
        tag: '街区传播'
      },
      {
        _id: 'route-3',
        title: '技艺非遗线',
        brief: '聚焦拉面手艺、配汤经验与传统饮食工艺，强化文化传播价值。',
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
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }

    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${id}`
    })
  }
})
