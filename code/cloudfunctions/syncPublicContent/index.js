const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const ENV_ID = 'cloud1-7glyj8fy8135ce71'
const BASE = `cloud://${ENV_ID}/test-images`

const banners = [
  { _id: 'banner-1', image: `${BASE}/banners/banner-1.jpg`, title: '兰州牛肉面', sort: 1, status: 1, link: '/pages/index/index' },
  { _id: 'banner-2', image: `${BASE}/banners/banner-2.jpg`, title: '丝路烟火夜市', sort: 2, status: 1, link: '/pages/activity/index' },
  { _id: 'banner-3', image: `${BASE}/banners/banner-3.jpg`, title: '一城一味兰州', sort: 3, status: 1, link: '/pages/culture/index' }
]

const categories = [
  { _id: 'cat-noodles', name: '面食主打', icon: `${BASE}/categories/category-noodles.jpg`, sort: 1, order: 1, status: 1 },
  { _id: 'cat-barbecue', name: '西北烤味', icon: `${BASE}/categories/category-barbecue.jpg`, sort: 2, order: 2, status: 1 },
  { _id: 'cat-snacks', name: '经典小吃', icon: `${BASE}/categories/category-snacks.jpg`, sort: 3, order: 3, status: 1 },
  { _id: 'cat-dessert', name: '甜口点心', icon: `${BASE}/categories/category-dessert.jpg`, sort: 4, order: 4, status: 1 },
  { _id: 'cat-drinks', name: '特色饮品', icon: `${BASE}/categories/category-drinks.jpg`, sort: 5, order: 5, status: 1 },
  { _id: 'cat-breakfast', name: '清晨早点', icon: `${BASE}/categories/category-breakfast.jpg`, sort: 6, order: 6, status: 1 }
]

