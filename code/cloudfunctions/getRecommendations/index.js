const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function buildScoreMap(items, weight) {
  return (items || []).reduce((map, item) => {
    const id = item && item.foodId
    if (!id) {
      return map
    }
    map[id] = (map[id] || 0) + weight
    return map
  }, {})
}

exports.main = async (event) => {
  const { limit = 4 } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()

  try {
    const hotFoodsRes = await db.collection('foods')
      .where({ status: 1 })
      .orderBy('sales', 'desc')
      .limit(Math.max(limit, 6))
      .get()

    let rankedFoods = hotFoodsRes.data || []
    let articles = []

    if (openid) {
      const [favoriteRes, orderRes, articleRes] = await Promise.all([
        db.collection('favorites').where({ _openid: openid }).limit(50).get(),
        db.collection('orders').where({ userId: openid }).limit(20).get(),
        db.collection('articles').where({ status: 1 }).orderBy('publishedAt', 'desc').limit(3).get()
      ])

      articles = articleRes.data || []
      const favoriteScores = buildScoreMap(favoriteRes.data, 100)
      const orderScores = (orderRes.data || []).reduce((map, order) => {
        ;(order.foods || []).forEach((food) => {
          if (food && food.foodId) {
            map[food.foodId] = (map[food.foodId] || 0) + 30
          }
        })
        return map
      }, {})

      rankedFoods = (hotFoodsRes.data || [])
        .map((food, index) => ({
          ...food,
          _score:
            (favoriteScores[food._id] || 0) +
            (orderScores[food._id] || 0) +
            Number(food.sales || 0) +
            Math.max(0, 10 - index)
        }))
        .sort((a, b) => b._score - a._score)
    } else {
      const articleRes = await db.collection('articles')
        .where({ status: 1 })
        .orderBy('publishedAt', 'desc')
        .limit(3)
        .get()
      articles = articleRes.data || []
    }

    return {
      success: true,
      foods: rankedFoods.slice(0, limit).map(({ _score, ...item }) => item),
      articles
    }
  } catch (error) {
    return {
      success: false,
      foods: [],
      articles: [],
      error: error.message
    }
  }
}
