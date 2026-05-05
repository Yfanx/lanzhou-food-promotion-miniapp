const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

function buildArticleState(articles = []) {
  return {
    articles,
    featuredArticle: articles[0] || null
  }
}

Page({
  data: {
    articles: [],
    featuredArticle: null,
    loading: true,
    tabs: ['全部档案', '历史渊源', '传统工艺', '民俗文化', '专家讲座'],
    activeTab: '全部档案'
  },

  onLoad() {
    this.loadArticles()
  },

  async loadArticles() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('articles')
        .where({ type: 'culture', status: 1 })
        .orderBy('createTime', 'desc')
        .get()

      const source = res.data.length && res.data.some((item) => !isInvalidImagePath(item.coverImage))
        ? res.data
        : mockData.getArticles()
      const nextState = buildArticleState(await deepResolveDisplayImages(source))
      nextState.loading = false
      this.setData(nextState)
    } catch (error) {
      console.error('load culture articles failed', error)
      const nextState = buildArticleState(await deepResolveDisplayImages(mockData.getArticles()))
      nextState.loading = false
      this.setData(nextState)
    }
  },

  selectTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${id}`
    })
  }
})