const foods = [
  {
    _id: 'food-beef-noodles',
    name: '金城牛肉面',
    brief: '清汤透亮、牛肉酥烂，是首页与详情页的主打展示款。',
    description: '兰州牛肉面被广泛视为城市饮食名片，常见组合为牛肉、白萝卜、蒜苗与辣子油，适合作为毕设首页、推荐与讲座关联内容中的核心美食案例。',
    coverImage: `${BASE}/foods/food-beef-noodles-cover.jpg`,
    images: [
      `${BASE}/foods/food-beef-noodles-cover.jpg`,
      `${BASE}/foods/food-beef-noodles-detail-1.jpg`,
      `${BASE}/foods/food-beef-noodles-detail-2.jpg`
    ],
    price: 28,
    originalPrice: 32,
    discountPrice: 24,
    stock: 66,
    sales: 218,
    categoryId: 'cat-noodles',
    isHot: 1,
    isDiscount: 1,
    status: 1,
    sort: 1,
    sourceName: '中国甘肃网',
    sourceUrl: 'https://gansu.gscn.com.cn/system/2020/05/08/012380371.shtml'
  },
  {
    _id: 'food-lamb-skewers',
    name: '炭烤羊肉串',
    brief: '偏夜市风格的人气单品，适合活动和团购场景联动展示。',
    description: '西北烧烤是兰州夜间饮食场景的重要组成部分，适合和活动页、夜游主题内容一起形成更强的城市烟火感。',
    coverImage: `${BASE}/foods/food-lamb-skewers-cover.jpg`,
    images: [
      `${BASE}/foods/food-lamb-skewers-cover.jpg`,
      `${BASE}/foods/food-lamb-skewers-detail-1.jpg`
    ],
    price: 22,
    originalPrice: 26,
    stock: 80,
    sales: 168,
    categoryId: 'cat-barbecue',
    isHot: 1,
    isDiscount: 0,
    status: 1,
    sort: 2,
    sourceName: '平台整理自公开资料',
    sourceUrl: 'https://www.gswbj.gov.cn/a/2024/02/22/19750.html'
  },
  {
    _id: 'food-niangpi',
    name: '爽口酿皮',
    brief: '兰州街头辨识度很高的小吃，适合分类页与特价页展示。',
    description: '酿皮常搭配辣油、蒜汁和醋汁，是地方风味展示中最容易被游客记住的经典小吃之一。',
    coverImage: `${BASE}/foods/food-niangpi-cover.jpg`,
    images: [`${BASE}/foods/food-niangpi-cover.jpg`],
    price: 14,
    originalPrice: 18,
    discountPrice: 11,
    stock: 120,
    sales: 196,
    categoryId: 'cat-snacks',
    isHot: 1,
    isDiscount: 1,
    status: 1,
    sort: 3,
    sourceName: '甘肃省文化和旅游厅',
    sourceUrl: 'https://www.gswbj.gov.cn/a/2024/02/22/19750.html'
  },
  {
    _id: 'food-jiangshui',
    name: '浆水面',
    brief: '风味鲜明的面食品类，用于补足列表页和详情页层次。',
    description: '浆水面在西北饮食中具有明显地域特色，适合在文化页中解释其与地方气候、口味偏好的关系。',
    coverImage: `${BASE}/foods/food-jiangshui-cover.jpg`,
    images: [`${BASE}/foods/food-jiangshui-cover.jpg`],
    price: 20,
    originalPrice: 24,
    stock: 58,
    sales: 102,
    categoryId: 'cat-noodles',
    isHot: 0,
    isDiscount: 0,
    status: 1,
    sort: 4
  },
  {
    _id: 'food-grey-bean',
    name: '灰豆子',
    brief: '甜口小吃，适合补足品类丰富度与视觉对比。',
    description: '灰豆子是兰州本地常见的甜品类小吃，能够帮助前台形成“咸辣与甜口并存”的更完整饮食印象。',
    coverImage: `${BASE}/foods/food-grey-bean-cover.jpg`,
    images: [`${BASE}/foods/food-grey-bean-cover.jpg`],
    price: 12,
    originalPrice: 15,
    stock: 88,
    sales: 91,
    categoryId: 'cat-dessert',
    isHot: 0,
    isDiscount: 0,
    status: 1,
    sort: 5
  },
  {
    _id: 'food-fried-pastry',
    name: '油香酥饼',
    brief: '适合早点场景展示，补足分类页的早餐入口。',
    description: '早餐类内容可以丰富小程序使用场景，让推荐和分类不只停留在“正餐”与“夜市”两类。 ',
    coverImage: `${BASE}/foods/food-fried-pastry-cover.jpg`,
    images: [`${BASE}/foods/food-fried-pastry-cover.jpg`],
    price: 10,
    originalPrice: 12,
    discountPrice: 8,
    stock: 140,
    sales: 75,
    categoryId: 'cat-breakfast',
    isHot: 0,
    isDiscount: 1,
    status: 1,
    sort: 6
  },
  {
    _id: 'food-lamb-bread',
    name: '羊肉夹饼',
    brief: '饱腹感强，适合团购和专题推荐联动。',
    description: '羊肉夹饼兼具便携和饱腹属性，适合作为活动期间的配套餐食与团购套餐单品。',
    coverImage: `${BASE}/foods/food-lamb-bread-cover.jpg`,
    images: [`${BASE}/foods/food-lamb-bread-cover.jpg`],
    price: 18,
    originalPrice: 22,
    stock: 46,
    sales: 134,
    categoryId: 'cat-breakfast',
    isHot: 1,
    isDiscount: 0,
    status: 1,
    sort: 7
  },
  {
    _id: 'food-sweet-rice',
    name: '甜醅子',
    brief: '甘甜爽口，适合甜品与特色饮品过渡展示。',
    description: '甜醅子是极具地方辨识度的风味甜食，适合在文化页、饮品页和推荐区强化“兰州味道”的多样性。',
    coverImage: `${BASE}/foods/food-sweet-rice-cover.jpg`,
    images: [`${BASE}/foods/food-sweet-rice-cover.jpg`],
    price: 16,
    originalPrice: 20,
    stock: 72,
    sales: 86,
    categoryId: 'cat-dessert',
    isHot: 0,
    isDiscount: 0,
    status: 1,
    sort: 8
  },
  {
    _id: 'food-tea',
    name: '三泡台',
    brief: '既能做饮品展示，也能作为文化叙事中的地方待客符号。',
    description: '三泡台不仅是日常饮品，也常被视作西北待客文化的体现，适合和讲座活动、城市文化内容做关联。',
    coverImage: `${BASE}/foods/food-tea-cover.jpg`,
    images: [`${BASE}/foods/food-tea-cover.jpg`],
    price: 15,
    originalPrice: 19,
    discountPrice: 12,
    stock: 95,
    sales: 142,
    categoryId: 'cat-drinks',
    isHot: 1,
    isDiscount: 1,
    status: 1,
    sort: 9
  }
]

