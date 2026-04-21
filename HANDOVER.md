# PathPal 项目交接文档
# PathPal Project Handover Document

> 撰写日期 / Date: 2026-04-21  
> 撰写人 / Author: Bruce (Lead Developer)

---

## 目录 / Table of Contents

1. [项目总览 / Project Overview](#1-项目总览--project-overview)
2. [项目一：PathPal 网站 (Vercel)](#2-项目一pathpal-网站-vercel)
3. [项目二：微信小程序 (mini-pathpal1)](#3-项目二微信小程序-mini-pathpal1)
4. [项目三：API 服务 (阿里云)](#4-项目三api-服务-阿里云)
5. [账号与资源信息](#5-账号与资源信息)
6. [续费与维护说明](#6-续费与维护说明)
7. [开发上手指南](#7-开发上手指南)
8. [其他补充说明](#8-其他补充说明)

---

## 1. 项目总览 / Project Overview

**PathPal** 是一个帮助中国高中生申请美国大学的平台，目前由三个独立但相互关联的产品组成：

| # | 产品 | 面向用户 | 状态 |
|---|------|---------|------|
| 1 | **PathPal 网站** (`pathpal.vercel.app`) | 英语用户 / 国际学生 | ✅ 已上线 |
| 2 | **微信小程序** (`mini-pathpal1`) | 中国大陆 / 香港学生 | ✅ 已上线 |
| 3 | **API 服务** (`api.gopathpal.com`) | 为小程序提供后端，专供国内访问 | ✅ 已上线 |

三个项目共用同一个 **Supabase 数据库**（292 所美国大学数据）和同一个 **AI 服务**（阿里云 DashScope / Qwen）。

---

## 2. 项目一：PathPal 网站 (Vercel)

### 2.1 产品定位

面向英语用户的 Web 端平台，帮助学生：
- 搜索并匹配合适的美本申请顾问
- 了解美国大学信息
- 参与学生社区论坛
- 通过 AI 聊天获取申请建议

### 2.2 已实现功能

| 功能模块 | 描述 |
|---------|------|
| **顾问搜索与匹配** | 主页核心功能。学生填入年级、兴趣方向、GPA、预算，系统通过评分算法筛选并排序顾问列表 |
| **Quick Finder** | 快速筛选栏（年级、兴趣、预算、当前学校、GPA）|
| **Deep Match** | 高级匹配（目标专业、目标学校），对顾问进行更精准匹配 |
| **顾问详情页** | `/consultant/[id]` — 顾问简介、专长、服务套餐、评价、可预约时间段 |
| **大学数据库** | `/universities` — 292 所大学，支持搜索、按类型筛选、按排名/录取率/学费排序 |
| **社区论坛** | `/forum` — 学生发帖、评论、点赞；`/forum/new` 创建新帖子 |
| **AI 聊天助手** | 右下角浮动聊天窗口，调用 `/api/chat` 接口（DashScope API），免费 3 次问答后引导联系顾问 |
| **顾问注册入口** | `/become-consultant` — 3 步表单（角色 → 个人信息 → 服务设置），当前为前端演示，尚未写入数据库 |
| **用户认证** | Supabase Auth：邮箱注册 `/signup`、登录 `/login`、登出 |
| **Mentor 主题页面** | `/mentors` + `/mentor/[id]` — 独立风格的 Mentor 展示页，包含视频链接、申请结果展示、双语切换（中/英）|
| **推荐算法** | `src/utils/recommendations.ts` — 基于用户 profile 对顾问进行评分排序 |

### 2.3 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | **Next.js 16**（App Router） |
| 前端 | **React 19** + **Tailwind CSS 4** |
| 图标 | Lucide React |
| 数据库 | **Supabase** (Postgres) — 顾问、大学、论坛帖子、成功案例 |
| 认证 | **Supabase Auth** |
| AI 对话 | **DashScope** (阿里云 Qwen / `MiniMax-M2.5` model) via `/api/chat` |
| 部署 | **Vercel**（自动 CI/CD，推送 `main` 分支即触发部署）|
| 分析 | `@vercel/analytics` |
| 测试 | Vitest + Testing Library |
| 语言 | TypeScript |

### 2.4 项目结构

```
src/
├── app/
│   ├── (main)/          # 主要用户页面（顾问、大学、论坛、认证）
│   ├── (mentor)/        # Mentor 专属主题页面
│   └── api/chat/        # AI 聊天后端接口
├── components/          # 共用 UI 组件
├── context/             # React Context（用户认证、语言）
├── data/                # 本地 Mock 数据（顾问、大学、论坛、mentor）
├── lib/
│   ├── db/              # Supabase 数据读取函数（含 Mock 回退）
│   ├── supabase/        # Supabase 客户端初始化
│   └── constants.ts     # 全局常量（兴趣、年级、预算选项）
└── utils/
    └── recommendations.ts  # 顾问匹配评分算法
```

### 2.5 数据架构（Supabase）

Supabase 项目 URL：`https://tepoydlsqmqdfptjshqo.supabase.co`

**数据库表：**

| 表名 | 内容 |
|------|------|
| `consultants` | 顾问数据（姓名、学校、GPA、专长、服务、评价、时间段）|
| `universities` | 292 所美国大学（排名、录取率、学费、强势专业等）|
| `forum_posts` | 社区论坛帖子 |
| `forum_comments` | 论坛评论（支持嵌套回复）|
| `success_stories` | 首页成功案例 |

> **注意**：代码已设计为"优雅降级"——若 Supabase 未配置或连接失败，自动使用 `src/data/` 下的本地 Mock 数据。

### 2.6 环境变量

部署时需在 Vercel 项目设置中配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://tepoydlsqmqdfptjshqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon key>
DASHSCOPE_API_KEY=<阿里云 DashScope API Key>
DASHSCOPE_MODEL=MiniMax-M2.5           # 或其他 Qwen 模型
DASHSCOPE_BASE_URL=https://coding-intl.dashscope.aliyuncs.com/apps/anthropic
```

### 2.7 代码仓库

- **GitHub**: `https://github.com/junglemonkey112/Pathpal`
- **主分支**: `main`（推送后 Vercel 自动部署到生产环境）
- **线上网址**: `https://pathpal.vercel.app`（或 Vercel 分配的域名）

### 2.8 部署流程

```bash
# 本地开发
npm install
npm run dev        # 访问 http://localhost:3000

# 手动部署（需安装 Vercel CLI）
npm install -g vercel
vercel --prod

# 自动部署
git push origin main   # Vercel 自动构建并部署
```

---

## 3. 项目二：微信小程序 (mini-pathpal1)

### 3.1 产品定位

面向中国大陆和香港学生的微信小程序，核心功能是根据学生的学术档案（GPA、考试成绩、活动经历、目标专业等）匹配最适合的美国大学，并提供 AI 深度分析报告。

### 3.2 已实现功能

| 功能页面 | 描述 |
|---------|------|
| **首页** (`index`) | 进入页，语言切换（中/英）|
| **地区选择** (`region`) | 选择大陆 / 香港 / 海外，决定 API 路由（大陆用阿里云，其他用 Vercel）|
| **学生档案录入** (`profile`) | 2 步骤表单：① 学术信息（课程类型/年级/GPA/排名/选课/考试成绩/奖项）；② 偏好（活动、目标专业、学校类型、其他偏好）|
| **匹配结果** (`result`) | 292 所大学按 Reach / Match / Safety 三档展示，附匹配分数 |
| **大学详情** (`detail`) | 单所大学详情（排名、录取率、学费、国际生比例、强势专业、AI 匹配理由）；右下角悬浮 AI 按钮 |
| **AI 深度分析** (`insights`) | 六维雷达图（学术/考试/竞赛/活动/专业契合/学校契合）、录取段分布甜甜圈图、匹配分布散点图，文字分析报告 |

### 3.3 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | **微信小程序原生框架**（无第三方 UI 库）|
| 基础库版本 | `3.15.1+` |
| 语言 | JavaScript（ES6）|
| 图表绘制 | 小程序 Canvas API（原生绘制，无依赖）|
| 双语 | 自研 `i18n.js`，支持中/英实时切换 |
| 后端 | PathPal API（FastAPI，见项目三）|
| AppID | `wx7a2580fba9980cc8` |

### 3.4 项目结构

```
mini-pathpal1/
├── miniprogram/
│   ├── app.js              # 全局入口：定义 apiBase / apiBaseCN / lang / region
│   ├── app.json            # 页面路由配置
│   ├── app.wxss            # 全局样式（Ivy League Trust 主题色）
│   ├── pages/
│   │   ├── index/          # 语言选择首页
│   │   ├── region/         # 地区选择（决定 API 路由）
│   │   ├── profile/        # 学生档案录入（2 步骤）
│   │   ├── result/         # 匹配结果（Reach/Match/Safety）
│   │   ├── detail/         # 大学详情页
│   │   └── insights/       # AI 深度分析（雷达图/甜甜圈/散点图）
│   └── utils/
│       ├── request.js      # 统一 HTTP 请求封装
│       ├── api.js          # apiBase 地址获取
│       ├── i18n.js         # 语言工具函数
│       ├── lang-en.js      # 英文字符串
│       ├── lang-zh.js      # 中文字符串
│       ├── regionOptions.js # 地区相关选项（CN/HK 不同课程/年级格式）
│       ├── tierGrouping.js  # 匹配结果分档逻辑
│       ├── validation.js   # 表单校验
│       ├── toggleField.js  # 多选字段通用工具
│       └── share.js        # 分享功能
├── project.config.json     # DevTools 配置（AppID 在此）
└── README.md
```

### 3.5 区域路由逻辑（关键机制）

用户在 **地区选择页** 选择所在地后，程序会动态切换 API 地址：

```javascript
// 大陆用户 → 阿里云
app.globalData.apiBase = "https://api.gopathpal.com";

// 香港 / 海外用户 → Vercel（默认）
app.globalData.apiBase = "https://pathpal-api.vercel.app";
```

### 3.6 页面流程

```
首页（选语言）→ 地区选择 → 档案录入（2步）→ 匹配结果 → 大学详情 → AI深度分析
```

### 3.7 本地开发

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开开发者工具 → **导入项目** → 选择 `/Users/bruce/WeChatProjects/mini-pathpal1`
3. AppID 已在 `project.config.json` 中设置（`wx7a2580fba9980cc8`）
4. 按 `⌘B` 编译，即可在模拟器中运行

### 3.8 发布流程

1. 在微信开发者工具中点击 **上传**（设置版本号和备注）
2. 登录 [微信公众平台](https://mp.weixin.qq.com) → **版本管理** → 提交审核
3. 审核通过后点击 **发布**

---

## 4. 项目三：API 服务 (阿里云)

### 4.1 产品定位

一个 **FastAPI** Python 后端服务，为小程序提供以下核心 API：
- `/api/match`：根据学生档案匹配大学（查询 Supabase，返回 Reach/Match/Safety 结果）
- `/api/insights`：调用 DashScope AI，生成六维雷达图数据 + 文字分析报告
- `/api/university/[id]`：单个大学详情（含 AI 匹配理由生成）

### 4.2 部署情况

| 部署目标 | 域名/地址 | 用途 |
|---------|---------|------|
| **Vercel** | `https://pathpal-api.vercel.app` | 主部署（香港/海外用户）|
| **阿里云 ECS** | `https://api.gopathpal.com` | 备用/大陆加速（国内用户专用）|

> **两份部署是完全相同的代码**，只是运行在不同服务器上，供不同地区用户访问，解决国内访问 Vercel 速度慢的问题。

### 4.3 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | **FastAPI** (Python) |
| AI | **DashScope**（阿里云灵积，Qwen 系列模型）|
| 数据库 | **Supabase** Postgres（与网站共享同一库）|
| 阿里云部署 | ECS 实例 + Nginx 反向代理 + systemd 服务 |
| 域名 | `api.gopathpal.com`（需续费，见第 6 节）|

### 4.4 API 接口说明

#### `POST /api/match`
输入学生档案，返回匹配的大学列表（含匹配分数和 tier）。

```json
// 请求体
{
  "curriculum": "IB",
  "grade": "Grade 12",
  "gpa": "3.8",
  "sat": "1480",
  "toefl": "105",
  "majors": ["Computer Science"],
  "activities": ["Research", "Robotics"],
  "schoolTypes": ["Research University"],
  "preferences": ["Scholarship Available"]
}

// 响应（data 字段）
[
  { "id": "uuid", "name": "MIT", "match_score": 87, "tier": "reach", "reason": "..." },
  ...
]
```

#### `POST /api/insights`
输入档案 + 匹配结果，返回 AI 生成的深度分析（雷达图数据 + 文字）。

```json
// 响应（data 字段）
{
  "radar": { "academic": 80, "testScores": 75, "competitions": 60, ... },
  "tierDist": { "reach": 12, "match": 8, "safety": 5 },
  "summary": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "strategy": "..."
}
```

---

## 5. 账号与资源信息

> ⚠️ **安全提示**：以下为账号平台信息，具体密码和 Secret Key 请通过安全渠道单独交接，不写入此文档。

### 5.1 GitHub 代码仓库

| 项目 | 仓库地址 |
|------|---------|
| PathPal 网站 | `https://github.com/junglemonkey112/Pathpal` |
| 微信小程序 | `/Users/bruce/WeChatProjects/mini-pathpal1`（本地，需推送到 GitHub 或交接代码包）|
| API 服务 | 需确认仓库位置（与 Bruce 确认）|

**GitHub 账号**：`junglemonkey112`（需交接账号或添加新 Owner）

### 5.2 Vercel（网站部署）

- **平台**：[vercel.com](https://vercel.com)
- **项目名**：`pathpal`
- **GitHub 联动**：已连接 `junglemonkey112/Pathpal`，推送 `main` 自动部署
- **需交接**：Vercel 账号访问权（可添加 Team Member），或转让项目所有权

### 5.3 Supabase（数据库）

- **平台**：[supabase.com](https://supabase.com)
- **项目 URL**：`https://tepoydlsqmqdfptjshqo.supabase.co`
- **需交接**：Supabase 账号 → 邀请新 Owner，或导出数据迁移
- **关键密钥**：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`（用于后端/管理操作）

### 5.4 阿里云（API 服务器）

- **平台**：[阿里云控制台](https://console.aliyun.com)
- **服务**：ECS 实例（规格、地区需与 Bruce 确认）
- **域名**：`api.gopathpal.com`（需确认注册平台和到期时间）
- **需交接**：阿里云账号 RAM 子用户权限，或账号转让

### 5.5 DashScope AI

- **平台**：[灵积控制台](https://dashscope.console.aliyun.com/)（阿里云子产品）
- **用途**：AI 聊天（网站）+ 大学匹配理由 + 深度分析（小程序）
- **需交接**：`DASHSCOPE_API_KEY`（当前可能与阿里云主账号绑定）

### 5.6 微信小程序账号

- **平台**：[微信公众平台](https://mp.weixin.qq.com)
- **AppID**：`wx7a2580fba9980cc8`
- **小程序名称**：PathPal（需确认是否已通过审核上线）
- **需交接**：公众平台账号管理员权限

### 5.7 域名

| 域名 | 用途 | 注册平台 |
|------|------|---------|
| `gopathpal.com`（含子域 `api.gopathpal.com`）| API 服务 | 待确认（可能在阿里云或 Namecheap）|
| `pathpal.vercel.app` | 网站（Vercel 免费子域）| Vercel 自动分配，无需续费 |

---

## 6. 续费与维护说明

### 6.1 需定期续费的服务

| 服务 | 周期 | 备注 |
|------|------|------|
| **阿里云 ECS 实例** | 月付或年付 | 到期未续费则 API 服务中断，国内用户无法使用小程序 |
| **域名 `api.gopathpal.com`** | 年付 | 到期未续费则域名失效，小程序无法访问 API |
| **DashScope API** | 按用量计费 | 需保证账户余额充足；用量较低时费用很少 |

### 6.2 免费服务（无需续费）

| 服务 | 说明 |
|------|------|
| **Vercel** | Free Plan，网站托管免费 |
| **Supabase** | Free Plan，每月 500MB 存储 + 50,000 行，够用 |
| **GitHub** | 公开仓库免费 |
| **Vercel API 部署** | 共用 Vercel Free Plan |

### 6.3 监控与告警

目前无自动监控配置，建议后续接入：
- Vercel 控制台查看部署状态和错误日志
- Supabase 控制台查看数据库使用量
- 阿里云控制台查看 ECS 状态

---

## 7. 开发上手指南

### 7.1 网站本地启动

```bash
git clone https://github.com/junglemonkey112/Pathpal.git
cd Pathpal
npm install

# 创建环境变量文件
cp .env.example .env.local  # 若不存在则手动创建
# 填入 Supabase 和 DashScope 的 Key

npm run dev
# 访问 http://localhost:3000
```

> 无环境变量时网站也可启动，使用本地 Mock 数据（顾问、大学、论坛均为演示数据）。

### 7.2 小程序本地开发

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具 → **导入项目** → 选择 `/Users/bruce/WeChatProjects/mini-pathpal1`
3. 使用 AppID `wx7a2580fba9980cc8`（需有该小程序的开发者权限）
4. 按 `⌘B` 编译

### 7.3 数据填充（Supabase）

网站提供了顾问数据的种子脚本：

```bash
cd Pathpal
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key> npx tsx scripts/seed-consultants.ts
```

大学数据（292 所）需单独导入，建议通过 Supabase 控制台的 SQL Editor 或 CSV 导入。

---

## 8. 其他补充说明

### 8.1 三项目的数据流关系

```
┌─────────────────────────┐         ┌─────────────────────────┐
│  PathPal 网站           │         │  微信小程序             │
│  (Next.js on Vercel)    │         │  (mini-pathpal1)        │
│                         │         │                         │
│  · 顾问搜索             │         │  · 学生档案录入         │
│  · 大学数据库           │         │  · 大学匹配             │
│  · 社区论坛             │         │  · AI 深度分析          │
│  · AI 聊天助手          │         │  · 双语（中/英）        │
└──────────┬──────────────┘         └────────────┬────────────┘
           │ Supabase JS                          │ HTTPS
           │                                      ▼
           │                         ┌─────────────────────────┐
           │                         │  PathPal API (FastAPI)  │
           │                         │  Vercel + 阿里云        │
           └──────────────────────── │  (共用同一套代码)       │
                  Supabase           └────────────┬────────────┘
                                                  │
                                    ┌─────────────┴─────────────┐
                                    │                           │
                          ┌─────────▼────────┐     ┌───────────▼────────┐
                          │  Supabase Postgres│     │  DashScope (Qwen)  │
                          │  292 所大学数据   │     │  AI 生成分析报告   │
                          └──────────────────┘     └────────────────────┘
```

### 8.2 目前未完成 / 待办事项

| 功能 | 状态 | 说明 |
|------|------|------|
| 顾问注册表单写入 DB | ⚠️ 未完成 | `/become-consultant` 页面是前端演示，提交后不写入数据库 |
| 预约/支付系统 | ⚠️ 未实现 | 顾问详情页的"Book"按钮无后续流程 |
| 用户个人中心 | ⚠️ 未实现 | 登录后无 profile 管理页面 |
| 小程序 API 服务源码 | ⚠️ 需确认 | FastAPI 后端代码需单独交接（确认仓库位置）|
| 阿里云服务器 SSH 访问 | ⚠️ 需交接 | 服务器 IP、SSH Key 需安全渠道单独传递 |

### 8.3 设计风格说明

- **网站**：采用 Tailwind CSS 4 自定义主题，主色调为深蓝（`#1B3A5C`），页面设计风格清晰、专业
- **小程序**：采用"Ivy League Trust"主题——深海军蓝 + 象牙白 + 金色点缀，营造美国顶尖学府的高端质感

### 8.4 联系与支持

如在交接过程中遇到技术问题，可通过以下方式获取帮助：
- 查阅各项目的 `README.md`
- 查阅 Next.js 官方文档：[nextjs.org/docs](https://nextjs.org/docs)
- 查阅 微信小程序开发文档：[developers.weixin.qq.com](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- 查阅 Supabase 文档：[supabase.com/docs](https://supabase.com/docs)

---

*文档结束 / End of Document*
