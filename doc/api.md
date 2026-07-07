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

```scss
@use '@kne/responsive-utils/scss' as resp;

@include resp.mobile { ... }
@include resp.mobile-container { ... }
@include resp.down(md) { ... }
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

### DOM 工具

| 函数 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `findScrollParent` | `(element: HTMLElement)` | `HTMLElement \| null` | 向上查找最近可滚动祖先 |
| `resolveBoundaryElement` | `(boundaryRef?)` | `HTMLElement` | 解析边界元素，默认 `document.body` |
| `resolveScrollElement` | `(scrollRef?, anchor?)` | `HTMLElement` | 解析滚动元素，默认文档滚动根 |
| `getDefaultScrollElement` | - | `HTMLElement` | 默认滚动根 |
| `getDefaultBoundaryElement` | - | `HTMLElement` | 默认 `document.body` |

### ExampleDriverResponsiveProvider

对接 `@kne/example-driver` / `modules-dev` 的响应式 Provider。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `runnerRef` | `RefObject<HTMLElement>` | - | example-driver 运行区域 ref |
| `simpleBarRef` | `RefObject` | - | 手机框 SimpleBar ref |
| `hasDeviceFrame` | `boolean` | `false` | 是否处于设备预览框 |
| `containerWidth` | `number` | - | 设备预览宽度，触发 `container` 模式 |

#### 辅助导出

| 名称 | 描述 |
|------|------|
| `createExampleDriverResponsiveProps` | 生成 `ResponsiveProvider` props |
| `EXAMPLE_DRIVER_RUNNER_CLASS` | runner 容器 class 名 |
| `EXAMPLE_DRIVER_PREVIEW_CLASS` | 预览区域 class 名 |
