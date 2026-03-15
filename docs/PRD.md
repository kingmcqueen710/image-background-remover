# Image Background Remover — MVP 需求文档

> 版本：v1.0 | 日期：2026-03-15 | 状态：草稿
> 飞书原文：https://feishu.cn/docx/K3OTd5BDqoHCOqxLe4icfNU5nre

---

## 一、项目概述

### 1.1 产品定位

一款基于 AI 的在线图片背景去除工具，目标用户为电商卖家、设计师、普通用户。核心价值：**免费、快速、无需注册即可使用**。

### 1.2 目标

- 上线一个可用的 MVP，验证 SEO 流量获取能力
- 关键词：`image background remover`、`remove background from photo free`
- 上线后 30 天内进入 Google 收录，90 天内获得自然流量

### 1.3 成功指标

| 指标 | MVP 目标（上线 90 天） |
|------|----------------------|
| Google 收录 | ✅ 已收录 |
| 月独立访客 | ≥ 1,000 UV |
| 工具使用次数 | ≥ 500 次/月 |
| 页面加载速度 | LCP < 2.5s |

---

## 二、用户故事

### 核心用户场景

1. **电商卖家**：上传商品图，去除白底/杂乱背景，换成纯白或透明背景，用于平台上架
2. **普通用户**：处理证件照、头像，快速抠图
3. **设计师**：快速获取透明底素材，用于后续设计

### 用户旅程（MVP）

```
访问网站 → 上传图片 → 自动处理（3-10秒）→ 预览效果 → 下载结果
```

---

## 三、功能需求

### 3.1 核心功能（Must Have）

#### F1 - 图片上传
- 支持拖拽上传和点击上传
- 支持格式：JPG、PNG、WEBP
- 文件大小限制：≤ 10MB
- 上传后立即触发处理，无需额外点击

#### F2 - AI 背景去除
- 调用 remove.bg API 处理图片
- 处理时间目标：< 10 秒
- 处理中显示 loading 动画
- 失败时展示友好错误提示，支持重试

#### F3 - 结果预览
- Before / After 对比滑块（slider）
- 结果图背景用棋盘格纹理表示透明
- 支持切换预览背景色（白色 / 黑色 / 透明）

#### F4 - 下载
- 免费用户：下载 PNG 格式，分辨率限制为原图的 50%（或最大 1000px）
- 下载按钮醒目，一键下载
- 文件名：`removed-bg-[原文件名].png`

#### F5 - 落地页 SEO 内容
- Hero 区：标题 + 副标题 + 上传入口
- 功能特性介绍（3-4 个卖点）
- 使用场景说明（电商、证件照、设计）
- FAQ 模块（至少 5 条）
- 页脚：关键词相关的 anchor text

### 3.2 非核心功能（Nice to Have，MVP 不做）

- 用户注册 / 登录
- 批量处理
- 背景替换（换背景图）
- 付费订阅
- API 开放

---

## 四、技术方案

### 4.1 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | Next.js 14 (App Router) | SSR/SSG，SEO 友好 |
| UI 组件 | Tailwind CSS + shadcn/ui | 快速开发 |
| 图片上传 | react-dropzone | 拖拽体验 |
| Before/After | react-compare-slider | 对比预览 |
| AI 抠图 | remove.bg API | MVP 阶段，免费额度 50 张/月 |
| 部署 | Vercel | 免费，自动 CI/CD |
| 域名 | 自购（建议含 background-remover 关键词） | |

### 4.2 系统架构（MVP）

```
用户浏览器
    │
    ▼
Next.js (Vercel)
    │  前端页面 + API Routes
    │
    ▼
/api/remove-bg  ──→  remove.bg API
    │
    ▼
返回处理后图片（base64）→ 前端展示 + 下载
```

### 4.3 API 设计

**POST /api/remove-bg**

Request:
```json
{
  "image": "base64字符串 或 multipart/form-data"
}
```

Response（成功）:
```json
{
  "result": "base64字符串（PNG）",
  "width": 800,
  "height": 600
}
```

Response（失败）:
```json
{
  "error": "处理失败，请重试",
  "code": "PROCESSING_FAILED"
}
```

