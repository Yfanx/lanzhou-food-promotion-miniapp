# 云存储图片映射

环境 ID：`cloud1-7glyj8fy8135ce71`

云文件路径统一格式：

`cloud://cloud1-7glyj8fy8135ce71/test-images/<分类>/<文件名>`

这些路径可以直接写入数据库字段，例如：

- `foods.coverImage`
- `foods.images`
- `categories.icon`
- `activities.coverImage`
- `articles.coverImage`
- `carousels.image`
- `group_buy_products.coverImage`

## banners

- `cloud://cloud1-7glyj8fy8135ce71/test-images/banners/banner-1.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/banners/banner-2.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/banners/banner-3.jpg`

## categories

- `cloud://cloud1-7glyj8fy8135ce71/test-images/categories/category-barbecue.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/categories/category-breakfast.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/categories/category-dessert.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/categories/category-drinks.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/categories/category-noodles.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/categories/category-snacks.jpg`

## foods

- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-beef-noodles-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-beef-noodles-detail-1.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-beef-noodles-detail-2.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-fried-pastry-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-grey-bean-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-jiangshui-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-lamb-bread-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-lamb-skewers-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-lamb-skewers-detail-1.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-niangpi-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-sweet-rice-cover.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/foods/food-tea-cover.jpg`

## activities

- `cloud://cloud1-7glyj8fy8135ce71/test-images/activities/activity-1.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/activities/activity-2.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/activities/activity-3.jpg`

## articles

- `cloud://cloud1-7glyj8fy8135ce71/test-images/articles/article-1.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/articles/article-2.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/articles/article-3.jpg`

## groupbuy

- `cloud://cloud1-7glyj8fy8135ce71/test-images/groupbuy/groupbuy-1.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/groupbuy/groupbuy-2.jpg`
- `cloud://cloud1-7glyj8fy8135ce71/test-images/groupbuy/groupbuy-3.jpg`

## 建议

- 优先把数据库里的大图字段改成上面的云文件路径。
- 等数据库字段回填完成后，可以逐步移除本地 `assets/test-images` 的大图，解决真机调试包体过大问题。
- `food-tea-cover.jpg` 和 `category-breakfast.jpg` 体积特别大，后续最好再压缩一版。