const activities = [
  {
    _id: 'activity-1',
    title: '兰州牛肉面文化公开讲座',
    brief: '围绕牛肉面工艺、非遗传播与城市饮食记忆展开的线上讲座。',
    description: '本场讲座适合作为毕设中的“线上讲座”演示案例，用于说明美食文化传播与讲座报名链路。',
    coverImage: `${BASE}/activities/activity-1.jpg`,
    startTime: '2026-05-10 19:30',
    endTime: '2026-05-10 21:00',
    signupDeadline: '2026-05-09 18:00',
    type: 'lecture',
    location: '线上直播间',
    speaker: '兰州饮食文化研究讲师',
    capacity: 120,
    status: 1,
    sort: 1,
    sourceName: '中国甘肃网',
    sourceUrl: 'https://gansu.gscn.com.cn/system/2020/05/08/012380371.shtml'
  },
  {
    _id: 'activity-2',
    title: '黄河风味夜游体验活动',
    brief: '结合夜游与地方风味的线下活动，可演示报名和详情页链路。',
    description: '活动围绕黄河风情线、地方饮食与夜游体验展开，适合前台活动页、详情页与后台报名管理联调展示。',
    coverImage: `${BASE}/activities/activity-2.jpg`,
    startTime: '2026-05-18 18:30',
    endTime: '2026-05-18 21:30',
    signupDeadline: '2026-05-17 18:00',
    type: 'event',
    location: '兰州市黄河风情线',
    speaker: '',
    capacity: 80,
    status: 1,
    sort: 2,
    sourceName: '甘肃省文化和旅游厅',
    sourceUrl: 'https://www.gswbj.gov.cn/a/2024/02/22/19750.html'
  },
  {
    _id: 'activity-3',
    title: '非遗饮食主题分享沙龙',
    brief: '小型线下分享活动，支持讲座类型活动样式展示。',
    description: '围绕非遗饮食、城市品牌与青年传播展开的小型分享，适合在答辩中演示讲座型活动与普通活动并存的数据模型。',
    coverImage: `${BASE}/activities/activity-3.jpg`,
    startTime: '2026-05-24 14:00',
    endTime: '2026-05-24 16:00',
    signupDeadline: '2026-05-23 18:00',
    type: 'lecture',
    location: '兰州文化体验空间',
    speaker: '地方文化志愿讲师',
    capacity: 60,
    status: 1,
    sort: 3,
    sourceName: '兰州市政协',
    sourceUrl: 'https://www.gslzzx.gov.cn/art/2021/12/28/art_11982_1082971.html'
  }
]

const groupBuyProducts = [
  { _id: 'groupbuy-1', foodId: 'food-beef-noodles', name: '牛肉面双人套餐', coverImage: `${BASE}/groupbuy/groupbuy-1.jpg`, groupPrice: 45, originalPrice: 56, minPeople: 2, stock: 32, status: 1, sort: 1 },
  { _id: 'groupbuy-2', foodId: 'food-niangpi', name: '西北小吃拼盘', coverImage: `${BASE}/groupbuy/groupbuy-2.jpg`, groupPrice: 29, originalPrice: 38, minPeople: 3, stock: 24, status: 1, sort: 2 },
  { _id: 'groupbuy-3', foodId: 'food-tea', name: '茶饮分享组合', coverImage: `${BASE}/groupbuy/groupbuy-3.jpg`, groupPrice: 26, originalPrice: 33, minPeople: 2, stock: 41, status: 1, sort: 3 }
]

