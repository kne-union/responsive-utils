# responsive-utils

### 描述

Unified responsive breakpoints, hooks, popup boundary and scroll context for KNE projects.

### 安装

```shell
npm i --save @kne/responsive-utils
```

### 概述

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


### 示例(全屏)

#### 示例代码

- 快速入门
- 断点 token 与核心 Hooks 一览，展示视口模式下的移动端判定与断点状态
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {
  BREAKPOINTS,
  MOBILE_BREAKPOINT,
  IS_MOBILE_QUERY,
  useIsMobile,
  useBreakpoint
} = _ResponsiveUtils;
const {Card, Descriptions, Flex, Tag, Typography} = antd;
const {useMemo} = React;

const BreakpointTags = () => {
  const breakpoints = useBreakpoint();
  const isMobile = useIsMobile();

  const activeKeys = useMemo(
    () => Object.keys(breakpoints).filter((key) => key !== 'isMobile' && breakpoints[key]),
    [breakpoints]
  );

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="断点 Token">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="MOBILE_BREAKPOINT">{MOBILE_BREAKPOINT}px</Descriptions.Item>
          <Descriptions.Item label="IS_MOBILE_QUERY">{IS_MOBILE_QUERY}</Descriptions.Item>
          <Descriptions.Item label="BREAKPOINTS">
            {Object.entries(BREAKPOINTS)
              .map(([key, value]) => &#96;${key}: ${value}&#96;)
              .join(' / ')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card size="small" title="实时响应式状态">
        <Flex vertical gap={8}>
          <Typography.Text>
            当前设备：
            <Tag color={isMobile ? 'orange' : 'blue'}>{isMobile ? '移动端' : '桌面端'}</Tag>
          </Typography.Text>
          <Typography.Text type="secondary">已命中断点：{activeKeys.join(', ') || 'xs'}</Typography.Text>
        </Flex>
      </Card>
    </Flex>
  );
};

render(<BreakpointTags />);

```

- ResponsiveProvider
- 视口模式与容器模式对比，演示 boundaryRef / scrollRef 自定义弹窗边界与滚动容器
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {ResponsiveProvider, useIsMobile, usePopupContainer, useScrollElement} = _ResponsiveUtils;
const {Card, DatePicker, Flex, InputNumber, Select, Switch, Typography} = antd;
const {useRef, useState} = React;

const PRESET_WIDTHS = [
  {label: 'iPhone SE (375)', value: 375},
  {label: 'iPad Mini (768)', value: 768},
  {label: 'iPad Pro (1024)', value: 1024},
  {label: 'Desktop (1440)', value: 1440}
];

const ProviderDemo = () => {
  const isMobile = useIsMobile();
  const getPopupContainer = usePopupContainer();
  const getScrollElement = useScrollElement();
  const [scrollTop, setScrollTop] = useState(0);

  React.useEffect(() => {
    const el = getScrollElement();
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [getScrollElement]);

  return (
    <Flex vertical gap={12}>
      <Typography.Text>
        Provider 判定：
        <Typography.Text type={isMobile ? 'warning' : 'success'} strong>
          {isMobile ? '移动端布局' : '桌面端布局'}
        </Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">滚动容器 scrollTop：{scrollTop}px</Typography.Text>
      <Select
        style={{width: 200}}
        placeholder="选择部门"
        getPopupContainer={getPopupContainer}
        options={[
          {label: '研发中心', value: 'rd'},
          {label: '产品中心', value: 'pm'},
          {label: '运营中心', value: 'ops'}
        ]}
      />
      <DatePicker getPopupContainer={getPopupContainer} placeholder="选择生效日期" />
    </Flex>
  );
};

const ResponsiveProviderExample = () => {
  const [useContainerMode, setUseContainerMode] = useState(true);
  const [containerWidth, setContainerWidth] = useState(375);
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Flex gap={16} align="center" wrap="wrap">
        <Flex gap={8} align="center">
          <Typography.Text>容器模式</Typography.Text>
          <Switch checked={useContainerMode} onChange={setUseContainerMode} />
        </Flex>
        {useContainerMode && (
          <Flex gap={8} align="center">
            <Typography.Text>模拟宽度</Typography.Text>
            <InputNumber
              min={320}
              max={1600}
              value={containerWidth}
              onChange={(v) => setContainerWidth(v || 375)}
            />
            <Select
              style={{width: 180}}
              value={containerWidth}
              onChange={setContainerWidth}
              options={PRESET_WIDTHS}
            />
          </Flex>
        )}
      </Flex>
      <div
        ref={boundaryRef}
        style={{
          position: 'relative',
          border: '1px dashed #91caff',
          borderRadius: 8,
          padding: 12,
          background: '#f0f5ff'
        }}
      >
        <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
          boundaryRef 区域（浮层挂载到此）
        </Typography.Text>
        <div
          ref={scrollRef}
          style={{
            height: 180,
            overflow: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            padding: 12,
            background: '#fff'
          }}
        >
          <div style={{height: 320}}>
            <ResponsiveProvider
              mode={useContainerMode ? 'container' : 'viewport'}
              containerWidth={useContainerMode ? containerWidth : undefined}
              boundaryRef={boundaryRef}
              scrollRef={scrollRef}
            >
              <ProviderDemo />
            </ResponsiveProvider>
          </div>
        </div>
      </div>
      <Card size="small">
        <Typography.Paragraph type="secondary" style={{margin: 0}}>
          切换「容器模式」后，useIsMobile 按 containerWidth 判定而非浏览器视口；boundaryRef / scrollRef
          覆盖默认的 body / documentElement。
        </Typography.Paragraph>
      </Card>
    </Flex>
  );
};

render(<ResponsiveProviderExample />);

```

- useIsMobile
- 监听视口或容器宽度，驱动布局切换与条件渲染
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {ResponsiveProvider, useIsMobile, MOBILE_BREAKPOINT} = _ResponsiveUtils;
const {Card, Col, Flex, InputNumber, Row, Switch, Tag, Typography} = antd;
const {useState} = React;

const LayoutPreview = () => {
  const isMobile = useIsMobile();

  return (
    <Card
      size="small"
      title={
        <Flex gap={8} align="center">
          <span>订单列表</span>
          <Tag color={isMobile ? 'orange' : 'geekblue'}>{isMobile ? '移动布局' : '桌面布局'}</Tag>
        </Flex>
      }
    >
      {isMobile ? (
        <Flex vertical gap={8}>
          {['ORD-20240701-001', 'ORD-20240701-002', 'ORD-20240701-003'].map((id) => (
            <Card key={id} size="small" type="inner">
              <Typography.Text strong>{id}</Typography.Text>
              <br />
              <Typography.Text type="secondary">客户：华东分公司 · ¥12,800</Typography.Text>
            </Card>
          ))}
        </Flex>
      ) : (
        <Row gutter={[12, 12]}>
          {['ORD-20240701-001', 'ORD-20240701-002', 'ORD-20240701-003'].map((id) => (
            <Col key={id} span={8}>
              <Card size="small">
                <Typography.Text strong>{id}</Typography.Text>
                <br />
                <Typography.Text type="secondary">客户：华东分公司 · ¥12,800</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};

const UseIsMobileExample = () => {
  const viewportIsMobile = useIsMobile();
  const [simulateContainer, setSimulateContainer] = useState(false);
  const [containerWidth, setContainerWidth] = useState(414);

  return (
    <Flex vertical gap={16}>
      <Card size="small">
        <Descriptions viewportIsMobile={viewportIsMobile} />
      </Card>
      <Flex gap={12} align="center" wrap="wrap">
        <Flex gap={8} align="center">
          <Typography.Text>模拟容器宽度</Typography.Text>
          <Switch checked={simulateContainer} onChange={setSimulateContainer} />
        </Flex>
        {simulateContainer && (
          <InputNumber
            min={320}
            max={1200}
            addonAfter="px"
            value={containerWidth}
            onChange={(v) => setContainerWidth(v || 414)}
          />
        )}
      </Flex>
      {simulateContainer ? (
        <div style={{width: containerWidth, border: '1px solid #f0f0f0', borderRadius: 8, padding: 8}}>
          <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
            容器宽度 {containerWidth}px（阈值 {MOBILE_BREAKPOINT}px）
          </Typography.Text>
          <ResponsiveProvider mode="container" containerWidth={containerWidth}>
            <LayoutPreview />
          </ResponsiveProvider>
        </div>
      ) : (
        <LayoutPreview />
      )}
    </Flex>
  );
};

const Descriptions = ({viewportIsMobile}) => {
  const {Descriptions: AntDescriptions} = antd;
  return (
    <AntDescriptions column={1} size="small">
      <AntDescriptions.Item label="视口 useIsMobile">
        {viewportIsMobile ? 'true（< 768px）' : 'false（≥ 768px）'}
      </AntDescriptions.Item>
      <AntDescriptions.Item label="典型用途">侧栏折叠、表格卡片化、底部操作栏</AntDescriptions.Item>
    </AntDescriptions>
  );
};

render(<UseIsMobileExample />);

```

- useBreakpoint
- 返回 xs~xxl 各断点命中状态，用于栅格、侧栏、表格列显隐
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {BREAKPOINTS, useBreakpoint} = _ResponsiveUtils;
const {Card, Flex, Progress, Tag, Typography} = antd;

const BREAKPOINT_META = [
  {key: 'xs', label: '超小屏', desc: '手机竖屏'},
  {key: 'sm', label: '小屏', desc: '手机横屏 / 小平板'},
  {key: 'md', label: '中屏', desc: '平板 / 小笔记本'},
  {key: 'lg', label: '大屏', desc: '桌面'},
  {key: 'xl', label: '超大屏', desc: '宽屏桌面'},
  {key: 'xxl', label: '巨屏', desc: '4K / 超宽'}
];

const UseBreakpointExample = () => {
  const breakpoints = useBreakpoint();

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="断点命中状态">
        <Flex vertical gap={10}>
          {BREAKPOINT_META.map(({key, label, desc}) => {
            const active = breakpoints[key];
            const width = BREAKPOINTS[key];
            return (
              <Flex key={key} justify="space-between" align="center">
                <Flex gap={8} align="center">
                  <Tag color={active ? 'processing' : 'default'}>{key}</Tag>
                  <Typography.Text>
                    {label}（≥{width}px）
                  </Typography.Text>
                  <Typography.Text type="secondary">{desc}</Typography.Text>
                </Flex>
                <Tag color={active ? 'success' : 'default'}>{active ? '命中' : '未命中'}</Tag>
              </Flex>
            );
          })}
        </Flex>
      </Card>
      <Card size="small" title="侧栏宽度示意">
        <Flex vertical gap={8}>
          <Typography.Text>
            isMobile：
            <Tag color={breakpoints.isMobile ? 'orange' : 'blue'}>
              {String(breakpoints.isMobile)}
            </Tag>
          </Typography.Text>
          <Typography.Text type="secondary">侧栏占位比例（随断点变化）</Typography.Text>
          <Progress
            percent={
              breakpoints.xxl ? 100 : breakpoints.xl ? 85 : breakpoints.lg ? 70 : breakpoints.md ? 50 : 30
            }
            showInfo={false}
            strokeColor={breakpoints.isMobile ? '#fa8c16' : '#1677ff'}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

render(<UseBreakpointExample />);

```

- useMediaQuery
- 订阅任意 media query，支持容器模式下的 max-width 映射
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {ResponsiveProvider, useMediaQuery, useIsMobile, IS_MOBILE_QUERY} = _ResponsiveUtils;
const {Card, Flex, InputNumber, Switch, Tag, Typography} = antd;
const {useState} = React;

const CUSTOM_QUERIES = [
  {label: '紧凑模式 (max-width: 576px)', query: '(max-width: 576px)'},
  {label: '宽屏 (min-width: 1200px)', query: '(min-width: 1200px)'},
  {label: '横屏', query: '(orientation: landscape)'},
  {label: '深色偏好', query: '(prefers-color-scheme: dark)'}
];

const QueryRow = ({label, query}) => {
  const matches = useMediaQuery(query);
  return (
    <Flex justify="space-between" align="center">
      <Typography.Text>{label}</Typography.Text>
      <Tag color={matches ? 'success' : 'default'}>{matches ? '匹配' : '不匹配'}</Tag>
    </Flex>
  );
};

const MediaQueryPanel = () => {
  const isMobile = useIsMobile();

  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between" align="center">
        <Typography.Text>IS_MOBILE_QUERY</Typography.Text>
        <Tag color={isMobile ? 'orange' : 'blue'}>{isMobile ? '匹配' : '不匹配'}</Tag>
      </Flex>
      {CUSTOM_QUERIES.map((item) => (
        <QueryRow key={item.query} {...item} />
      ))}
    </Flex>
  );
};

const UseMediaQueryExample = () => {
  const [containerMode, setContainerMode] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);

  return (
    <Flex vertical gap={16}>
      <Card size="small">
        <Typography.Paragraph type="secondary" style={{margin: 0}}>
          useMediaQuery 订阅标准 matchMedia。容器模式下，含 max-width 的 query 会映射到 Provider 的
          getIsMobile()。
        </Typography.Paragraph>
      </Card>
      <Flex gap={12} align="center">
        <Typography.Text>容器模式</Typography.Text>
        <Switch checked={containerMode} onChange={setContainerMode} />
        {containerMode && (
          <InputNumber
            min={320}
            max={1600}
            value={containerWidth}
            onChange={(v) => setContainerWidth(v || 500)}
            addonAfter="px"
          />
        )}
      </Flex>
      {containerMode ? (
        <ResponsiveProvider mode="container" containerWidth={containerWidth}>
          <Card size="small" title={&#96;容器 ${containerWidth}px&#96;}>
            <MediaQueryPanel />
          </Card>
        </ResponsiveProvider>
      ) : (
        <Card size="small" title="视口模式">
          <MediaQueryPanel />
        </Card>
      )}
      <Typography.Text type="secondary" code>
        {IS_MOBILE_QUERY}
      </Typography.Text>
    </Flex>
  );
};

render(<UseMediaQueryExample />);

```

- usePopupContainer
- 为 antd 浮层组件提供 getPopupContainer，避免 overflow 裁剪
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {ResponsiveProvider, usePopupContainer, useIsMobile} = _ResponsiveUtils;
const {Card, DatePicker, Flex, Select, Tooltip, Typography} = antd;
const {useRef} = React;

const DEPARTMENT_OPTIONS = [
  {label: '研发中心 / 前端组', value: 'fe'},
  {label: '研发中心 / 后端组', value: 'be'},
  {label: '产品中心 / 设计组', value: 'design'},
  {label: '运营中心 / 增长组', value: 'growth'}
];

const PopupDemo = () => {
  const getPopupContainer = usePopupContainer();
  const isMobile = useIsMobile();

  return (
    <Flex vertical gap={12}>
      <Typography.Text type="secondary">
        当前 {isMobile ? '移动端' : '桌面端'}，浮层挂载到 Provider 指定的 boundary 元素
      </Typography.Text>
      <Select
        style={{width: '100%'}}
        placeholder="选择归属部门"
        getPopupContainer={getPopupContainer}
        options={DEPARTMENT_OPTIONS}
      />
      <DatePicker.RangePicker
        style={{width: '100%'}}
        getPopupContainer={getPopupContainer}
        placeholder={['合同开始', '合同结束']}
      />
      <Tooltip title="挂载边界内的 Tooltip 不会被 overflow:hidden 裁剪" getPopupContainer={getPopupContainer}>
        <Typography.Link>悬停查看 Tooltip</Typography.Link>
      </Tooltip>
    </Flex>
  );
};

const UsePopupContainerExample = () => {
  const boundaryRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <div
        ref={boundaryRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #ffa39e',
          borderRadius: 8,
          padding: 16,
          background: '#fff2f0'
        }}
      >
        <Typography.Text type="danger" style={{display: 'block', marginBottom: 12}}>
          此容器设置了 overflow: hidden — 未指定 getPopupContainer 时浮层会被裁剪
        </Typography.Text>
        <ResponsiveProvider boundaryRef={boundaryRef}>
          <PopupDemo />
        </ResponsiveProvider>
      </div>
      <Card size="small">
        <Typography.Paragraph style={{margin: 0}} type="secondary">
          usePopupContainer 返回 <Typography.Text code>() =&gt; HTMLElement</Typography.Text>
          ，直接传给 antd 组件的 getPopupContainer 属性即可。
        </Typography.Paragraph>
      </Card>
    </Flex>
  );
};

render(<UsePopupContainerExample />);

```

- useScrollElement
- 获取滚动参照元素，用于锚点定位与滚动监听
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {ResponsiveProvider, useScrollElement} = _ResponsiveUtils;
const {Button, Card, Flex, Typography} = antd;
const {useEffect, useRef, useState} = React;

const ScrollMonitor = () => {
  const getScrollElement = useScrollElement();
  const [info, setInfo] = useState({scrollTop: 0, clientHeight: 0, scrollHeight: 0});

  useEffect(() => {
    const el = getScrollElement();
    const update = () => {
      setInfo({
        scrollTop: el.scrollTop,
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight
      });
    };
    update();
    el.addEventListener('scroll', update, {passive: true});
    return () => el.removeEventListener('scroll', update);
  }, [getScrollElement]);

  const scrollToTop = () => {
    const el = getScrollElement();
    el.scrollTo({top: 0, behavior: 'smooth'});
  };

  const scrollToBottom = () => {
    const el = getScrollElement();
    el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
  };

  return (
    <Flex vertical gap={8}>
      <Typography.Text>
        scrollTop: {info.scrollTop}px / 可视高度: {info.clientHeight}px / 总高度: {info.scrollHeight}px
      </Typography.Text>
      <Flex gap={8}>
        <Button size="small" onClick={scrollToTop}>
          滚到顶部
        </Button>
        <Button size="small" onClick={scrollToBottom}>
          滚到底部
        </Button>
      </Flex>
    </Flex>
  );
};

const UseScrollElementExample = () => {
  const scrollRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Card size="small">
        <Typography.Paragraph type="secondary" style={{margin: 0}}>
          useScrollElement 返回滚动容器 getter，适用于虚拟列表、锚点导航、滚动同步等场景。
        </Typography.Paragraph>
      </Card>
      <div
        ref={scrollRef}
        style={{
          height: 200,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12,
          background: '#fafafa'
        }}
      >
        <ResponsiveProvider scrollRef={scrollRef}>
          <ScrollMonitor />
          <div style={{height: 400, marginTop: 16}}>
            {Array.from({length: 8}, (_, i) => (
              <Card key={i} size="small" style={{marginBottom: 8}}>
                审批单 #{10086 + i} — 差旅报销 · 待部门经理审批
              </Card>
            ))}
          </div>
        </ResponsiveProvider>
      </div>
    </Flex>
  );
};

render(<UseScrollElementExample />);

```

- DOM 工具
- findScrollParent、resolveBoundaryElement、resolveScrollElement 等底层解析
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
const {
  findScrollParent,
  resolveBoundaryElement,
  resolveScrollElement,
  getDefaultScrollElement,
  getDefaultBoundaryElement
} = _ResponsiveUtils;
const {Button, Card, Descriptions, Flex, Typography} = antd;
const {useRef, useState} = React;

const DomUtilsExample = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);
  const [result, setResult] = useState(null);

  const inspect = () => {
    const anchor = innerRef.current;
    const scrollParent = findScrollParent(anchor);
    setResult({
      scrollParent: scrollParent ? scrollParent.className || scrollParent.tagName : 'null',
      resolvedBoundary: resolveBoundaryElement(boundaryRef).className || 'body',
      resolvedScroll: resolveScrollElement(scrollRef, anchor).className || 'documentElement',
      defaultBoundary: getDefaultBoundaryElement().tagName,
      defaultScroll: getDefaultScrollElement().tagName
    });
  };

  return (
    <Flex vertical gap={16}>
      <div
        ref={outerRef}
        className="dom-utils-outer"
        style={{overflow: 'auto', height: 220, border: '1px solid #d9d9d9', borderRadius: 8, padding: 12}}
      >
        <Typography.Text type="secondary">外层可滚动容器 (.dom-utils-outer)</Typography.Text>
        <div style={{height: 120}} />
        <div
          ref={boundaryRef}
          className="dom-utils-boundary"
          style={{border: '1px dashed #91caff', padding: 12, borderRadius: 6, background: '#f0f5ff'}}
        >
          <div
            ref={scrollRef}
            className="dom-utils-scroll"
            style={{height: 100, overflow: 'auto', background: '#fff', padding: 8}}
          >
            <div ref={innerRef} className="dom-utils-anchor" style={{height: 200, paddingTop: 60}}>
              <Typography.Text>锚点元素 (.dom-utils-anchor)</Typography.Text>
            </div>
          </div>
        </div>
      </div>
      <Button type="primary" onClick={inspect}>
        解析 DOM
      </Button>
      {result && (
        <Card size="small" title="解析结果">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="findScrollParent(anchor)">{result.scrollParent}</Descriptions.Item>
            <Descriptions.Item label="resolveBoundaryElement(boundaryRef)">
              {result.resolvedBoundary}
            </Descriptions.Item>
            <Descriptions.Item label="resolveScrollElement(scrollRef, anchor)">
              {result.resolvedScroll}
            </Descriptions.Item>
            <Descriptions.Item label="getDefaultBoundaryElement()">{result.defaultBoundary}</Descriptions.Item>
            <Descriptions.Item label="getDefaultScrollElement()">{result.defaultScroll}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Flex>
  );
};

render(<DomUtilsExample />);

```

### API

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

**宿主元素**（如 example-driver 的 `.example-driver-preview-content`）：

```scss
@use '@kne/responsive-utils/scss' as resp;

.preview-host {
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
