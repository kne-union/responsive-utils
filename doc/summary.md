### 统一响应式基础设施

`@kne/responsive-utils` 为 KNE 前端提供统一的断点 token、React Hooks、弹层边界与滚动上下文，避免各业务包各自手写 `768px` / `getPopupContainer`。

### 推荐接入顺序

1. **快速入门**：按类名标记 boundary / scroll，包一层 `ResponsiveProvider`，用 `useIsMobile` + `usePopupContainer`
2. **ResponsiveProvider**：理解 `viewport`（跟窗口）与 `container`（跟指定宽度）两种模式
3. **目标类名**：掌握 `RESPONSIVE_*_CLASS` —— 多数场景不必手传 ref
4. **布局 Hooks**：`useIsMobile` → `useBreakpoint` → `useMediaQuery`
5. **浮层与滚动**：`usePopupContainer`、`useScrollElement`
6. **移动端弹层**：`useMobilePopupMount`（业务只选 `cover`）
7. **DOM 工具**：无 React 树时的底层解析

### 主要能力

| 能力 | 入口 |
|------|------|
| 移动端判定（&lt;768） | `useIsMobile` / `MOBILE_BREAKPOINT` |
| 多断点 | `useBreakpoint` / `BREAKPOINTS` |
| 任意 media query | `useMediaQuery` |
| 弹层挂载边界 | `usePopupContainer` + `RESPONSIVE_BOUNDARY_CLASS` |
| 滚动容器 | `useScrollElement` + `RESPONSIVE_SCROLL_CLASS` |
| 移动端 Modal / 半屏 | `useMobilePopupMount({ cover })` |
| SCSS 容器查询 | `@use '~@kne/responsive-utils/scss' as resp` |

### 常见误区

- 不要手写 `@media (max-width: 768px)` 或自造断点常量；JS 用 Hooks，样式用包内 SCSS mixin
- 跟浏览器窗口走用默认 `viewport`；按局部宽度模拟用 `mode="container"` + `containerWidth`
- 移动端弹层只选 `cover: 'boundary' | 'viewport'`，不要自己拼挂载节点策略
