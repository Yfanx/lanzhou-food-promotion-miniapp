# 管理员端交付与上传说明

## 这次已经补好的内容
- 管理后台首页增加更多统计项：用户数、已绑手机用户数、美食数、订单数、活动数、公告数、投票数、分享数。
- 活动管理补充讲座字段：`type`、`brief`、`speaker`、`capacity`、`signupDeadline`。
- 订单管理支持查看联系人、手机号，并支持待支付 -> 待发货 -> 已完成 / 已取消的处理流。
- 用户管理支持查看昵称、openid、手机号和手机号验证状态。
- 后台关键页面增加管理员拦截，非管理员会被重定向回设置页。
- 后台关键云函数增加管理员校验，避免普通用户直接调用写操作接口。

## 需要重新上传的云函数

### 登录、前台业务与推荐
- `bindPhoneNumber`
- `getRecommendations`
- `getActivities`
- `signUpActivity`
- `createOrder`
- `getMyOrders`

### 管理后台读接口
- `getStats`
- `getAllOrders`
- `getUserList`

### 管理后台写接口
- `addActivity`
- `updateActivity`
- `updateOrderStatus`
- `addFood`
- `updateFood`
- `deleteFood`
- `addAnnouncement`
- `updateAnnouncement`
- `deleteAnnouncement`
- `addVote`
- `updateVote`
- `deleteVote`
- `approveStory`
- `deleteStory`

## 不需要重新上传但建议确认已在线的云函数
- `login`
- `checkAdmin`
- `getVoteList`
- `submitVote`
- `getMyVotes`
- `getActivityDetail`
- `getAnnouncementList`
- `getAnnouncementDetail`
- `getFoodList`
- `getFoodDetail`

## 数据库集合确认
- `admins`
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
- `favorites`

## 必须确认的管理员数据
在 `admins` 集合里至少有一条记录：

```json
{
  "openid": "你的管理员openid",
  "status": 1
}
```

## 公开数据导入步骤
1. 运行 `scripts/import_public_content.ps1`
2. 打开微信开发者工具云数据库导入面板
3. 导入这些文件到同名集合：
   - `data/db-import/foods.import.json`
   - `data/db-import/articles.import.json`
   - `data/db-import/activities.import.json`
   - `data/db-import/announcements.import.json`

## 建议索引
- `admins`: `openid + status`
- `users`: `openid`
- `orders`: `userId + createTime`
- `activities`: `status + startTime`
- `activity_signups`: `activityId + _openid`
- `votes`: `status + createTime`
- `vote_records`: `voteId + openid + _openid`

## 管理员端验收顺序
1. 先用管理员账号登录。
2. 进入设置页，确认能看到“管理后台”入口。
3. 打开后台首页，确认统计卡片能加载。
4. 进入活动管理，新增一条 `lecture` 类型活动并保存。
5. 回前台活动页，确认讲座活动能展示并能进入详情页。
6. 进入订单管理，确认能看到联系人与手机号，并能修改订单状态。
7. 进入用户管理，确认手机号状态显示正常。
8. 进入公告、投票、分享审核页，确认增删改查无权限错误。

## 建议你下一步优先做的事
1. 先上传上面列出的全部云函数。
2. 再导入 `data/db-import` 里的 4 份公开数据。
3. 然后做一次真机验收：登录绑定手机号 -> 活动报名 -> 团购下单 -> 后台看订单 -> 后台新增讲座 -> 前台查看讲座。

## 如果后台还有异常，优先排查这几项
- `admins` 集合是否存在，且当前账号 `openid` 是否正确。
- 新增云函数是否真的上传成功，而不是只改了本地代码。
- `activities` 集合里是否已有旧数据缺少 `type`、`speaker`、`signupDeadline` 等字段。
- `users` 集合里的旧记录是否缺少 `phoneVerified` 字段；没有的话可补成 `false`。
