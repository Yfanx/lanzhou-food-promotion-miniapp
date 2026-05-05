const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages } = require('../../utils/cloud-images')

Page({
  data: {
    documentary: null,
    article: null,
    loading: true
  },

  async onLoad(options) {
    const documentaryId = options.id
    const articleId = options.articleId

    let documentary = documentaryId ? mockData.getDocumentaryById(documentaryId) : null
    if (!documentary && articleId) {
      documentary = mockData.getDocumentaryByArticleId(articleId)
    }

    if (!documentary) {
      wx.showToast({ title: '片源不存在', icon: 'none' })
      this.setData({ loading: false })
      return
    }

    const article = documentary.articleId ? mockData.getArticleById(documentary.articleId) : null
    this.setData({
      documentary: await deepResolveDisplayImages(documentary),
      article: article ? await deepResolveDisplayImages(article) : null,
      loading: false
    })
  },

  goToArticle() {
    const { documentary } = this.data
    if (!documentary || !documentary.articleId) {
      return
    }

    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${documentary.articleId}`
    })
  },

  handleVideoError() {
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  onShareAppMessage() {
    const { documentary } = this.data
    return {
      title: documentary ? documentary.title : '兰州美食宣传片',
      path: `/pages/video-player/index?id=${documentary ? documentary._id : ''}`,
      imageUrl: documentary ? documentary.poster : ''
    }
  }
})
