# 毕设交付清单

## 云函数上传
- `login`
- `bindPhoneNumber`
- `getRecommendations`
- `getActivities`
- `getActivityDetail`
- `signUpActivity`
- `createOrder`
- `getMyOrders`
- `submitVote`
- `getVoteList`
- `getMyVotes`

## 数据库集合
- `users`
- `foods`
- `categories`
- `carousels`
- `activities`
- `announcements`
- `articles`
- `group_buy_products`
- `orders`
- `votes`
- `vote_records`
- `activity_signups`
- `stories`
- `admins`

## 建议索引
- `votes`: `status + createTime`
- `vote_records`: `voteId + openid + _openid`
- `activities`: `status + startTime`
- `orders`: `userId + createTime`
- `activity_signups`: `activityId + _openid`

## 管理员初始化
1. 创建 `admins` 集合。
2. 添加记录：`{ "openid": "你的openid", "status": 1 }`
3. 上传 `checkAdmin` 云函数后重新进入设置页验证后台入口。

## 数据导入
1. 运行 `scripts/import_public_content.ps1`
2. 在微信开发者工具中导入 `data/db-import/*.import.json`
3. 检查 `articles`、`activities`、`announcements`、`foods` 页面展示

## 演示路径
1. 首页查看轮播、分类、热门与个性化推荐
2. 登录页完成微信登录与手机号绑定
3. 活动详情页提交报名
4. 团购/订单链路完成下单与订单查看
5. 投票页完成单次投票
6. 设置页进入后台管理
