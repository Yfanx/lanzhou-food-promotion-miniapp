const cloud = require('../../utils/cloud.js')
const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

function buildLocalArticle(id) {
  return mockData.getArticleById(id) || mockData.getArticles()[0] || null
}

function buildDocumentary(article) {
  if (!article || !article._id) {
    return null
  }
  return mockData.getDocumentaryByArticleId(article._id)
}

Page({
  data: {
    article: null,
    documentary: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.showFastArticle(options.id)
      this.loadArticle(options.id)
    }
  },

  async showFastArticle(id) {
    const article = buildLocalArticle(id)
    if (!article) {
      return
    }

    const documentary = buildDocumentary(article)
    this.setData({
      article: await deepResolveDisplayImages(article),
      documentary: documentary ? await deepResolveDisplayImages(documentary) : null,
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
        const article = result.article
        const documentary = buildDocumentary(article)
        this.setData({
          article: await deepResolveDisplayImages(article),
          documentary: documentary ? await deepResolveDisplayImages(documentary) : null,
          loading: false
        })
      } else {
        throw new Error('not_found')
      }
    } catch (error) {
      if (this.data.article) {
        this.setData({ loading: false })
        return
      }
      const article = buildLocalArticle(id)
      const documentary = buildDocumentary(article)
      this.setData({
        article: await deepResolveDisplayImages(article),
        documentary: documentary ? await deepResolveDisplayImages(documentary) : null,
        loading: false
      })
    }
  },

  goToVideoPage() {
    const { documentary } = this.data
    if (!documentary) {
      return
    }

    wx.navigateTo({
      url: `/pages/video-player/index?id=${documentary._id}`
    })
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
