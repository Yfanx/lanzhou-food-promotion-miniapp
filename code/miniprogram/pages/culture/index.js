const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath } = require('../../utils/cloud-images')

const TAB_ORDER = ['全部内容', '专题策展', '非遗技艺', '城市记忆', '街巷烟火']

function decorateArticles(list = []) {
  const labels = ['专题策展', '非遗技艺', '城市记忆', '街巷烟火']
  return list.map((item, index) => Object.assign({}, item, {
    sectionLabel: labels[index % labels.length]
  }))
}

function buildArticleState(list = [], activeTab = '全部内容') {
  const decorated = decorateArticles(list)
  const filtered = activeTab === '全部内容'
    ? decorated
    : decorated.filter((item) => item.sectionLabel === activeTab)

  return {
    allArticles: decorated,
    articles: filtered,
    featuredArticle: filtered[0] || decorated[0] || null
  }
}

Page({
  data: {
    allArticles: [],
    articles: [],
    featuredArticle: null,
    loading: true,
    tabs: TAB_ORDER,
    activeTab: '全部内容'
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
      const nextState = buildArticleState(
        await deepResolveDisplayImages(source),
        this.data.activeTab
      )
      nextState.loading = false
      this.setData(nextState)
    } catch (error) {
      console.error('load culture articles failed', error)
      const nextState = buildArticleState(
        await deepResolveDisplayImages(mockData.getArticles()),
        this.data.activeTab
      )
      nextState.loading = false
      this.setData(nextState)
    }
  },

  selectTab(e) {
    const activeTab = e.currentTarget.dataset.tab
    this.setData(Object.assign({ activeTab }, buildArticleState(this.data.allArticles, activeTab)))
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/culture-detail/index?id=${id}`
    })
  },

  goToPromoPage() {
    wx.switchTab({ url: '/pages/promo/index' })
  }
})
