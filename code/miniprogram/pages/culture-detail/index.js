const cloud = require('../../utils/cloud.js')
const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

Page({
  data: {
    article: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.showFastArticle(options.id)
      this.loadArticle(options.id)
    }
  },

  async showFastArticle(id) {
    const article = mockData.getArticles().find((item) => item._id === id) || mockData.getArticles()[0]
    if (!article) {
      return
    }

    this.setData({
      article: await deepResolveDisplayImages(article),
      loading: false
    })
  },

  async loadArticle(id) {
    if (!this.data.article) {
      this.setData({ loading: true })
    }
    try {
      const res = await cloud.callFunction('getArticleDetail', { id })
      const result = res.result || res
      if (result.article && !isInvalidImagePath(result.article.coverImage)) {
        this.setData({ article: await deepResolveDisplayImages(result.article), loading: false })
      } else {
        throw new Error('not_found')
      }
    } catch (error) {
      if (this.data.article) {
        this.setData({ loading: false })
        return
      }
      const article = mockData.getArticles().find((item) => item._id === id) || mockData.getArticles()[0]
      this.setData({ article: await deepResolveDisplayImages(article), loading: false })
    }
  },

  onShareAppMessage() {
    const { article } = this.data
    return {
      title: article ? article.title : '兰州美食文化',
      path: `/pages/culture-detail/index?id=${article ? article._id : ''}`,
      imageUrl: article ? article.coverImage : ''
    }
  }
})
