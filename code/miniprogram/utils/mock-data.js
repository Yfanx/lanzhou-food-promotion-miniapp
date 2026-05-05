const banners = [
  {
    _id: 'banner-1',
    image: '/assets/test-images/banners/banner-1.jpg',
    title: '兰州牛肉面',
    sort: 1,
    status: 1
  },
  {
    _id: 'banner-2',
    image: '/assets/test-images/banners/banner-2.jpg',
    title: '街头烟火气',
    sort: 2,
    status: 1
  },
  {
    _id: 'banner-3',
    image: '/assets/test-images/banners/banner-3.jpg',
    title: '人气面点',
    sort: 3,
    status: 1
  }
]

const categories = [
  { _id: 'cat-noodles', name: '面食主打', icon: '/assets/test-images/categories/category-noodles.jpg', sort: 1 },
  { _id: 'cat-barbecue', name: '西北烤味', icon: '/assets/test-images/categories/category-barbecue.jpg', sort: 2 },
  { _id: 'cat-snacks', name: '经典小吃', icon: '/assets/test-images/categories/category-snacks.jpg', sort: 3 },
  { _id: 'cat-dessert', name: '甜口点心', icon: '/assets/test-images/categories/category-dessert.jpg', sort: 4 },
  { _id: 'cat-drinks', name: '特色饮品', icon: '/assets/test-images/categories/category-drinks.jpg', sort: 5 },
  { _id: 'cat-breakfast', name: '清晨早点', icon: '/assets/test-images/categories/category-breakfast.jpg', sort: 6 }
]