### 4.4 限流策略（MVP）

- 同一 IP：每小时最多处理 10 张
- 单次文件大小：≤ 10MB
- 超限时返回友好提示，引导注册（为后续付费做铺垫）

---

## 五、页面设计

### 5.1 页面结构

```
/                    ← 主落地页（唯一页面）
/api/remove-bg       ← 后端接口
```

### 5.2 主页面布局

```
┌─────────────────────────────────────┐
│  Logo          Nav（可选）           │
├─────────────────────────────────────┤
│                                     │
│   Remove Image Background Free      │  ← H1，含核心关键词
│   AI-powered, instant, no signup    │  ← 副标题
│                                     │
│   ┌─────────────────────────────┐   │
│   │   拖拽图片到这里 / 点击上传  │   │  ← 上传区域（核心交互）
│   └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [处理结果区域 - 上传后显示]         │
│  Before ←──slider──→ After          │
│  [下载按钮]                          │
├─────────────────────────────────────┤
│  Features: 快速 / 免费 / 高精度      │
├─────────────────────────────────────┤
│  使用场景：电商 / 证件照 / 设计      │
├─────────────────────────────────────┤
│  FAQ                                │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### 5.3 关键 UI 状态

| 状态 | 展示内容 |
|------|---------|
| 初始 | 上传区域（虚线框 + 图标 + 提示文字） |
| 上传中 | 进度条或 spinner |
| 处理中 | "AI is removing background..." + 动画 |
| 完成 | Before/After 对比 + 下载按钮 |
| 失败 | 错误提示 + 重试按钮 |

---

## 六、SEO 策略

### 6.1 页面 Meta

```
Title: Free AI Image Background Remover - Remove BG Online
Description: Remove image background instantly with AI. Free, no signup required.
             Perfect for ecommerce, portraits, and design. Try now!
```

### 6.2 目标关键词

| 关键词 | 月搜索量（估算） | 竞争度 |
|--------|----------------|--------|
| image background remover | 1M+ | 高 |
| remove background from image free | 500K+ | 高 |
| background remover online | 300K+ | 高 |
| remove bg from photo | 200K+ | 中 |
| transparent background maker | 100K+ | 中 |

### 6.3 SEO 技术要求

- [ ] Next.js generateMetadata 配置完整
- [ ] OG 图片（用于社交分享）
- [ ] sitemap.xml 自动生成
- [ ] robots.txt 配置
- [ ] 结构化数据（WebApplication schema）
- [ ] 页面加载速度：LCP < 2.5s，CLS < 0.1

---

## 七、开发计划

| 阶段 | 内容 | 预计时间 |
|------|------|---------|
| Day 1 | 项目初始化、基础页面框架、上传组件 | 1 天 |
| Day 2 | 接入 remove.bg API、处理逻辑、结果展示 | 1 天 |
| Day 3 | Before/After 对比、下载功能、限流 | 1 天 |
| Day 4 | SEO 内容填充、Meta 配置、性能优化 | 1 天 |
| Day 5 | 测试、修 bug、部署上线 | 1 天 |

**总计：5 个工作日可上线**

---

## 八、风险与依赖

| 风险 | 影响 | 应对方案 |
|------|------|---------|
| remove.bg 免费额度用完（50张/月） | 服务中断 | 提前准备付费计划或切换 REMBG 自部署 |
| SEO 竞争激烈，排名慢 | 流量获取慢 | 补充长尾词内容页，考虑 Reddit/ProductHunt 推广 |
| 图片隐私问题 | 用户信任 | 明确隐私政策：处理后立即删除，不存储用户图片 |

---

## 九、后续迭代方向（Post-MVP）

1. **降成本**：自部署 REMBG 或 BiRefNet，替换 remove.bg API
2. **提转化**：加入注册引导，免费用户每日 3 张，注册后 10 张
3. **付费功能**：高分辨率下载、批量处理、背景替换
4. **多语言**：中文、日语、西班牙语落地页
5. **API 开放**：面向开发者的付费 API

---

*文档由 AI 助手生成，请根据实际情况调整。*
