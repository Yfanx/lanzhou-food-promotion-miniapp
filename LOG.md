# 开发日志

## 2026-04-15
### 项目初始化
- 完成小程序基础工程搭建与云开发环境接入。
- 注册首页、分类、活动、投票、团购、公告、个人中心等核心页面。
- 初始接入 `login`、`getFoodList`、`getBannerList`、`getCategoryList` 云函数。

### 前台与后台雏形
- 完成首页、分类、美食详情、文化、活动、投票、团购、公告、个人中心等页面初稿。
- 增加后台管理页雏形，包括轮播、分类、美食、活动、公告、投票、订单、用户、故事审核等。
- 补充缺失的详情页、我的订单、我的收藏、我的投票、设置页等子页面。

### 测试资源与 UI
- 增加本地测试图片资源和 `mock-data.js` 回退数据。
- 应用 Stitch 设计稿并补充 `UI_OVERVIEW.md`，统一前台视觉风格。
- 处理常见图片缺失与占位符问题，保证前台页面可预览。

### 投票功能修复
- 统一前后台投票选项字段结构。
- 修复 `submitVote` 更新票数时的路径冲突问题。
- 补充 `vote_records` 使用方式与相关索引说明。

## 2026-04-19
### 交付收尾：登录、推荐、讲座与公开数据
- 新增 `bindPhoneNumber` 云函数，登录页改为微信手机号授权 `code -> 云函数换号 -> users 回写`。
- 统一 `users` 字段：`openid / nickName / avatarUrl / phone / phoneVerified / phoneVerifiedAt / lastLoginAt / createTime`。
- 活动报名与订单创建接入手机号校验，未绑定手机号时统一跳转登录页继续绑定。
- 新增 `getRecommendations` 云函数，规则参考收藏、订单与热门销量，支持首页与个人中心推荐展示。
- `activities` 数据模型补充 `type / location / speaker / capacity / signupDeadline`，支持普通活动与讲座双类型展示。
- 修复 `orders` 页面与 `getMyOrders` 返回字段不一致问题。

### 公开资料与导入
- 新增 `data/public-seeds/foods.json`
- 新增 `data/public-seeds/articles.json`
- 新增 `data/public-seeds/activities.json`
- 新增 `data/public-seeds/announcements.json`
- 新增 `scripts/import_public_content.ps1`，用于生成 `data/db-import/*.import.json` 导入文件。
- 新增 `DELIVERY_CHECKLIST.md`，汇总云函数上传、集合、索引、管理员初始化与演示路径。
- 重写 `DATABASE_GUIDE.md`，统一数据库字段、集合与部署步骤。

### 待人工完成
- 上传新增云函数：`bindPhoneNumber`、`getRecommendations`
- 重新上传更新后的云函数：`getActivities`、`signUpActivity`、`createOrder`、`getMyOrders`
- 运行 `scripts/import_public_content.ps1` 并在微信开发者工具导入 `data/db-import/*.import.json`
- 真机验证手机号授权、活动报名、订单查看、投票与推荐展示

## 2026-04-27
### 真机图片与公开数据闭环
- 将测试图片统一迁移到微信云存储，并在前端通过 `cloud:// -> tempFileURL` 解析恢复真机显示。
- 小程序包体压缩到约 1.42MB，解除真机调试 2MB 限制。
- 新增 `code/cloudfunctions/syncPublicContent/index.js`，用于一次性回填轮播、分类、美食、活动、团购、文化文章和公告演示数据。
- 通过 CloudBase OpenAPI 创建缺失的 `articles` 集合，解决公开内容同步卡在文章集合不存在的问题。
- 重新执行 `tcb fn invoke syncPublicContent`，确认 `carousels=3`、`categories=6`、`foods=9`、`activities=3`、`group_buy_products=3`、`articles=3`、`announcements=3` 已同步成功。

### 当前剩余验证
- 在微信开发者工具或真机重新编译，确认首页、文化页、公告页与详情页图片均正常显示。
- 如后台页后续也接云存储图片，可继续将相关列表与详情页统一到 `deepResolveDisplayImages`。
