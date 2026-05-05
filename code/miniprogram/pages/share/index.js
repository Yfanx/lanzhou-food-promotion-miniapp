const app = getApp()
const { deepResolveCloudImages } = require('../../utils/cloud-images')

const DEFAULT_STORIES = [
  {
    id: 'story-1',
    title: '面粉与水的炼金术',
    brief: '看完师傅拉面以后，会更明白为什么这道食物能代表一座城。',
    image: '/assets/test-images/foods/food-beef-noodles-cover.jpg',
    author: '丝路旅行者',
    place: '马子禄牛肉面'
  },
  {
    id: 'story-2',
    title: '香料市场的秘密',
    brief: '从孜然、辣子到烤羊肉的火候，街头摊位里全是惊喜。',
    image: '/assets/test-images/foods/food-lamb-skewers-cover.jpg',
    author: '张记烤肉',
    place: '西关夜市'
  },
  {
    id: 'story-3',
    title: '路上的干粮：馍',
    brief: '不是配角，它本身就是一段迁徙与停驻的历史。',
    image: '/assets/test-images/foods/food-lamb-bread-cover.jpg',
    author: '传承饼屋',
    place: '老城街巷'
  }
]

function buildStoryState(stories = []) {
  return {
    stories,
    featuredStory: stories[0] || null,
    moreStories: stories.slice(1)
  }
}

Page({
  data: {
    content: '',
    images: [],
    maxImages: 9,
    foodId: null,
    stories: [],
    featuredStory: null,
    moreStories: []
  },

  onLoad(options) {
    const storyState = buildStoryState(deepResolveCloudImages(DEFAULT_STORIES))
    storyState.foodId = options.foodId || null
    this.setData(storyState)
  },

  onContentChange(e) {
    this.setData({ content: e.detail.value })
  },

  chooseImage() {
    if (this.data.images.length >= this.data.maxImages) {
      wx.showToast({ title: '最多上传 9 张图片', icon: 'none' })
      return
    }

    wx.chooseImage({
      count: this.data.maxImages - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      }
    })
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.images.slice()
    images.splice(index, 1)
    this.setData({ images })
  },

  async submit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入分享内容', icon: 'none' })
      return
    }

    wx.showLoading({ title: '发布中...' })

    try {
      const db = wx.cloud.database()
      const imageUrls = []

      for (const path of this.data.images) {
        const ext = path.split('.').pop()
        const name = `${Date.now()}-${Math.random()}.${ext}`
        const uploadRes = await wx.cloud.uploadFile({
          cloudPath: `stories/${name}`,
          filePath: path
        })
        imageUrls.push(uploadRes.fileID)
      }

      await db.collection('stories').add({
        data: {
          content: this.data.content,
          images: imageUrls,
          foodId: this.data.foodId,
          authorId: app.globalData.openid || '',
          authorInfo: app.globalData.userInfo || {},
          status: 0,
          createTime: new Date()
        }
      })

      wx.hideLoading()
      wx.showToast({ title: '发布成功，等待审核', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.hideLoading()
      console.error('发布失败', error)
      wx.showToast({ title: '发布失败', icon: 'none' })
    }
  }
})
