### 怎么选 API

| 你想做的事 | 用这个 |
|-----------|--------|
| 判断是不是移动端 | `useIsMobile` |
| 按 xs~xxl 改布局 | `useBreakpoint` |
| 任意 media query | `useMediaQuery` |
| antd Select / DatePicker 不被裁剪 | `usePopupContainer` + `RESPONSIVE_BOUNDARY_CLASS` |
| 拿到主内容滚动根 | `useScrollElement` + `RESPONSIVE_SCROLL_CLASS` |
| 移动端 Modal / 半屏挂载 | `useMobilePopupMount({ cover })` |
| 按局部容器宽度判定 | `ResponsiveProvider mode="container"` |
| 样式断点 | SCSS `@use '~@kne/responsive-utils/scss' as resp` |

完整用法见各 Demo；下面是参数与返回值明细。

### 断点 Token

统一断点常量，与 SCSS mixin 同源。

#### 导出

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `BREAKPOINTS` | `Record<string, number>` | `{ xs:0, sm:576, md:768, lg:992, xl:1200, xxl:1600 }` | 断点像素值 |
| `MOBILE_BREAKPOINT` | `number` | `768` | 移动端阈值，等于 `BREAKPOINTS.md` |
| `IS_MOBILE_QUERY` | `string` | `(max-width: 768px)` | `matchMedia` 查询字符串 |
| `BREAKPOINT_KEYS` | `string[]` | `['xs','sm','md','lg','xl','xxl']` | 断点 key 列表 |

### SCSS

容器查询使用统一名称 `kne-responsive`（`$responsive-container-name`），业务方无需硬编码。

**宿主元素**（需要容器查询的根节点）：

```scss
@use '@kne/responsive-utils/scss' as resp;

.page-host {
  @include resp.responsive-container;
}
```

**子元素样式**：

```scss
@include resp.mobile-container { ... }
@include resp.container-down(md) { ... }
@include resp.mobile { ... } // 视口 @media
```

### 响应式目标类名

| 名称 | 类名 | 用途 |
|------|------|------|
| `RESPONSIVE_CONTAINER_CLASS` | `kne-responsive-container` | 容器查询宿主（配合 `responsive-container` mixin） |
| `RESPONSIVE_BOUNDARY_CLASS` | `kne-responsive-boundary` | 弹层挂载边界（`getPopupContainer` / `usePopupContainer`） |
| `RESPONSIVE_SCROLL_CLASS` | `kne-responsive-scroll` | 滚动参照容器（`useScrollElement` / Affix / BackTop） |

DOM 查找：`findResponsiveBoundary(anchor)`、`findResponsiveScroll(anchor)`。无自定义注入时 Provider 默认按类名解析，再回退 `body` / `documentElement`。

```jsx
<div className={RESPONSIVE_CONTAINER_CLASS} />
<div className={RESPONSIVE_BOUNDARY_CLASS}>{children}</div>
<div className={RESPONSIVE_SCROLL_CLASS}>{children}</div>
```

### 容器查询（JS / 内联样式）

| 名称 | 说明 |
|------|------|
| `containerMobileBlock(rules)` | 生成移动端 `@container` 规则块，无需知道容器名 |
| `containerDownBlock('sm', rules)` | 按断点 key 生成容器查询块 |
| `RESPONSIVE_CONTAINER_NAME` | 高级场景用，一般不必直接使用 |

```js
import { containerMobileBlock } from '@kne/responsive-utils';

const css = `
  .box { background: blue; }
  ${containerMobileBlock('.box { background: green; }')}
`;
```

### ResponsiveProvider

为子树注入响应式上下文，控制移动端判定、弹窗边界与滚动容器。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `mode` | `'viewport' \| 'container'` | `'viewport'` | 视口模式或容器宽度模式 |
| `containerWidth` | `number` | - | `container` 模式下用于 `useIsMobile` / `useBreakpoint` 的宽度 |
| `getBoundaryElement` | `() => HTMLElement` | - | 自定义弹窗挂载边界 |
| `getScrollElement` | `() => HTMLElement` | - | 自定义滚动参照元素 |
| `boundaryRef` | `RefObject<HTMLElement>` | - | 边界 DOM ref，优先级低于 `getBoundaryElement` |
| `scrollRef` | `RefObject<HTMLElement>` | - | 滚动容器 ref |
| `scrollAnchorRef` | `RefObject<HTMLElement>` | - | 从锚点向上解析滚动父级 |

