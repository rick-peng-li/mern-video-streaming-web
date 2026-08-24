# MERN 视频流媒体平台

> 项目地址：[https://github.com/rick-peng-li/mern-video-streaming-web.git](https://github.com/rick-peng-li/mern-video-streaming-web.git)

## 项目简介

MERN Video Streaming 是一个基于 MERN 技术栈开发的开源视频流媒体平台。平台提供完整的视频上传、管理、转码和点播（VOD）功能，支持视频实时处理完成通知，构建可扩展的视频托管与分享系统。

系统采用微服务架构思想，后端由三个独立服务构成，并通过 Redis 消息队列实现服务间通信。前端使用 React + MUI 组件库，配合 Socket.IO 实现实时状态推送，提供流畅的用户交互体验。

---

## 技术架构

### 核心技术栈

| 层级 | 技术 | 说明 |
| --- | --- | --- |
| 前端 | React 18 + React Router 6 | SPA 单页面应用 |
| UI 框架 | Material UI (MUI) 5 + Lab | 组件库与高级组件 |
| 状态/表单 | Formik + Yup | 表单验证 |
| HTTP 客户端 | Axios | 前后端数据交互 |
| 视频播放 | ReactPlayer | HLS 流媒体播放 |
| 实时通信 | Socket.IO Client | 视频转码进度通知 |
| 后端框架 | Express.js 4 | RESTful API 服务 |
| 数据库 | MongoDB (原生驱动) | 文档存储，视频/用户数据 |
| 消息队列 | BullMQ + Redis | 异步视频转码任务 |
| 文件上传 | Multer / Multer-S3 | 本地或 S3 对象存储 |
| 视频转码 | Fluent-FFmpeg | HLS 切片转码 |
| 用户认证 | Bcrypt | 密码散列 |
| 数据校验 | Joi | 请求参数校验 |
| 日志 | Pino / Winston / Morgan | HTTP 请求与应用日志 |

### 系统架构图

```
┌───────────────────────────────────────────────────────────┐
│                        前端 (Client)                       │
│  React 18 + MUI + ReactPlayer + Socket.IO + Axios         │
│  页面：仪表盘 / 视频列表 / 上传 / 播放 / 编辑 / 用户管理   │
└──────────────────────────┬────────────────────────────────┘
                           │ HTTP / WebSocket
┌──────────────────────────▼────────────────────────────────┐
│                    API 服务 (端口 4000)                    │
│  Express + MongoDB + Socket.IO + Multer + Joi             │
│  视频 CRUD / 上传 / 用户 / 角色 / 统计接口                 │
│  ┌──────────────────────┐   ┌─────────────────────────┐   │
│  │   REST API 控制器     │   │   Socket.IO 事件通知     │   │
│  └──────────┬───────────┘   └─────────────────────────┘   │
└─────────────┼─────────────────────────────────────────────┘
              │ BullMQ 入队       │ 转码完成事件
┌─────────────▼───────────────────▼─────────────────────────┐
│                  Redis (消息队列 / 缓存)                    │
└─────────────┬─────────────────────────────────────────────┘
              │ Worker 消费任务
┌─────────────▼─────────────────────────────────────────────┐
│              Video Processor (视频转码服务)                 │
│  BullMQ Worker + Fluent-FFmpeg                             │
│  负责：MP4 → HLS (.m3u8 + .ts) 切片转码                     │
└─────────────┬─────────────────────────────────────────────┘
              │ 输出切片文件
┌─────────────▼─────────────────────────────────────────────┐
│               HTTP Video Server (端口 4001)                │
│  原生 Node HTTP Server                                     │
│  负责：静态提供 uploads/hls 目录下的 HLS 视频流             │
└───────────────────────────────────────────────────────────┘
```

---

## 项目目录结构

```
mern-video-streaming-web/
├── client/                          # 前端 React 应用
│   ├── public/
│   │   ├── assets/                  # 图标、插图、图片等静态资源
│   │   ├── favicon/                 # 站点图标
│   │   └── index.html
│   └── src/
│       ├── components/              # 通用组件 (图标、滚动条、Logo等)
│       ├── contexts/                # React Context (Socket 连接)
│       ├── hooks/                   # 自定义 Hooks (响应式断点)
│       ├── layouts/                 # 布局组件 (Dashboard 布局 / Simple 布局)
│       ├── pages/                   # 路由页面组件
│       ├── sections/                # 页面各区块子组件
│       │   ├── @dashboard/app       # 仪表盘区块
│       │   ├── @dashboard/blog      # 博客区块
│       │   ├── @dashboard/products  # 视频卡片/列表组件
│       │   ├── @dashboard/user      # 用户表格区块
│       │   └── auth/login           # 登录表单
│       ├── theme/                   # MUI 主题配置
│       ├── utils/                   # 工具函数
│       ├── _mock/                   # 模拟数据 (仅 videos.js)
│       ├── App.js                   # 应用根组件
│       ├── constants.js             # 后端/视频服务器地址常量
│       ├── index.js                 # 入口文件
│       └── routes.js                # 路由配置
├── server/                          # 后端服务
│   ├── scripts/
│   │   ├── seed-data/               # 数据库种子数据
│   │   └── shell-script.mjs         # 目录初始化脚本
│   ├── src/
│   │   ├── modules/
│   │   │   ├── db/                  # 数据库层
│   │   │   │   ├── schemas/         # MongoDB Schema 验证器
│   │   │   │   ├── collections.js   # 集合通用 CRUD 封装
│   │   │   │   ├── constant.js      # 枚举常量
│   │   │   │   └── mongo.js         # MongoManager 单例连接
│   │   │   ├── models/              # 业务模型层
│   │   │   │   ├── video/           # 视频模块 (controller/service/handler/request)
│   │   │   │   ├── role/            # 角色模块 (controller/service)
│   │   │   │   └── user/            # 用户模块 (controller/service)
│   │   │   └── queues/              # BullMQ 队列
│   │   │       ├── constants.js     # 队列事件常量
│   │   │       ├── queue.js         # 队列任务入队
│   │   │       ├── worker.js        # 队列消费与事件监听
│   │   │       ├── handlers.js      # 视频处理处理器
│   │   │       └── video-processor.js # FFmpeg 转码逻辑
│   │   ├── app.js                   # Express App 初始化与中间件
│   │   ├── server.js                # API 主入口 (端口 4000)
│   │   ├── video-server.js          # HLS 视频 HTTP 服务 (端口 4001)
│   │   ├── queue.js                 # 视频转码 Worker 入口
│   │   ├── event-manager.js         # 进程内事件总线
│   │   └── logger.js                # Pino/Winston 日志配置
│   ├── uploads/                     # 上传文件目录 (运行时创建)
│   │   ├── videos/                  # 原始视频文件
│   │   ├── thumbnails/              # 缩略图
│   │   └── hls/                     # HLS 切片输出 (.m3u8 + .ts)
│   ├── docker-compose.yml           # MongoDB + Redis 编排
│   └── Dockerfile
├── LICENSE
└── README.md
```

---

## 前端页面与功能

所有页面均使用 MUI 组件库构建，支持响应式布局。

| 路由路径 | 页面组件 | 功能说明 |
| --- | --- | --- |
| `/` | (重定向) | 默认重定向至 `/videos` |
| `/dashboard` | DashboardAppPage | 数据仪表盘：视频/用户总数、播放量、分类分布等统计图表（调用后端真实统计接口） |
| `/videos` | VideosPage | 视频浏览主页：视频卡片网格展示、按播放量/日期排序，支持筛选侧栏 |
| `/video-list` | VideoListPage | 视频管理列表：服务端分页/排序/过滤的 DataGrid，支持编辑/删除操作 |
| `/video-upload` | VideoUploadPage | 视频上传页：标题、描述、可见性、语言、分类、日期选择 + 文件上传，表单校验 |
| `/videos/:id` | VideoPlayerPage | 视频播放页：HLS 流媒体播放，显示视频信息，跳转编辑页 |
| `/video/update/:id` | VideoEditPage | 视频信息编辑页：拉取详情回填表单，修改元数据后提交更新 |
| `/user` | UserPage | 用户管理：服务端拉取用户列表、分页/搜索/筛选表格 |
| `/products` | ProductsPage | 产品展示页（模板保留，基于 mock 数据） |
| `/blog` | BlogPage | 博客列表页（模板保留，基于 mock 数据） |
| `/login` | LoginPage | 登录页：邮箱+密码表单验证，调用后端登录接口并持久化用户信息 |
| `/404` | Page404 | 404 错误页 |
| `*` | (重定向) | 任意未匹配路由重定向至 `/404` |

### Dashboard 布局

- **顶部 Header**：搜索框、语言切换、通知中心、账户头像下拉菜单
- **侧边栏 Nav**：仪表盘 / 视频 / 视频列表 / 上传 / 用户 / 产品 / 博客 / 登录
- **主内容区**：对应路由页面的渲染区域

---

## 后端接口设计

后端由三个独立服务组成。以下为各服务端口及全部 RESTful 接口。

### 端口一览

| 服务 | 端口 | 说明 |
| --- | --- | --- |
| API Server | 4000 | 主业务 API，提供视频、用户、角色 CRUD |
| Video Server | 4001 | HLS 视频切片静态文件服务 |
| MongoDB | 27017 | 数据库 (默认) |
| Redis | 6379 | 消息队列 (默认) |

### 视频模块 `/api/videos`

| 方法 | 路径 | 说明 | 请求体/参数 |
| --- | --- | --- | --- |
| `GET` | `/api/videos/` | 查询所有视频（发布状态，未删除） | - |
| `POST` | `/api/videos/search` | 高级搜索 + 分页 + 排序 + 过滤 | `{ keyword, filterKey, filterValue, sortKey, sortValue, pageNumber, limit }` |
| `POST` | `/api/videos/count` | 统计视频数量 | `{ filterKey, filterValue }` |
| `GET` | `/api/videos/detail/:id` | 获取单个视频详情（并增加播放量） | URL Param `id` |
| `POST` | `/api/videos/upload` | 上传视频文件并入库 | `multipart/form-data`：`video` (mp4/webm ≤ 50MB), `title`, `description`, `category`, `visibility`, `recordingDate` |
| `PUT` | `/api/videos/update/:id` | 更新视频元信息 | `{ title, description, category, visibility, language, thumbnailUrl, recordingDate }` |
| `DELETE` | `/api/videos/delete/:id` | 删除视频 | URL Param `id` |

**视频字段说明**：`title`, `description`, `fileName`, `originalName`, `videoLink`, `thumbnailUrl`, `visibility (Public/Private/Unlisted)`, `status (PENDING/PUBLISHED/PROCESSING)`, `category`, `language`, `recordingDate`, `viewCount`, `duration`, `tags`, `history`, `hlsPath`, `processedPath`

### 用户模块 `/api/users`

| 方法 | 路径 | 说明 | 请求体/参数 |
| --- | --- | --- | --- |
| `POST` | `/api/users/register` | 用户注册（邮箱唯一，密码 bcrypt 哈希） | `{ name, email, password, roleId?, avatarUrl? }` |
| `POST` | `/api/users/login` | 用户登录（密码比对，返回不含 password 的用户对象） | `{ email, password }` |
| `POST` | `/api/users/search` | 用户搜索 + 分页 | `{ keyword, pageNumber, limit }` |
| `POST` | `/api/users/count` | 统计用户数量 | `{ keyword? }` |
| `GET` | `/api/users/detail/:id` | 获取单个用户详情 | URL Param `id` |
| `PUT` | `/api/users/update` | 更新用户资料（password 提供时会重新哈希） | `{ _id, name?, email?, password?, roleId?, avatarUrl?, isActive? }` |
| `DELETE` | `/api/users/delete/:id` | 删除用户 | URL Param `id` |

### 角色模块 `/api/roles`

| 方法 | 路径 | 说明 | 请求体/参数 |
| --- | --- | --- | --- |
| `POST` | `/api/roles/create` | 创建角色（name 唯一索引） | `{ name, isActive, isPublic }` |
| `PUT` | `/api/roles/update` | 更新角色 | `{ _id, name?, isActive?, isPublic? }` |
| `GET` | `/api/roles/detail/:id` | 获取单个角色 | URL Param `id` |
| `POST` | `/api/roles/search` | 角色搜索 + 分页 | `{ keyword, pageNumber, sort }` |
| `POST` | `/api/roles/count` | 统计角色数量 | `{ keyword? }` |
| `DELETE` | `/api/roles/delete/:id` | 删除角色 | URL Param `id` |

### 缩略图静态资源

| 路径 | 说明 |
| --- | --- |
| `GET /thumbnails/*` | 映射 `server/uploads/thumbnails/` 目录 |

### HLS 视频服务（Video Server 端口 4001）

| 路径 | 说明 |
| --- | --- |
| `GET /{fileName}.m3u8` | 获取 HLS 主播放列表 |
| `GET /{fileName}-{n}.ts` | 获取 HLS TS 切片 |

前端通过 `ReactPlayer` + `${VIDEO_SERVER}/{fileName}.m3u8` 组合播放。

### 实时通知

API Server 挂载的 Socket.IO 服务会在视频转码队列完成 HLS 切片后广播 `hello` 事件通知所有客户端，前端可在 `SocketContext` 中监听以刷新列表。

---

## 环境变量配置

### Server (`server/.env`)，参照 `.env.template`

```
MONGODB_URL=mongodb://localhost:27017         # MongoDB 连接地址
SERVER_URL=http://localhost:4000              # API Server 对外地址
LOGGLY_TOKEN=1234-5678-9012                    # 可选：Winston Loggly Token
ENABLE_WINSTON_MONGODB=true                    # 是否启用 MongoDB 日志传输
ENABLE_WINSTON_LOGGLY=true                     # 是否启用 Loggly 日志传输

# S3 / DigitalOcean Spaces (可选，未配置时 video/controller 使用 S3Storage)
REGION=us-east-1
ACCESS_KEY=XXXXXXXXXXXXXXXXXXXX
ACCESS_TOKEN=XXXXXXXXXXXXXXXXXXXX
ENDPOINT=https://region_name.digitaloceanspaces.com
BUCKET_NAME=bucket_name
```

### Client (`client/.env`)，参照 `.env.template`

```
REACT_APP_API_SERVER=http://localhost:4000     # API 服务地址
REACT_APP_VIDEO_SERVER=http://localhost:4001   # HLS 视频服务地址
```

---

## 启动方式

### 前置依赖

- **Node.js** >= 16.x
- **npm** 或 **yarn**
- **Docker** + **Docker Compose**（用于启动 MongoDB 和 Redis）
- **FFmpeg**（需要可执行文件在系统 PATH 中，供视频转码服务使用）

### 方式一：本地开发（推荐）

#### 1. 克隆项目

```bash
git clone https://github.com/foyzulkarim/mern-video-streaming.git
cd mern-video-streaming-web
```

#### 2. 启动基础设施 (MongoDB + Redis)

```bash
cd server
docker-compose up -d    # 后台启动 MongoDB 和 Redis 容器
```

#### 3. 启动后端三服务 (API Server + Video Processor + Video Server)

```bash
npm install
# 首次运行需要的目录结构
npm run init-directories
# 同时启动 3 个后端服务 (4000/队列/4001)
npm run server
```

或分开启动便于调试：

```bash
npm run web-server       # API 服务 (4000)
npm run video-processor  # BullMQ 转码 Worker
npm run video-server     # HLS 静态资源服务 (4001)
```

#### 4. 启动前端

```bash
cd ../client
yarn install    # 或 npm install
yarn start      # 或 npm start
```

访问 [http://localhost:3000](http://localhost:3000) 即可打开应用。

### 方式二：Docker Compose 一键启动

#### 后端

```bash
cd server
npm run docker-build-and-run
```

#### 前端

```bash
cd client
npm run docker-build
npm run docker
```

### 可选：种子数据初始化

`server/scripts/seed-data/` 目录下提供了 `role.js` 与 `video.js` 初始化脚本，可按需运行创建默认角色与示例视频。

---

## 视频上传与转码流程

1. **上传**：前端通过 `multipart/form-data` 将视频文件及元数据提交至 `/api/videos/upload`
2. **入库**：后端经 Multer 接收并（可选）上传 S3，文档以 `PENDING` 状态写入 MongoDB `videos` 集合
3. **入队**：控制器通过 BullMQ 将任务 ID 推入 `VIDEO_UPLOADED` Redis 队列
4. **转码**：`video-processor` Worker 消费任务，调用 Fluent-FFmpeg 将 MP4/WebM 转换为 HLS (`uploads/hls/{fileName}/`)
5. **通知**：转码完成后触发进程事件 → Socket.IO 广播通知前端 → 用户无刷新感知
6. **分发**：前端 VideoPlayerPage 读取 `VIDEO_SERVER/{fileName}.m3u8` 进行渐进式点播播放

---

## 许可协议

MIT License，详见 [LICENSE](LICENSE)。