const articles = [
  {
    _id: 'article-1',
    title: '兰州牛肉面数字传播案例',
    brief: '围绕牛肉面非遗数字化传播整理的文化文章，适合在文化页和讲座关联内容中展示。',
    content: '兰州牛肉面既是地方饮食符号，也是城市文化名片。公开报道中提到，非遗上云与数字传播让兰州牛肉面的工艺、品牌和城市记忆有了新的展示方式。',
    coverImage: `${BASE}/articles/article-1.jpg`,
    type: 'culture',
    sourceName: '中国甘肃网',
    sourceUrl: 'https://gansu.gscn.com.cn/system/2020/05/08/012380371.shtml',
    publishedAt: '2020-05-08',
    status: 1,
    sort: 1
  },
  {
    _id: 'article-2',
    title: '兰州饮食文化与城市文旅融合',
    brief: '以官方文旅报道为依据，概括兰州文旅与地方饮食、夜游体验、城市形象传播之间的结合方式。',
    content: '官方文旅报道将兰州放在黄河文化、夜游经济与城市体验的背景中观察。饮食不再只是单一消费内容，而是与城市空间、文化活动和游客体验共同构成文旅场景。',
    coverImage: `${BASE}/articles/article-2.jpg`,
    type: 'culture',
    sourceName: '甘肃省文化和旅游厅',
    sourceUrl: 'https://www.gswbj.gov.cn/a/2024/02/22/19750.html',
    publishedAt: '2024-02-22',
    status: 1,
    sort: 2
  },
  {
    _id: 'article-3',
    title: '兰州牛肉面非遗保护背景梳理',
    brief: '结合公开提案材料整理的非遗保护背景说明，适合作为讲座详情页的相关阅读。',
    content: '围绕兰州牛肉面非遗保护的公开材料强调了技艺传承、品牌保护、标准建设和产业推广的协同推进，适合用于说明其在地方文化传承中的代表意义。',
    coverImage: `${BASE}/articles/article-3.jpg`,
    type: 'heritage',
    sourceName: '兰州市政协',
    sourceUrl: 'https://www.gslzzx.gov.cn/art/2021/12/28/art_11982_1082971.html',
    publishedAt: '2021-12-28',
    status: 1,
    sort: 3
  }
]

const announcements = [
  {
    _id: 'announcement-1',
    title: '文化专题内容已更新',
    brief: '平台已补充兰州牛肉面、城市文旅与非遗保护相关公开资料。',
    content: '本次更新整理了公开来源中的饮食文化与文旅内容，现已同步到文化页与讲座相关阅读中，可用于课堂展示与毕设答辩演示。',
    type: 0,
    isTop: 1,
    status: 1,
    publishedAt: '2026-04-27',
    sort: 1,
    sourceName: '平台整理自公开资料',
    sourceUrl: 'https://www.gswbj.gov.cn/a/2024/02/22/19750.html'
  },
  {
    _id: 'announcement-2',
    title: '活动报名已支持手机号校验',
    brief: '前台活动报名与团购下单链路已经统一接入手机号绑定校验。',
    content: '为保证活动报名、订单创建与个人资料信息完整，系统已将手机号授权作为关键业务节点的校验条件。',
    type: 0,
    isTop: 0,
    status: 1,
    publishedAt: '2026-04-27',
    sort: 2,
    sourceName: '平台功能更新',
    sourceUrl: ''
  },
  {
    _id: 'announcement-3',
    title: '新增规则推荐与讲座型活动',
    brief: '系统已支持规则推荐与活动集合中的 lecture 类型演示。',
    content: '推荐结果会优先参考收藏、订单与热门销量数据；无历史记录时回退到热门美食与文化内容，便于演示个性化推荐能力。',
    type: 0,
    isTop: 0,
    status: 1,
    publishedAt: '2026-04-27',
    sort: 3,
    sourceName: '平台功能更新',
    sourceUrl: ''
  }
]

const collections = [
  ['carousels', banners],
  ['categories', categories],
  ['foods', foods],
  ['activities', activities],
  ['group_buy_products', groupBuyProducts],
  ['articles', articles],
  ['announcements', announcements]
]

async function clearCollection(db, name) {
  const collection = db.collection(name)
  try {
    while (true) {
      const res = await collection.limit(100).get()
      const docs = res.data || []
      if (!docs.length) {
        break
      }

      for (const doc of docs) {
        await collection.doc(doc._id).remove()
      }

      if (docs.length < 100) {
        break
      }
    }
  } catch (error) {
    if (!String(error.message || '').includes('collection not exists')) {
      throw error
    }
  }
}

async function seedCollection(db, name, docs) {
  const collection = db.collection(name)
  await clearCollection(db, name)
  for (const doc of docs) {
    await collection.add({
      data: {
        ...doc,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
  }
  const res = await collection.limit(200).get()
  return (res.data || []).length
}

exports.main = async () => {
  const db = cloud.database()
  const result = {}
  const errors = {}

  try {
    for (const [name, docs] of collections) {
      try {
        result[name] = await seedCollection(db, name, docs)
      } catch (error) {
        errors[name] = error.message
      }
    }
    return { success: Object.keys(errors).length === 0, result, errors }
  } catch (error) {
    return { success: false, error: error.message, result, errors }
  }
}