const foods = [
  {
    _id: 'food-beef-noodles',
    name: '金城牛肉面',
    brief: '清汤透亮、牛肉酥烂，是最适合首页展示的主打款。',
    description: '<p>测试数据使用免费图库图片，方便先联调页面结构与图片布局。</p><p>后续你可以直接替换成更贴近兰州本地门店的正式素材。</p>',
    coverImage: '/assets/test-images/foods/food-beef-noodles-cover.jpg',
    images: [
      '/assets/test-images/foods/food-beef-noodles-cover.jpg',
      '/assets/test-images/foods/food-beef-noodles-detail-1.jpg',
      '/assets/test-images/foods/food-beef-noodles-detail-2.jpg'
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
    sort: 1
  },
  {
    _id: 'food-lamb-skewers',
    name: '炭烤羊肉串',
    brief: '偏夜市风格的高人气单品，适合配活动图与团购图一起测试。',
    description: '<p>这组数据主要用于测试列表卡片、团购页和详情轮播。</p>',
    coverImage: '/assets/test-images/foods/food-lamb-skewers-cover.jpg',
    images: [
      '/assets/test-images/foods/food-lamb-skewers-cover.jpg',
      '/assets/test-images/foods/food-lamb-skewers-detail-1.jpg'
    ],
    price: 22,
    originalPrice: 26,
    stock: 80,
    sales: 168,
    categoryId: 'cat-barbecue',
    isHot: 1,
    isDiscount: 0,
    status: 1,
    sort: 2
  },
  {
    _id: 'food-niangpi',
    name: '爽口酿皮',
    brief: '凉爽开胃，适合作为小吃类目测试图。',
    description: '<p>用于验证分类图、列表图和特价图之间的复用情况。</p>',
    coverImage: '/assets/test-images/foods/food-niangpi-cover.jpg',
    images: ['/assets/test-images/foods/food-niangpi-cover.jpg'],
    price: 14,
    originalPrice: 18,
    discountPrice: 11,
    stock: 120,
    sales: 196,
    categoryId: 'cat-snacks',
    isHot: 1,
    isDiscount: 1,
    status: 1,
    sort: 3
  },
  {
    _id: 'food-jiangshui',
    name: '浆水面',
    brief: '用来补足汤面品类，适合分类页与详情页测试。',
    description: '<p>保留单图结构，验证 foods.images 缺省时的回退行为。</p>',
    coverImage: '/assets/test-images/foods/food-jiangshui-cover.jpg',
    images: [],
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
    brief: '甜口汤羹，用于测试甜品分类和图文节奏。',
    description: '<p>甜品类单品，适合测试不同色调图片在列表中的视觉对比。</p>',
    coverImage: '/assets/test-images/foods/food-grey-bean-cover.jpg',
    images: ['/assets/test-images/foods/food-grey-bean-cover.jpg'],
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
    brief: '适合早餐场景展示，补足页面卡片密度。',
    description: '<p>用于测试早餐类卡片在瀑布流/列表里的排版表现。</p>',
    coverImage: '/assets/test-images/foods/food-fried-pastry-cover.jpg',
    images: ['/assets/test-images/foods/food-fried-pastry-cover.jpg'],
    price: 10,
    originalPrice: 12,
    stock: 140,
    sales: 75,
    categoryId: 'cat-breakfast',
    isHot: 0,
    isDiscount: 1,
    discountPrice: 8,
    status: 1,
    sort: 6
  },
  {
    _id: 'food-lamb-bread',
    name: '羊肉夹饼',
    brief: '高饱腹感单品，用于测试活动和团购关联商品。',
    description: '<p>可以后续替换为更贴近本地门店的正式图。</p>',
    coverImage: '/assets/test-images/foods/food-lamb-bread-cover.jpg',
    images: ['/assets/test-images/foods/food-lamb-bread-cover.jpg'],
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
    brief: '清甜发酵米饮风味，适合测试饮品与甜品之间的过渡。',
    description: '<p>用于测试饮品/甜品混合类目在前台展示时的视觉效果。</p>',
    coverImage: '/assets/test-images/foods/food-sweet-rice-cover.jpg',
    images: ['/assets/test-images/foods/food-sweet-rice-cover.jpg'],
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
    brief: '适合在饮品类和文化页联动展示的测试素材。',
    description: '<p>饮品图也可以在活动海报、文化页封面里复用。</p>',
    coverImage: '/assets/test-images/foods/food-tea-cover.jpg',
    images: ['/assets/test-images/foods/food-tea-cover.jpg'],
    price: 15,
    originalPrice: 19,
    stock: 95,
    sales: 142,
    categoryId: 'cat-drinks',
    isHot: 1,
    isDiscount: 1,
    discountPrice: 12,
    status: 1,
    sort: 9
  }
]

const activities = [
  {
    _id: 'activity-1',
    title: '兰州面食文化周',
    brief: '用三张活动图先跑通首页与活动页的展示节奏。',
    coverImage: '/assets/test-images/activities/activity-1.jpg',
    startTime: '2026-04-10',
    endTime: '2026-05-10',
    status: 1
  },
  {
    _id: 'activity-2',
    title: '家庭料理体验课',
    brief: '适合测试报名活动类型的卡片样式。',
    coverImage: '/assets/test-images/activities/activity-2.jpg',
    startTime: '2026-04-18',
    endTime: '2026-05-18',
    status: 1
  },
  {
    _id: 'activity-3',
    title: '夜市美食打卡节',
    brief: '补足热闹夜市风格，方便后续替换成正式海报。',
    coverImage: '/assets/test-images/activities/activity-3.jpg',
    startTime: '2026-04-20',
    endTime: '2026-05-25',
    status: 1
  }
]

const groupBuyProducts = [
  {
    _id: 'groupbuy-1',
    foodId: 'food-beef-noodles',
    name: '牛肉面双人套餐',
    coverImage: '/assets/test-images/groupbuy/groupbuy-1.jpg',
    groupPrice: 45,
    originalPrice: 56,
    minPeople: 2,
    stock: 32,
    status: 1,
    sort: 1
  },
  {
    _id: 'groupbuy-2',
    foodId: 'food-niangpi',
    name: '西北小吃拼盘',
    coverImage: '/assets/test-images/groupbuy/groupbuy-2.jpg',
    groupPrice: 29,
    originalPrice: 38,
    minPeople: 3,
    stock: 24,
    status: 1,
    sort: 2
  },
  {
    _id: 'groupbuy-3',
    foodId: 'food-tea',
    name: '茶饮分享组合',
    coverImage: '/assets/test-images/groupbuy/groupbuy-3.jpg',
    groupPrice: 26,
    originalPrice: 33,
    minPeople: 2,
    stock: 41,
    status: 1,
    sort: 3
  }
]

const articles = [
  {
    _id: 'article-1',
    title: '一碗面里的城市记忆',
    brief: '用测试图先建立文化页的信息密度和图文比例。',
    coverImage: '/assets/test-images/articles/article-1.jpg',
    createTime: '2026-04-15',
    status: 1,
    type: 'culture',
    category: '城市名片',
    content: '清晨的兰州往往从一碗面开始。牛肉面不只是食物本身，它还是城市节奏、街巷记忆和外地游客理解兰州的第一入口。这个专题把门店晨起、汤锅开汤、食客进店和城市日常并置起来，突出兰州美食作为城市名片的传播价值。',
    documentaryId: 'doc-1'
  },
  {
    _id: 'article-2',
    title: '从手工到汤头的制作节奏',
    brief: '讲述面食制作过程，适合承接活动与文化页的风格。',
    coverImage: '/assets/test-images/articles/article-2.jpg',
    createTime: '2026-04-14',
    status: 1,
    type: 'culture',
    category: '非遗技艺',
    content: '从和面、醒面、拉面到浇汤，一碗面的完成包含大量经验和手工判断。这个专题把拉面师傅的技艺、配比逻辑和出餐节奏组织成可展示的内容，强调项目的宣传方向不是售卖，而是讲清楚手艺、人物和传承。',
    documentaryId: 'doc-2'
  },
  {
    _id: 'article-3',
    title: '街巷烟火中的兰州味道',
    brief: '保留一组偏人物和街景的图片，让页面不只都是菜品特写。',
    coverImage: '/assets/test-images/articles/article-3.jpg',
    createTime: '2026-04-13',
    status: 1,
    type: 'culture',
    category: '街巷烟火',
    content: '夜市、烤肉、酿皮和摊位灯光共同构成了兰州夜间的美食气质。这个专题不强调交易信息，而是强调人流、摊位、声音和地方生活方式，让用户看到兰州味道背后的城市温度。',
    documentaryId: 'doc-3'
  }
]

const announcements = [
  {
    _id: 'announcement-1',
    title: '测试图片资源已接入',
    brief: '当前前台页面已切换到本地测试图片资源，方便联调和演示。',
    createTime: '2026-04-15',
    isTop: 1,
    status: 1
  },
  {
    _id: 'announcement-2',
    title: '后续可替换为正式素材',
    brief: '测试图主要用于页面占位与视觉验证，后续你可以按专题再微调。',
    createTime: '2026-04-14',
    isTop: 0,
    status: 1
  }
]

const promoFeatures = [
  {
    _id: 'promo-1',
    title: '一座城市的清晨，从一碗面开始',
    summary: '围绕牛肉面、老街巷与城市记忆，突出“兰州美食即城市文化名片”的宣传定位。',
    image: '/assets/test-images/banners/banner-1.jpg',
    tag: '城市主线'
  },
  {
    _id: 'promo-2',
    title: '夜市、炭火与烟火气的城市叙事',
    summary: '把夜市、烤肉、酿皮和市井生活组织成一条适合宣传展示的故事化内容线。',
    image: '/assets/test-images/banners/banner-2.jpg',
    tag: '烟火片段'
  },
  {
    _id: 'promo-3',
    title: '从味觉到非遗：手艺背后的文化传承',
    summary: '以拉面技艺、调汤经验与民俗饮食为切口，强化项目的文化传播属性。',
    image: '/assets/test-images/banners/banner-3.jpg',
    tag: '非遗视角'
  }
]

const documentaries = [
  {
    _id: 'doc-1',
    title: '《一碗面的早晨》',
    brief: '围绕牛肉面、晨市与日常生活建立城市第一印象，适合作为首页宣传片模块。',
    poster: '/assets/test-images/articles/article-1.jpg',
    duration: '08:30',
    category: '城市宣传片',
    articleId: 'article-1',
    playable: true,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    actionText: '播放宣传短片'
  },
  {
    _id: 'doc-2',
    title: '《拉面师傅的一天》',
    brief: '通过手作、备料与出餐节奏，突出兰州美食背后的劳动文化与技艺传承。',
    poster: '/assets/test-images/articles/article-2.jpg',
    duration: '11:20',
    category: '技艺纪录片',
    articleId: 'article-2',
    playable: true,
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    actionText: '播放技艺短片'
  },
  {
    _id: 'doc-3',
    title: '《夜市里的人间烟火》',
    brief: '聚焦夜市摊位、街巷人流和地方小吃，强化项目“宣传展示”而非单纯点餐。',
    poster: '/assets/test-images/articles/article-3.jpg',
    duration: '09:45',
    category: '街区故事',
    articleId: 'article-3',
    playable: false,
    videoUrl: '',
    actionText: '查看专题介绍'
  }
]

const documentaryMapById = documentaries.reduce((acc, item) => {
  acc[item._id] = item
  return acc
}, {})

const documentaryMapByArticleId = documentaries.reduce((acc, item) => {
  if (item.articleId) {
    acc[item.articleId] = item
  }
  return acc
}, {})

function clone(data) {
  return deepResolveCloudImages(JSON.parse(JSON.stringify(data)))
}

function normalizeFood(food) {
  const next = Object.assign({}, food)
  if (!next.images || next.images.length === 0) {
    next.images = [next.coverImage]
  }
  return next
}

function getFoods(categoryId) {
  const filtered = categoryId
    ? foods.filter((item) => item.categoryId === categoryId)
    : foods
  return filtered
    .slice()
    .sort((a, b) => a.sort - b.sort)
    .map(normalizeFood)
}

function getFoodById(id) {
  const found = foods.find((item) => item._id === id)
  return found ? normalizeFood(found) : null
}

function getArticleById(id) {
  const found = articles.find((item) => item._id === id)
  return found ? JSON.parse(JSON.stringify(found)) : null
}

function getDocumentaryById(id) {
  const found = documentaryMapById[id]
  return found ? JSON.parse(JSON.stringify(found)) : null
}

function getDocumentaryByArticleId(articleId) {
  const found = documentaryMapByArticleId[articleId]
  return found ? JSON.parse(JSON.stringify(found)) : null
}

function getHotFoods(limit = 10) {
  return foods
    .filter((item) => item.isHot === 1 && item.status === 1)
    .slice()
    .sort((a, b) => a.sort - b.sort)
    .slice(0, limit)
    .map(normalizeFood)
}

function getDiscountFoods() {
  return foods
    .filter((item) => item.isDiscount === 1 && item.status === 1)
    .slice()
    .sort((a, b) => a.sort - b.sort)
    .map(normalizeFood)
}

module.exports = {
  getBanners: () => clone(banners),
  getCategories: () => clone(categories),
  getFoods,
  getFoodById,
  getArticleById,
  getHotFoods,
  getDiscountFoods,
  getActivities: () => clone(activities),
  getHomeActivities: () => clone(activities.slice(0, 3)),
  getGroupBuyProducts: () => clone(groupBuyProducts),
  getArticles: () => clone(articles),
  getAnnouncements: () => clone(announcements),
  getPromoFeatures: () => clone(promoFeatures),
  getDocumentaries: () => clone(documentaries),
  getDocumentaryById,
  getDocumentaryByArticleId
}
const { deepResolveCloudImages } = require('./cloud-images')
