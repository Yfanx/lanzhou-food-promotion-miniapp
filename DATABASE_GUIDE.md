# 数据库初始化指南

## 第一步：开通云开发环境

1. 打开微信开发者工具
2. 点击右上角「云开发」按钮
3. 开通云开发服务
4. 复制环境 ID

## 第二步：配置环境 ID

在 `miniprogram/app.js` 中设置环境 ID：
```javascript
globalData: {
  env: 'your-env-id',  // 替换为你的环境 ID
  openid: null,
  userInfo: null
}
```

## 第三步：上传云函数

1. 在微信开发者工具中，右键点击 `cloudfunctions/login` 文件夹
2. 选择「上传并部署-云端安装依赖」
3. 重复步骤 1-2 上传其他云函数：
   - getFoodList
   - getBannerList
   - getCategoryList

## 第四步：创建数据库集合并设置权限

在云开发控制台中创建以下集合，并为每个集合设置相应权限：

---

### 1. carousels（轮播图）

**权限**：所有用户可读

**示例数据**：
```json
{"Image": "placeholder", "link": "pages/index/index", "sort": 1, "status": 1}
```

---

### 2. categories（美食分类）

**权限**：所有用户可读

**示例数据**：
```json
{"name": "兰州拉面", "icon": "placeholder", "sort": 1}
```

---

### 3. foods（美食）

**权限**：所有用户可读

**示例数据**：
```json
{"name": "牛肉拉面", "brief": "正宗兰州牛肉拉面", "coverImage": "placeholder", "images": ["placeholder"], "price": 28, "originalPrice": 35, "stock": 100, "sales": 0, "categoryId": "placeholder", "isHot": 1, "isDiscount": 0, "discountPrice": 0, "status": 1, "sort": 1}
```

---

### 4. activities（活动）

**权限**：所有用户可读

**示例数据**：
```json
{"title": "美食讲座", "brief": "专家讲解兰州美食文化", "coverImage": "placeholder", "startTime": "2026-04-01", "endTime": "2026-04-30", "status": 1}
```

---

### 5. announcements（公告）

**权限**：所有用户可读

**示例数据**：
```json
{"title": "平台上线公告", "brief": "兰州美食文化宣传小程序正式上线", "content": "平台正式上线，欢迎使用", "isTop": 1, "status": 1}
```

---

### 6. votes（投票）

**权限**：所有用户可读

**示例数据**：
```json
{"title": "你最喜欢哪种兰州美食", "options": [{"id": 1, "name": "兰州拉面", "count": 0}, {"id": 2, "name": "手抓羊肉", "count": 0}, {"id": 3, "name": "酿皮", "count": 0}], "endTime": "2026-05-01", "status": 1}
```

---

### 7. stories（用户分享）

**权限**：所有用户可读，创建者可读写

**示例数据**：
```json
{"content": "今天吃到了正宗的兰州拉面", "images": ["placeholder"], "authorId": "placeholder", "authorInfo": {"nickName": "美食爱好者"}, "status": 0}
```

---

### 8. users（用户）

**权限**：仅创建者可读写

**示例数据**：
```json
{"openid": "placeholder", "phone": "13800138000", "nickName": "美食爱好者", "avatarUrl": "placeholder"}
```

---

### 9. orders（订单）

**权限**：仅创建者可读写

**示例数据**：
```json
{"orderNo": "ORDER20260415001", "userId": "placeholder", "foods": [{"foodId": "placeholder", "name": "牛肉拉面", "price": 28, "count": 1}], "totalPrice": 28, "status": 0}
```

---

### 10. group_buy_products（团购商品）

**权限**：所有用户可读

**示例数据**：
```json
{"name": "牛肉拉面团购", "coverImage": "placeholder", "foodId": "placeholder", "groupPrice": 22, "originalPrice": 28, "minPeople": 5, "stock": 50, "status": 1}
```

---

## 第五步：添加图标资源

在 `miniprogram/assets/icons/` 目录下添加以下图标文件：

TabBar 图标（必填）：
- home.png / home-active.png
- category.png / category-active.png
- activity.png / activity-active.png
- profile.png / profile-active.png

推荐尺寸：64x64px 或 128x128px (2x)

可从 [iconfont.cn](https://www.iconfont.cn/) 下载免费图标。

---

## 第六步：测试

1. 在微信开发者工具中点击「编译」
2. 检查控制台是否有错误
3. 使用真机预览测试
