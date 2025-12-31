### IQuest（React + Webpack 版）

本项目已从纯静态 HTML 改写为 **React + Webpack 5**，并保持原有界面样式与资源路径不变（`/images/*`、`/demo/*`、`/style.css`）。

### 目录说明

- `public/index.html`: Webpack HTML 模板（由 HtmlWebpackPlugin 注入打包后的脚本）
- `src/App.jsx`: 主页 UI（保持与原 `index.html` 一致）
- `src/assets/style.css`: 原样式文件（构建时复制到 `dist/style.css`）
- `src/assets/images/`: 原图片资源（构建时复制到 `dist/images/*`）
- `src/assets/demo/`: 原 demo 页面（构建时复制到 `dist/demo/*`，仍通过 iframe 嵌入）
- `index.static.html`: 原始静态主页备份

### 启动开发服务器

在项目根目录执行：

```bash
npm install
npm start
```

然后访问：`http://localhost:3000/`

### 部署到 GitHub Pages

本项目已满足 Pages 的关键要求（构建产物在 `dist/`，并使用相对路径 `./`；路由为 `HashRouter`）。

- **方式 A（推荐）：GitHub Actions 自动部署**
  1. 已添加工作流：`.github/workflows/pages.yml`（push 到 `main` 会自动构建并发布 `dist/`）
  2. 到 GitHub 仓库设置：`Settings -> Pages -> Build and deployment -> Source` 选择 **GitHub Actions**
  3. 之后每次 push 到 `main`，会自动更新 Pages

- **方式 B：本地一键部署到 gh-pages 分支**
  1. 安装依赖：`npm install`
  2. 执行：`npm run deploy`
  3. 到 GitHub 仓库设置：`Settings -> Pages -> Source` 选择 **Deploy from a branch**，分支选 `gh-pages`、目录选 `/ (root)`

### 构建与预览

```bash
npm run build
npm run preview
```

预览地址：`https://localhost:4000/`

### 路由说明（history 模式）

本项目使用 `react-router-dom` 的 `HashRouter`（hash 路由）。