### useIsMobile

判断当前是否为移动端（宽度 &lt; 768px）。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `isMobile` | `boolean` | 视口或容器宽度是否小于 `md` |

无 Provider 时回退到 `(max-width: 768px)` 的 `matchMedia`。

### useBreakpoint

返回各断点命中状态与 `isMobile`。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `xs` ~ `xxl` | `boolean` | 当前宽度是否达到对应断点 |
| `isMobile` | `boolean` | 同 `useIsMobile` |

### useMediaQuery

订阅任意 CSS media query。

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `query` | `string` | - | 标准 media query 字符串 |

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `matches` | `boolean` | 查询是否命中 |

`container` 模式下对含 `max-width` 的 query 会映射到 `getIsMobile()`。

### usePopupContainer

返回 antd `getPopupContainer` 回调。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `getPopupContainer` | `() => HTMLElement` | 弹窗挂载边界 getter |

### useScrollElement

返回滚动容器 getter。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `getScrollElement` | `() => HTMLElement` | 滚动参照元素 getter |

### 移动端弹层挂载（推荐）

业务只关心「罩住哪」：选 `cover` 即可，挂载节点与定位类名由库根据 Provider 模式自动决定。

#### 常量

| 名称 | 值 | 描述 |
|------|-----|------|
| `MOBILE_POPUP_MODE.boundary` | `kne-is-boundary` | 相对 boundary `absolute`（组件自行写 CSS） |
| `MOBILE_POPUP_MODE.viewport` | `kne-is-viewport` | 相对视口 `fixed` |
| `MOBILE_POPUP_COVER.boundary` | `boundary` | 罩住 Provider boundary（**默认**，Modal） |
| `MOBILE_POPUP_COVER.viewport` | `viewport` | 罩住当前移动可视区域（半屏 Select） |

#### `useMobilePopupMount`

```jsx
import { useMobilePopupMount } from '@kne/responsive-utils';

// Modal：默认挂 boundary
const { isMobile, getPopupContainer, fixedModeClass, anchorRef } = useMobilePopupMount();

// 底部半屏
const sheet = useMobilePopupMount({ cover: 'viewport' });
```

| 参数 | 类型 | 默认 | 描述 |
|------|------|------|------|
| `cover` | `'boundary' \| 'viewport'` | `'boundary'` | 弹层罩住范围 |
| `getPopupContainer` | `(trigger?) => HTMLElement \| null` | - | 调用方覆盖挂载节点 |

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `isMobile` | `boolean` | 是否移动端 UI |
| `fixedModeClass` | `string \| null` | `kne-is-boundary` / `kne-is-viewport` / 桌面 `null` |
| `getMountNode` | `(trigger?) => HTMLElement \| null` | portal 挂载节点 |
| `getPopupContainer` | `(trigger?) => HTMLElement` | 可直接给 Antd |
| `anchorRef` | `(node) => void` | 挂到触发器上，便于解析挂载上下文 |

行为摘要：

| `cover` | `mode=container`（或嵌套 boundary） | `mode=viewport` 且移动端 |
|---------|--------------------------------------|---------------------------|
| `boundary` | boundary + `kne-is-boundary` | boundary + `kne-is-boundary` |
| `viewport` | boundary + `kne-is-boundary` | `body` + `kne-is-viewport` |

另有 `useMobileFixedMode`、`resolveMobilePopupContainer` 等供高级/测试场景。

### DOM 工具

| 函数 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `findScrollParent` | `(element: HTMLElement)` | `HTMLElement \| null` | 向上查找最近可滚动祖先 |
| `findResponsiveBoundary` | `(anchor?)` | `HTMLElement \| null` | 查找 boundary |
| `findResponsiveScroll` | `(anchor?)` | `HTMLElement \| null` | 查找 scroll 容器 |
| `resolveMobilePopupContainer` | `(options)` | `HTMLElement \| null` | 纯函数挂载策略 |
| `resolveBoundaryElement` | `(boundaryRef?)` | `HTMLElement` | 解析边界元素，默认 `document.body` |
| `resolveScrollElement` | `(scrollRef?, anchor?)` | `HTMLElement` | 解析滚动元素，默认文档滚动根 |
| `getDefaultScrollElement` | - | `HTMLElement` | 默认滚动根 |
| `getDefaultBoundaryElement` | - | `HTMLElement` | 默认 `document.body` |
