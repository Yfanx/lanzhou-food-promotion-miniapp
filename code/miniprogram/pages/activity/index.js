const mockData = require('../../utils/mock-data')
const { deepResolveDisplayImages, isInvalidImagePath, resolveImagePath } = require('../../utils/cloud-images')
const { parseMiniProgramDate } = require('../../utils/date')

const ACTIVITY_FALLBACK_IMAGES = [
  resolveImagePath('/assets/test-images/activities/activity-1.jpg'),
  resolveImagePath('/assets/test-images/activities/activity-2.jpg'),
  resolveImagePath('/assets/test-images/activities/activity-3.jpg')
]

const fallbackVotes = [
  {
    _id: 'vote-1',
    title: '2026 年度最佳面馆',
    status: 1,
    options: [
      { id: 0, name: '马子禄牛肉面', count: 12400 },
      { id: 1, name: '西关桥老面馆', count: 7200 },
      { id: 2, name: '月牙街面馆', count: 5900 }
    ]
  }
]

function resolveActivityImage(coverImage, index) {
  if (!isInvalidImagePath(coverImage)) {
    return coverImage
  }
  return ACTIVITY_FALLBACK_IMAGES[index % ACTIVITY_FALLBACK_IMAGES.length]
}

function enrichActivities(list) {
  return (list || []).map((item, index) => Object.assign({}, item, {
    type: item.type || 'event',
    coverImage: resolveActivityImage(item.coverImage, index),
    displayMonth: String(item.startTime || '').slice(5, 7),
    displayDay: String(item.startTime || '').slice(8, 10),
    typeLabel: item.type === 'lecture' ? '讲座' : '活动'
  }))
}

function buildVoteCards(votes) {
  return (votes || []).map((vote) => {
    const totalCount = (vote.options || []).reduce((sum, option) => sum + Number(option.count || 0), 0)
    return Object.assign({}, vote, {
      totalCount,
      options: (vote.options || []).map((option, index) => Object.assign({}, option, {
        orderLabel: `${index + 1}. ${option.name || option.text || '未命名选项'}`,
        progressWidth: `${totalCount ? (Number(option.count || 0) / totalCount) * 100 : 0}%`
      }))
    })
  })
}

Page({
  data: {
    activities: [],
    upcomingActivities: [],
    heroActivity: null,
    votes: [],
    featuredVote: null,
    loading: true
  },

  onLoad() {
    this.loadActivities()
    this.loadVotes()
  },

  async loadActivities() {
    const applyState = async (source) => {
      const now = new Date()
      const baseActivities = enrichActivities(await deepResolveDisplayImages(source))
      const upcomingActivities = baseActivities.filter((item) => {
        const endDate = parseMiniProgramDate(item.endTime)
        return endDate ? endDate.getTime() >= now.getTime() : true
      })
      const displayActivities = upcomingActivities.length ? upcomingActivities : baseActivities

      this.setData({
        activities: baseActivities,
        upcomingActivities: displayActivities,
        heroActivity: displayActivities[0] || null,
        loading: false
      })
    }

    await applyState(mockData.getActivities())

    try {
      const db = wx.cloud.database()
      const res = await db.collection('activities')
        .where({ status: 1 })
        .orderBy('startTime', 'asc')
        .get()

      const source = res.data.length && res.data.some((item) => !isInvalidImagePath(item.coverImage))
        ? res.data
        : mockData.getActivities()
      await applyState(source)
    } catch (error) {
      console.error('load activities failed', error)
    }
  },

  async loadVotes() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('votes')
        .where({ status: 1 })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get()

      const votes = buildVoteCards(res.data && res.data.length ? res.data : fallbackVotes)
      this.setData({
        votes,
        featuredVote: votes[0] || null
      })
    } catch (error) {
      const votes = buildVoteCards(fallbackVotes)
      this.setData({
        votes,
        featuredVote: votes[0] || null
      })
    }
  },

  goToActivity() {
    wx.pageScrollTo({ scrollTop: 520, duration: 300 })
  },

  goToVote() {
    wx.navigateTo({ url: '/pages/vote/index' })
  },

  goToActivityDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/activity-detail/index?id=${id}` })
  }
})
