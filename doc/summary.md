### 统一响应式基础设施

`@kne/responsive-utils` 为 KNE 前端项目提供统一的断点 token、React Hooks、弹窗边界与滚动容器上下文，替代各业务包中分散的 `768px` 判断与 `getPopupContainer` 实现。

### 主要特性

- **统一断点**：`BREAKPOINTS`、`MOBILE_BREAKPOINT`（768px）与 SCSS mixin 一处维护
- **React Hooks**：`useIsMobile`、`useBreakpoint`、`useMediaQuery`、`usePopupContainer`、`useScrollElement`
- **上下文 Provider**：`ResponsiveProvider` 支持视口模式与容器模式（设备预览框）
- **DOM 工具**：`findScrollParent`、`resolveBoundaryElement`、`resolveScrollElement`
- **生态集成**：`ExampleDriverResponsiveProvider` 对接 `@kne/example-driver` 与 `modules-dev`

### 使用场景

- 后台管理页根据移动端/桌面端切换布局与交互
- antd `Select`、`DatePicker` 等浮层挂载到正确边界，避免被父级 `overflow: hidden` 裁剪
- 滚动容器内 sticky、锚点、虚拟列表需要获取真实滚动根
- example-driver 手机预览框内按设备宽度模拟 `useIsMobile`
