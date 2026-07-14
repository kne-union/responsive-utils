# responsive-utils

### 描述

Unified responsive breakpoints, hooks, popup boundary and scroll context for KNE projects.

### 安装

```shell
npm i --save @kne/responsive-utils
```

### 概述

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


### 示例(全屏)

#### 示例样式

```scss
/* 示例公用样式：仅用于文档演示，业务项目请按自身设计体系实现 */

.resp-doc-tip {
  margin-bottom: 12px;
}

.resp-doc-frame {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
}

.resp-doc-frame-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.resp-doc-layout {
  display: flex;
  min-height: 220px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.resp-doc-sidebar {
  width: 180px;
  flex-shrink: 0;
  padding: 12px;
  background: #001529;
  color: #fff;
}

.resp-doc-sidebar.is-collapsed {
  width: 56px;
}

.resp-doc-main {
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
}

.resp-doc-overflow {
  position: relative;
  overflow: hidden;
  border: 2px solid #ffa39e;
  border-radius: 8px;
  padding: 16px;
  background: #fff2f0;
}

.resp-doc-phone {
  position: relative;
  margin: 0 auto;
  border: 8px solid #1f1f1f;
  border-radius: 24px;
  overflow: hidden;
  background: #f5f5f5;
  box-sizing: content-box;
}

.resp-doc-code-block {
  margin: 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
```

#### 示例代码

- 快速入门
- 推荐最小接入：目标类名 + ResponsiveProvider + useIsMobile + usePopupContainer
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * 快速入门：一条业务页最小接入模板
 *
 * 1. 用目标类名标记 boundary / scroll
 * 2. 最外层包 ResponsiveProvider（多数场景可省略，靠类名兜底）
 * 3. 布局用 useIsMobile，浮层用 usePopupContainer
 */
const {
  ResponsiveProvider,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  MOBILE_BREAKPOINT,
  BREAKPOINTS,
  useIsMobile,
  usePopupContainer
} = _ResponsiveUtils;
const {Alert, Card, DatePicker, Flex, Form, Select, Space, Tag, Typography} = antd;

const DEPARTMENT_OPTIONS = [
  {label: '研发中心 / 前端组', value: 'fe'},
  {label: '研发中心 / 后端组', value: 'be'},
  {label: '产品中心 / 用户研究', value: 'research'},
  {label: '运营中心 / 增长运营', value: 'growth'}
];

/** 业务组件：只关心「移动还是桌面」「浮层挂到哪」 */
const StaffFilterForm = () => {
  const isMobile = useIsMobile();
  const getPopupContainer = usePopupContainer();

  return (
    <Card
      size="small"
      title={
        <Space>
          <span>员工筛选</span>
          <Tag color={isMobile ? 'orange' : 'blue'}>{isMobile ? '移动布局' : '桌面布局'}</Tag>
        </Space>
      }
    >
      <Form layout={isMobile ? 'vertical' : 'inline'}>
        <Form.Item label="所属部门" name="dept" style={isMobile ? undefined : {marginBottom: 0}}>
          <Select
            allowClear
            placeholder="选择部门"
            options={DEPARTMENT_OPTIONS}
            style={{width: isMobile ? '100%' : 220}}
            getPopupContainer={getPopupContainer}
          />
        </Form.Item>
        <Form.Item label="入职日期" name="joinDate" style={isMobile ? undefined : {marginBottom: 0}}>
          <DatePicker
            style={{width: isMobile ? '100%' : 180}}
            getPopupContainer={getPopupContainer}
            placeholder="选择日期"
          />
        </Form.Item>
      </Form>
      <Typography.Paragraph type="secondary" style={{marginTop: 12, marginBottom: 0}}>
        缩小浏览器窗口（或使用下方「容器模式」相关 Demo），观察表单布局与下拉挂载是否跟随移动端切换。
      </Typography.Paragraph>
    </Card>
  );
};

const BaseExample = () => {
  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="本页是推荐最小接入模板"
        description={
          <span>
            阈值 <Typography.Text code>{MOBILE_BREAKPOINT}px</Typography.Text>（即{' '}
            <Typography.Text code>BREAKPOINTS.md = {BREAKPOINTS.md}</Typography.Text>
            ）。标记{' '}
            <Typography.Text code>{RESPONSIVE_BOUNDARY_CLASS}</Typography.Text> /{' '}
            <Typography.Text code>{RESPONSIVE_SCROLL_CLASS}</Typography.Text>
            后，Hook 会自动解析边界与滚动根。
          </span>
        }
      />

      <pre
        style={{
          margin: 0,
          padding: 12,
          background: '#fafafa',
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}
      >{&#96;import {
  ResponsiveProvider,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  useIsMobile,
  usePopupContainer
} from '@kne/responsive-utils';

<div className={RESPONSIVE_BOUNDARY_CLASS} style={{ position: 'relative' }}>
  <div className={RESPONSIVE_SCROLL_CLASS} style={{ overflow: 'auto', height: '100%' }}>
    <ResponsiveProvider>
      <YourPage />
    </ResponsiveProvider>
  </div>
</div>&#96;}</pre>

      <div
        className={RESPONSIVE_BOUNDARY_CLASS}
        style={{
          position: 'relative',
          border: '1px dashed #91caff',
          borderRadius: 8,
          overflow: 'hidden',
          background: '#f0f5ff'
        }}
      >
        <Typography.Text type="secondary" style={{display: 'block', padding: '8px 12px 0'}}>
          .{RESPONSIVE_BOUNDARY_CLASS}（弹层边界）
        </Typography.Text>
        <div
          className={RESPONSIVE_SCROLL_CLASS}
          style={{maxHeight: 360, overflow: 'auto', padding: 12}}
        >
          <ResponsiveProvider>
            <StaffFilterForm />
            <Card size="small" style={{marginTop: 12}} title="列表占位">
              {['张三 · 前端工程师', '李四 · 产品经理', '王五 · 运营专员'].map(item => (
                <div key={item} style={{padding: '8px 0', borderBottom: '1px solid #f0f0f0'}}>
                  {item}
                </div>
              ))}
            </Card>
          </ResponsiveProvider>
        </div>
      </div>
    </Flex>
  );
};

render(<BaseExample />);

```

- ResponsiveProvider
- viewport / container 模式、boundaryRef / scrollRef，以及与目标类名的配合
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * ResponsiveProvider：注入响应式上下文
 *
 * - viewport：跟浏览器窗口走（默认）
 * - container：跟 containerWidth 走（嵌入式布局 / 按指定宽度模拟）
 * - boundaryRef / scrollRef：显式指定挂载边界与滚动根（优先级高于类名查找）
 */
const {
  ResponsiveProvider,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  useIsMobile,
  usePopupContainer,
  useScrollElement,
  useResponsiveContext
} = _ResponsiveUtils;
const {Alert, Card, DatePicker, Flex, InputNumber, Select, Space, Switch, Tag, Typography} = antd;
const {useEffect, useRef, useState} = React;

const DEVICE_PRESETS = [
  {label: 'iPhone SE · 375', value: 375},
  {label: '临界 · 768', value: 768},
  {label: 'iPad · 1024', value: 1024},
  {label: '桌面 · 1440', value: 1440}
];

const LivePanel = () => {
  const isMobile = useIsMobile();
  const {mode, containerWidth} = useResponsiveContext();
  const getPopupContainer = usePopupContainer();
  const getScrollElement = useScrollElement();
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = getScrollElement();
    if (!el) return undefined;
    const onScroll = () => setScrollTop(Math.round(el.scrollTop || 0));
    el.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [getScrollElement]);

  return (
    <Flex vertical gap={12}>
      <Space wrap>
        <Tag>mode={mode}</Tag>
        {mode === 'container' && <Tag color="purple">containerWidth={containerWidth}px</Tag>}
        <Tag color={isMobile ? 'orange' : 'blue'}>isMobile={String(isMobile)}</Tag>
        <Tag>scrollTop={scrollTop}px</Tag>
      </Space>
      <Select
        style={{width: '100%'}}
        placeholder="选择汇报线部门"
        getPopupContainer={getPopupContainer}
        options={[
          {label: '华北区', value: 'north'},
          {label: '华东区', value: 'east'},
          {label: '华南区', value: 'south'}
        ]}
      />
      <DatePicker style={{width: '100%'}} getPopupContainer={getPopupContainer} placeholder="生效日" />
      <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
        在下方滚动区滑动，观察 scrollTop；切换模式 / 宽度观察 isMobile 是否变化。
      </Typography.Paragraph>
      {Array.from({length: 6}, (_, i) => (
        <Card key={i} size="small" type="inner">
          审批记录 #{2024001 + i} · 差旅报销
        </Card>
      ))}
    </Flex>
  );
};

const ResponsiveProviderExample = () => {
  const [containerMode, setContainerMode] = useState(true);
  const [containerWidth, setContainerWidth] = useState(375);
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="什么时候用哪种 mode？"
        description={
          <ul style={{margin: 0, paddingLeft: 18}}>
            <li>
              <Typography.Text code>viewport</Typography.Text>：跟{' '}
              <Typography.Text code>window</Typography.Text> 宽度走（默认）
            </li>
            <li>
              <Typography.Text code>container</Typography.Text>：跟指定的{' '}
              <Typography.Text code>containerWidth</Typography.Text> 走，适合嵌入式区域或本地模拟宽度
            </li>
          </ul>
        }
      />

      <Card size="small" title="控制台">
        <Flex gap={16} align="center" wrap="wrap">
          <Space>
            <Typography.Text>容器模式</Typography.Text>
            <Switch checked={containerMode} onChange={setContainerMode} />
          </Space>
          {containerMode && (
            <Space wrap>
              <Typography.Text>模拟宽度</Typography.Text>
              <InputNumber
                min={320}
                max={1600}
                value={containerWidth}
                onChange={v => setContainerWidth(v || 375)}
                addonAfter="px"
              />
              <Select
                style={{width: 180}}
                value={containerWidth}
                onChange={setContainerWidth}
                options={DEVICE_PRESETS}
              />
            </Space>
          )}
        </Flex>
      </Card>

      <div
        ref={boundaryRef}
        className={RESPONSIVE_BOUNDARY_CLASS}
        style={{
          position: 'relative',
          border: '1px dashed #91caff',
          borderRadius: 8,
          padding: 12,
          background: '#f0f5ff'
        }}
      >
        <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
          boundaryRef + .{RESPONSIVE_BOUNDARY_CLASS}（浮层挂到这里）
        </Typography.Text>
        <div
          ref={scrollRef}
          className={RESPONSIVE_SCROLL_CLASS}
          style={{
            height: 240,
            overflow: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            padding: 12,
            background: '#fff'
          }}
        >
          <ResponsiveProvider
            mode={containerMode ? 'container' : 'viewport'}
            containerWidth={containerMode ? containerWidth : undefined}
            boundaryRef={boundaryRef}
            scrollRef={scrollRef}
          >
            <LivePanel />
          </ResponsiveProvider>
        </div>
      </div>

      <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
        也可只写类名、不传 ref：Provider 会通过{' '}
        <Typography.Text code>findResponsiveBoundary</Typography.Text> /{' '}
        <Typography.Text code>findResponsiveScroll</Typography.Text> 向上查找。见「目标类名」示例。
      </Typography.Paragraph>
    </Flex>
  );
};

render(<ResponsiveProviderExample />);

```

- 目标类名
- RESPONSIVE_CONTAINER / BOUNDARY / SCROLL 三类约定，以及 findResponsive* 解析
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * 目标类名：推荐的页面结构约定
 *
 * 在布局根节点打上这三个类后，Provider / Hooks 可自动解析，无需层层传 ref。
 * Global、system-layout 等布局容器均按同一约定接线。
 */
const {
  ResponsiveProvider,
  RESPONSIVE_CONTAINER_CLASS,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  findResponsiveBoundary,
  findResponsiveScroll,
  useIsMobile,
  usePopupContainer
} = _ResponsiveUtils;
const {Alert, Button, Card, Descriptions, Flex, Select, Space, Tag, Typography} = antd;
const {useRef, useState} = React;

const Probe = () => {
  const isMobile = useIsMobile();
  const getPopupContainer = usePopupContainer();
  const anchorRef = useRef(null);
  const [result, setResult] = useState(null);

  const inspect = () => {
    const anchor = anchorRef.current;
    const boundary = findResponsiveBoundary(anchor);
    const scroll = findResponsiveScroll(anchor);
    const popup = getPopupContainer();
    setResult({
      isMobile,
      boundary: boundary ? &#96;.${boundary.className.split(' ').filter(Boolean).join('.')}&#96; : 'null',
      scroll: scroll ? &#96;.${scroll.className.split(' ').filter(Boolean).join('.')}&#96; : 'null',
      popup: popup === document.body ? 'document.body' : popup?.className || popup?.tagName
    });
  };

  return (
    <Flex vertical gap={12}>
      <Space wrap>
        <Tag color={isMobile ? 'orange' : 'blue'}>useIsMobile → {String(isMobile)}</Tag>
        <span ref={anchorRef} />
        <Button type="primary" onClick={inspect}>
          从当前锚点解析 boundary / scroll
        </Button>
      </Space>
      <Select
        style={{width: '100%'}}
        placeholder="下拉会挂到 boundary"
        getPopupContainer={getPopupContainer}
        options={[
          {label: '招聘需求', value: 'req'},
          {label: '候选人', value: 'cand'},
          {label: 'offer 审批', value: 'offer'}
        ]}
      />
      {result && (
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="findResponsiveBoundary">{result.boundary}</Descriptions.Item>
          <Descriptions.Item label="findResponsiveScroll">{result.scroll}</Descriptions.Item>
          <Descriptions.Item label="usePopupContainer()">{result.popup}</Descriptions.Item>
        </Descriptions>
      )}
    </Flex>
  );
};

const TargetClassesExample = () => {
  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="三个类名各管一件事"
        description={
          <Descriptions size="small" column={1} style={{marginTop: 8}}>
            <Descriptions.Item label={RESPONSIVE_CONTAINER_CLASS}>
              容器查询宿主（配合 SCSS <Typography.Text code>@include resp.responsive-container</Typography.Text>
              ）
            </Descriptions.Item>
            <Descriptions.Item label={RESPONSIVE_BOUNDARY_CLASS}>
              弹层挂载边界（Select / DatePicker / Modal）
            </Descriptions.Item>
            <Descriptions.Item label={RESPONSIVE_SCROLL_CLASS}>
              滚动参照（Affix、BackTop、虚拟列表、锚点）
            </Descriptions.Item>
          </Descriptions>
        }
      />

      <pre
        style={{
          margin: 0,
          padding: 12,
          background: '#fafafa',
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}
      >{&#96;<div className={RESPONSIVE_CONTAINER_CLASS}>
  <div className={RESPONSIVE_BOUNDARY_CLASS} style={{ position: 'relative' }}>
    <div className={RESPONSIVE_SCROLL_CLASS} style={{ overflow: 'auto', height: '100%' }}>
      <ResponsiveProvider>{children}</ResponsiveProvider>
    </div>
  </div>
</div>&#96;}</pre>

      <div
        className={RESPONSIVE_CONTAINER_CLASS}
        style={{border: '1px solid #b7eb8f', borderRadius: 8, padding: 8, background: '#f6ffed'}}
      >
        <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
          .{RESPONSIVE_CONTAINER_CLASS}
        </Typography.Text>
        <div
          className={RESPONSIVE_BOUNDARY_CLASS}
          style={{
            position: 'relative',
            border: '1px dashed #91caff',
            borderRadius: 8,
            padding: 8,
            background: '#f0f5ff'
          }}
        >
          <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
            .{RESPONSIVE_BOUNDARY_CLASS}
          </Typography.Text>
          <div
            className={RESPONSIVE_SCROLL_CLASS}
            style={{
              height: 200,
              overflow: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: 12,
              background: '#fff'
            }}
          >
            <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
              .{RESPONSIVE_SCROLL_CLASS}
            </Typography.Text>
            <ResponsiveProvider>
              <Probe />
              <div style={{height: 160}} />
            </ResponsiveProvider>
          </div>
        </div>
      </div>

      <Card size="small">
        <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
          传 <Typography.Text code>boundaryRef</Typography.Text> /{' '}
          <Typography.Text code>scrollRef</Typography.Text> 时以 ref 为准；没传则按类名从触发器向上找，再回退{' '}
          <Typography.Text code>body</Typography.Text> / 文档滚动根。
        </Typography.Paragraph>
      </Card>
    </Flex>
  );
};

render(<TargetClassesExample />);

```

- useIsMobile
- 按 768px 切换布局：侧栏、订单列表卡片化、容器宽度模拟
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * useIsMobile：宽度 < 768 时为 true
 *
 * 典型用途：侧栏折叠、表格⇄卡片、底部操作栏、表单 vertical/inline
 * container 模式下看 containerWidth，不看浏览器视口
 */
const {ResponsiveProvider, MOBILE_BREAKPOINT, useIsMobile} = _ResponsiveUtils;
const {Alert, Card, Col, Flex, InputNumber, Radio, Row, Space, Tag, Typography} = antd;
const {useState} = React;

const ORDERS = [
  {id: 'ORD-20240701-001', customer: '华东分公司', amount: '¥12,800', status: '待发货'},
  {id: 'ORD-20240701-002', customer: '华南渠道部', amount: '¥6,420', status: '已发货'},
  {id: 'ORD-20240701-003', customer: '华北直客', amount: '¥28,100', status: '待审核'}
];

const OrderBoard = () => {
  const isMobile = useIsMobile();

  return (
    <Card
      size="small"
      title={
        <Space>
          <span>订单列表</span>
          <Tag color={isMobile ? 'orange' : 'geekblue'}>
            {isMobile ? '卡片列表' : '三列栅格'}
          </Tag>
        </Space>
      }
      extra={
        isMobile ? (
          <Typography.Link>筛选</Typography.Link>
        ) : (
          <Space>
            <Typography.Link>导出</Typography.Link>
            <Typography.Link>批量发货</Typography.Link>
          </Space>
        )
      }
    >
      {isMobile ? (
        <Flex vertical gap={8}>
          {ORDERS.map(item => (
            <Card key={item.id} size="small" type="inner">
              <Flex justify="space-between">
                <Typography.Text strong>{item.id}</Typography.Text>
                <Tag>{item.status}</Tag>
              </Flex>
              <Typography.Text type="secondary">
                {item.customer} · {item.amount}
              </Typography.Text>
            </Card>
          ))}
        </Flex>
      ) : (
        <Row gutter={[12, 12]}>
          {ORDERS.map(item => (
            <Col key={item.id} span={8}>
              <Card size="small">
                <Typography.Text strong>{item.id}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  {item.customer} · {item.amount}
                </Typography.Text>
                <br />
                <Tag style={{marginTop: 8}}>{item.status}</Tag>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};

const Shell = ({children}) => {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        display: 'flex',
        minHeight: 280,
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      {!isMobile && (
        <div style={{width: 160, padding: 12, background: '#001529', color: 'rgba(255,255,255,0.85)'}}>
          <Typography.Text style={{color: '#fff'}} strong>
            导航
          </Typography.Text>
          <div style={{marginTop: 12, fontSize: 13}}>订单</div>
          <div style={{marginTop: 8, fontSize: 13, opacity: 0.65}}>客户</div>
          <div style={{marginTop: 8, fontSize: 13, opacity: 0.65}}>库存</div>
        </div>
      )}
      <div style={{flex: 1, padding: 12, background: '#fafafa'}}>
        {isMobile && (
          <Alert
            style={{marginBottom: 12}}
            type="warning"
            showIcon
            message="移动端：侧栏收起，改用顶部「筛选」入口"
          />
        )}
        {children}
      </div>
    </div>
  );
};

const UseIsMobileExample = () => {
  const viewportIsMobile = useIsMobile();
  const [source, setSource] = useState('viewport');
  const [containerWidth, setContainerWidth] = useState(414);

  const board = (
    <Shell>
      <OrderBoard />
    </Shell>
  );

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message={&#96;阈值：宽度 < ${MOBILE_BREAKPOINT}px → isMobile === true&#96;}
        description="业务里优先用本 Hook，不要自己 matchMedia('(max-width: 768px)')。"
      />

      <Card size="small" title="数据源">
        <Radio.Group
          optionType="button"
          value={source}
          onChange={e => setSource(e.target.value)}
          options={[
            {label: '视口（当前浏览器）', value: 'viewport'},
            {label: '容器模拟宽度', value: 'container'}
          ]}
        />
        <div style={{marginTop: 12}}>
          <Typography.Text type="secondary">
            视口判定：{' '}
            <Tag color={viewportIsMobile ? 'orange' : 'blue'}>{String(viewportIsMobile)}</Tag>
            （改变浏览器宽度即可验证）
          </Typography.Text>
        </div>
        {source === 'container' && (
          <Space style={{marginTop: 12}} wrap>
            <Typography.Text>模拟宽度</Typography.Text>
            <InputNumber
              min={320}
              max={1200}
              value={containerWidth}
              onChange={v => setContainerWidth(v || 414)}
              addonAfter="px"
            />
            <Radio.Group
              value={containerWidth}
              onChange={e => setContainerWidth(e.target.value)}
              options={[
                {label: '375', value: 375},
                {label: '767', value: 767},
                {label: '768', value: 768},
                {label: '1024', value: 1024}
              ]}
            />
          </Space>
        )}
      </Card>

      {source === 'container' ? (
        <div style={{width: Math.min(containerWidth, 640), maxWidth: '100%'}}>
          <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
            ResponsiveProvider mode=&quot;container&quot; containerWidth={containerWidth}
          </Typography.Text>
          <ResponsiveProvider mode="container" containerWidth={containerWidth}>
            {board}
          </ResponsiveProvider>
        </div>
      ) : (
        board
      )}
    </Flex>
  );
};

render(<UseIsMobileExample />);

```

- useBreakpoint
- xs~xxl 命中状态驱动表格列、侧栏宽度与栅格
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * useBreakpoint：返回 xs~xxl 是否「达到」该宽度，以及 isMobile
 *
 * 适合比「是否移动端」更细的栅格 / 侧栏 / 表格列显隐
 * 判定语义：width >= BREAKPOINTS[key]
 */
const {BREAKPOINTS, ResponsiveProvider, useBreakpoint} = _ResponsiveUtils;
const {Alert, Card, Col, Flex, Radio, Row, Space, Table, Tag, Typography} = antd;
const {useMemo, useState} = React;

const BREAKPOINT_META = [
  {key: 'xs', label: '超小屏', hint: '手机竖屏起步'},
  {key: 'sm', label: '小屏', hint: '手机横屏 / 小平板'},
  {key: 'md', label: '中屏', hint: '平板；移动端阈值'},
  {key: 'lg', label: '大屏', hint: '桌面'},
  {key: 'xl', label: '超大屏', hint: '宽屏桌面'},
  {key: 'xxl', label: '巨屏', hint: '超宽 / 4K'}
];

const STAFF = [
  {key: '1', name: '陈晓', dept: '研发中心', city: '上海', role: '前端', phone: '138****1201'},
  {key: '2', name: '林舟', dept: '产品中心', city: '北京', role: '产品', phone: '139****8830'},
  {key: '3', name: '周宁', dept: '运营中心', city: '深圳', role: '运营', phone: '137****4412'}
];

const StaffTable = () => {
  const bp = useBreakpoint();

  const columns = useMemo(() => {
    const cols = [
      {title: '姓名', dataIndex: 'name'},
      {title: '部门', dataIndex: 'dept'}
    ];
    if (bp.md) cols.push({title: '城市', dataIndex: 'city'});
    if (bp.lg) cols.push({title: '岗位', dataIndex: 'role'});
    if (bp.xl) cols.push({title: '手机', dataIndex: 'phone'});
    return cols;
  }, [bp.md, bp.lg, bp.xl]);

  const gutter = bp.xxl ? 24 : bp.lg ? 16 : 8;
  const siderWidth = bp.isMobile ? 0 : bp.xl ? 220 : bp.lg ? 180 : 140;

  return (
    <Flex vertical gap={12}>
      <Space wrap>
        <Tag color={bp.isMobile ? 'orange' : 'blue'}>isMobile={String(bp.isMobile)}</Tag>
        <Tag>可见列数 {columns.length}</Tag>
        <Tag>栅格 gutter {gutter}</Tag>
        {!bp.isMobile && <Tag>侧栏 {siderWidth}px</Tag>}
      </Space>
      <div style={{display: 'flex', gap: gutter, border: '1px solid #f0f0f0', borderRadius: 8}}>
        {!bp.isMobile && (
          <div
            style={{
              width: siderWidth,
              padding: 12,
              background: '#001529',
              color: '#fff',
              borderRadius: '8px 0 0 8px'
            }}
          >
            组织树
            <div style={{marginTop: 8, opacity: 0.7, fontSize: 12}}>研发中心</div>
            <div style={{marginTop: 4, opacity: 0.7, fontSize: 12}}>产品中心</div>
          </div>
        )}
        <div style={{flex: 1, padding: 12}}>
          <Table size="small" pagination={false} columns={columns} dataSource={STAFF} />
          <Row gutter={[gutter, gutter]} style={{marginTop: 12}}>
            {['在职', '试用', '待入职'].map(label => (
              <Col key={label} span={bp.lg ? 8 : bp.md ? 12 : 24}>
                <Card size="small">{label}统计卡</Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Flex>
  );
};

const HitList = () => {
  const bp = useBreakpoint();
  return (
    <Flex vertical gap={8}>
      {BREAKPOINT_META.map(({key, label, hint}) => (
        <Flex key={key} justify="space-between" align="center">
          <Space>
            <Tag color={bp[key] ? 'processing' : 'default'}>{key}</Tag>
            <Typography.Text>
              {label}（≥{BREAKPOINTS[key]}px）
            </Typography.Text>
            <Typography.Text type="secondary">{hint}</Typography.Text>
          </Space>
          <Tag color={bp[key] ? 'success' : 'default'}>{bp[key] ? '命中' : '未达'}</Tag>
        </Flex>
      ))}
    </Flex>
  );
};

const UseBreakpointExample = () => {
  const [mode, setMode] = useState('viewport');
  const [width, setWidth] = useState(1024);

  const content = (
    <Flex vertical gap={16}>
      <Card size="small" title="断点命中（≥ 阈值）">
        <HitList />
      </Card>
      <Card size="small" title="业务用法：表格列 + 侧栏 + 栅格随断点变化">
        <StaffTable />
      </Card>
    </Flex>
  );

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="useBreakpoint 比 useIsMobile 更细"
        description="只判断移动端用 useIsMobile；需要「lg 才显示手机列」这类逻辑时用本 Hook。"
      />
      <Radio.Group
        optionType="button"
        value={mode}
        onChange={e => setMode(e.target.value)}
        options={[
          {label: '跟视口', value: 'viewport'},
          {label: '模拟宽度', value: 'container'}
        ]}
      />
      {mode === 'container' && (
        <Radio.Group
          value={width}
          onChange={e => setWidth(e.target.value)}
          options={[
            {label: '375 xs', value: 375},
            {label: '600 sm', value: 600},
            {label: '800 md', value: 800},
            {label: '1100 lg', value: 1100},
            {label: '1300 xl', value: 1300},
            {label: '1700 xxl', value: 1700}
          ]}
        />
      )}
      {mode === 'container' ? (
        <ResponsiveProvider mode="container" containerWidth={width}>
          {content}
        </ResponsiveProvider>
      ) : (
        content
      )}
    </Flex>
  );
};

render(<UseBreakpointExample />);

```

- useMediaQuery
- 订阅任意 media query；container 下 max-width 映射到 getIsMobile
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * useMediaQuery：订阅任意 CSS media query
 *
 * - 视口模式：标准 matchMedia
 * - container 模式：含 max-width 的 query 会映射到 Provider.getIsMobile()
 */
const {ResponsiveProvider, IS_MOBILE_QUERY, useIsMobile, useMediaQuery} = _ResponsiveUtils;
const {Alert, Card, Flex, InputNumber, Space, Switch, Tag, Typography} = antd;
const {useState} = React;

const QUERIES = [
  {label: '官方移动端 query', query: IS_MOBILE_QUERY, note: '与 useIsMobile 同源'},
  {label: '紧凑布局', query: '(max-width: 576px)', note: '可驱动更窄的表单间距'},
  {label: '宽屏工作台', query: '(min-width: 1200px)', note: 'container 下 min-width 仍走真实视口'},
  {label: '横屏', query: '(orientation: landscape)', note: '设备方向'},
  {label: '深色偏好', query: '(prefers-color-scheme: dark)', note: '系统主题'}
];

const QueryRow = ({label, query, note}) => {
  const matches = useMediaQuery(query);
  return (
    <Flex justify="space-between" align="center" gap={12}>
      <div>
        <Typography.Text>{label}</Typography.Text>
        <br />
        <Typography.Text type="secondary" style={{fontSize: 12}} code>
          {query}
        </Typography.Text>
        {note && (
          <>
            <br />
            <Typography.Text type="secondary" style={{fontSize: 12}}>
              {note}
            </Typography.Text>
          </>
        )}
      </div>
      <Tag color={matches ? 'success' : 'default'}>{matches ? '匹配' : '不匹配'}</Tag>
    </Flex>
  );
};

const Panel = () => {
  const isMobile = useIsMobile();
  return (
    <Flex vertical gap={12}>
      <Space>
        <Typography.Text>useIsMobile</Typography.Text>
        <Tag color={isMobile ? 'orange' : 'blue'}>{String(isMobile)}</Tag>
      </Space>
      {QUERIES.map(item => (
        <Card key={item.query} size="small">
          <QueryRow {...item} />
        </Card>
      ))}
    </Flex>
  );
};

const UseMediaQueryExample = () => {
  const [containerMode, setContainerMode] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="何时用 useMediaQuery？"
        description="只要「是不是移动端」→ useIsMobile；任意 query / 方向 / 配色偏好 → 用本 Hook。"
      />

      <Card size="small" title="运行环境">
        <Space wrap>
          <Typography.Text>容器模式</Typography.Text>
          <Switch checked={containerMode} onChange={setContainerMode} />
          {containerMode && (
            <>
              <Typography.Text>containerWidth</Typography.Text>
              <InputNumber
                min={320}
                max={1600}
                value={containerWidth}
                onChange={v => setContainerWidth(v || 500)}
                addonAfter="px"
              />
            </>
          )}
        </Space>
        <Typography.Paragraph type="secondary" style={{marginTop: 12, marginBottom: 0}}>
          打开容器模式后，调节宽度观察含 <Typography.Text code>max-width</Typography.Text>{' '}
          的条目；其它 query（横屏、深色、min-width）仍跟随真实浏览器。
        </Typography.Paragraph>
      </Card>

      {containerMode ? (
        <ResponsiveProvider mode="container" containerWidth={containerWidth}>
          <Card size="small" title={&#96;容器 ${containerWidth}px&#96;}>
            <Panel />
          </Card>
        </ResponsiveProvider>
      ) : (
        <Card size="small" title="视口模式">
          <Panel />
        </Card>
      )}
    </Flex>
  );
};

render(<UseMediaQueryExample />);

```

- usePopupContainer
- 对比 overflow:hidden 下未挂载 / 已挂载 antd 浮层
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * usePopupContainer：给 antd 浮层一个不会被 overflow 裁剪的挂载点
 *
 * 对比：左侧未传 getPopupContainer（易被裁剪），右侧使用 Hook
 */
const {
  ResponsiveProvider,
  RESPONSIVE_BOUNDARY_CLASS,
  usePopupContainer,
  useIsMobile
} = _ResponsiveUtils;
const {Alert, Card, Col, DatePicker, Flex, Row, Select, Tooltip, Typography} = antd;
const {useRef} = React;

const DEPARTMENT_OPTIONS = [
  {label: '研发中心 / 前端组', value: 'fe'},
  {label: '研发中心 / 后端组', value: 'be'},
  {label: '产品中心 / 设计组', value: 'design'},
  {label: '运营中心 / 增长组', value: 'growth'}
];

const BrokenForm = () => (
  <Flex vertical gap={12}>
    <Typography.Text type="danger">未传 getPopupContainer —— 打开下拉看裁剪</Typography.Text>
    <Select style={{width: '100%'}} placeholder="选择部门" options={DEPARTMENT_OPTIONS} />
    <DatePicker style={{width: '100%'}} placeholder="合同日期" />
    <Tooltip title="这段提示在 overflow:hidden 下可能被裁掉">
      <Typography.Link>悬停 Tooltip</Typography.Link>
    </Tooltip>
  </Flex>
);

const FixedForm = () => {
  const getPopupContainer = usePopupContainer();
  const isMobile = useIsMobile();
  return (
    <Flex vertical gap={12}>
      <Typography.Text type="success">
        usePopupContainer() · 当前 {isMobile ? '移动端' : '桌面端'}
      </Typography.Text>
      <Select
        style={{width: '100%'}}
        placeholder="选择部门"
        options={DEPARTMENT_OPTIONS}
        getPopupContainer={getPopupContainer}
      />
      <DatePicker.RangePicker
        style={{width: '100%'}}
        getPopupContainer={getPopupContainer}
        placeholder={['开始', '结束']}
      />
      <Tooltip title="挂到 boundary 后完整可见" getPopupContainer={getPopupContainer}>
        <Typography.Link>悬停 Tooltip</Typography.Link>
      </Tooltip>
    </Flex>
  );
};

const UsePopupContainerExample = () => {
  const boundaryRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="用法一句话"
        description={
          <span>
            <Typography.Text code>const getPopupContainer = usePopupContainer();</Typography.Text>
            {' → '}
            传给 Select / DatePicker / Tooltip / Dropdown 的同名 prop。
          </span>
        }
      />

      <Row gutter={16}>
        <Col xs={24} md={12} style={{marginBottom: 16}}>
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              height: 220,
              border: '2px solid #ffa39e',
              borderRadius: 8,
              padding: 16,
              background: '#fff2f0'
            }}
          >
            <Card size="small" title="反例：会被裁剪">
              <BrokenForm />
            </Card>
          </div>
        </Col>
        <Col xs={24} md={12} style={{marginBottom: 16}}>
          <div
            ref={boundaryRef}
            className={RESPONSIVE_BOUNDARY_CLASS}
            style={{
              position: 'relative',
              overflow: 'hidden',
              height: 220,
              border: '2px solid #95de64',
              borderRadius: 8,
              padding: 16,
              background: '#f6ffed'
            }}
          >
            <ResponsiveProvider boundaryRef={boundaryRef}>
              <Card size="small" title="正例：挂到 boundary">
                <FixedForm />
              </Card>
            </ResponsiveProvider>
          </div>
        </Col>
      </Row>

      <Card size="small">
        <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
          页面根节点打上 <Typography.Text code>{RESPONSIVE_BOUNDARY_CLASS}</Typography.Text>{' '}
          后，多数情况不必再传 <Typography.Text code>boundaryRef</Typography.Text>
          。移动端全屏 Modal / 半屏请改用 <Typography.Text code>useMobilePopupMount</Typography.Text>。
        </Typography.Paragraph>
      </Card>
    </Flex>
  );
};

render(<UsePopupContainerExample />);

```

- useScrollElement
- 主内容区滚动监控、回顶与锚点跳转
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * useScrollElement：拿到真正的滚动根
 *
 * 后台常在「主内容区」滚，而不是 window。锚点、Affix、锁滚动、虚拟列表都需要这个 getter。
 */
const {
  ResponsiveProvider,
  RESPONSIVE_SCROLL_CLASS,
  useScrollElement
} = _ResponsiveUtils;
const {Alert, Button, Card, Flex, Space, Typography} = antd;
const {useEffect, useRef, useState} = React;

const APPROVALS = Array.from({length: 12}, (_, i) => ({
  id: 10086 + i,
  title: &#96;差旅报销单 #${10086 + i}&#96;,
  owner: ['陈晓', '林舟', '周宁'][i % 3],
  status: ['待部门经理', '待财务', '已通过'][i % 3]
}));

const ScrollToolbar = () => {
  const getScrollElement = useScrollElement();
  const [info, setInfo] = useState({scrollTop: 0, clientHeight: 0, scrollHeight: 0, tag: '-'});

  useEffect(() => {
    const el = getScrollElement();
    if (!el) return undefined;
    const update = () => {
      setInfo({
        scrollTop: Math.round(el.scrollTop || 0),
        clientHeight: el.clientHeight || 0,
        scrollHeight: el.scrollHeight || 0,
        tag: el.className || el.tagName
      });
    };
    update();
    el.addEventListener('scroll', update, {passive: true});
    return () => el.removeEventListener('scroll', update);
  }, [getScrollElement]);

  return (
    <Card size="small" title="滚动监控（业务组件内）" style={{position: 'sticky', top: 0, zIndex: 1}}>
      <Typography.Paragraph style={{marginBottom: 8}}>
        当前滚动根：<Typography.Text code>{info.tag}</Typography.Text>
      </Typography.Paragraph>
      <Typography.Text type="secondary">
        scrollTop {info.scrollTop} / 可视 {info.clientHeight} / 总高 {info.scrollHeight}
      </Typography.Text>
      <div style={{marginTop: 8}}>
        <Space>
          <Button
            size="small"
            onClick={() => getScrollElement()?.scrollTo({top: 0, behavior: 'smooth'})}
          >
            回顶
          </Button>
          <Button
            size="small"
            onClick={() => {
              const el = getScrollElement();
              el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
            }}
          >
            到底
          </Button>
          <Button
            size="small"
            onClick={() => {
              const el = getScrollElement();
              const target = el?.querySelector('[data-anchor="finance"]');
              target?.scrollIntoView({behavior: 'smooth', block: 'start'});
            }}
          >
            跳到「待财务」区块
          </Button>
        </Space>
      </div>
    </Card>
  );
};

const UseScrollElementExample = () => {
  const scrollRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="用法"
        description={
          <span>
            <Typography.Text code>const getScrollElement = useScrollElement();</Typography.Text>
            {' → '}
            <Typography.Text code>getScrollElement()</Typography.Text> 得到 HTMLElement，再监听 scroll /
            scrollTo / 量尺寸。
          </span>
        }
      />

      <div
        ref={scrollRef}
        className={RESPONSIVE_SCROLL_CLASS}
        style={{
          height: 280,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12,
          background: '#fafafa'
        }}
      >
        <ResponsiveProvider scrollRef={scrollRef}>
          <ScrollToolbar />
          <Flex vertical gap={8} style={{marginTop: 12}}>
            {APPROVALS.map(item => (
              <Card
                key={item.id}
                size="small"
                data-anchor={item.status === '待财务' ? 'finance' : undefined}
              >
                <Typography.Text strong>{item.title}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  {item.owner} · {item.status}
                </Typography.Text>
              </Card>
            ))}
          </Flex>
        </ResponsiveProvider>
      </div>

      <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
        也可只标 <Typography.Text code>{RESPONSIVE_SCROLL_CLASS}</Typography.Text>
        ，不传 scrollRef。打开弹层锁滚动等场景常与 <Typography.Text code>usePopupContainer</Typography.Text>{' '}
        一起用。
      </Typography.Paragraph>
    </Flex>
  );
};

render(<UseScrollElementExample />);

```

- useMobilePopupMount
- cover=boundary / viewport：对照 container 与 viewport 两种 Provider 模式下的挂载结果
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd),ReactDOM(react-dom)

```jsx
/**
 * useMobilePopupMount：移动端弹层一站式挂载
 *
 * 业务只选 cover：
 * - cover='boundary'（默认）：罩住 Provider boundary —— Modal 推荐
 * - cover='viewport'：罩住当前移动可视区 —— 半屏 Select / Sheet
 *     · mode=container → 挂 boundary + kne-is-boundary
 *     · mode=viewport 且移动端 → body + kne-is-viewport
 */
const {
  ResponsiveProvider,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  MOBILE_POPUP_MODE,
  MOBILE_POPUP_COVER,
  useMobilePopupMount,
  useResponsiveContext
} = _ResponsiveUtils;
const {Alert, Button, Card, Descriptions, Flex, Radio, Space, Tag, Typography} = antd;
const {useEffect, useMemo, useRef, useState} = React;
const {createPortal} = ReactDOM;

const PHONE_WIDTH = 375;
const PHONE_HEIGHT = 620;

const formatMount = node => {
  if (!node) return '-';
  if (node === document.body) return 'document.body';
  const cls = node.className || '';
  if (cls.includes(RESPONSIVE_BOUNDARY_CLASS)) return &#96;.${RESPONSIVE_BOUNDARY_CLASS}&#96;;
  return cls || node.tagName;
};

/** 演示弹层：按 fixedModeClass 切换 absolute / fixed */
const DemoOverlay = ({open, fixedModeClass, title, onClose, mountNode}) => {
  if (!open || !mountNode) return null;
  const useAbsolute = fixedModeClass === MOBILE_POPUP_MODE.boundary;
  const position = useAbsolute ? 'absolute' : 'fixed';

  return createPortal(
    <>
      <div
        className={fixedModeClass || undefined}
        style={{position, inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000}}
        onClick={onClose}
      />
      <div
        className={fixedModeClass || undefined}
        style={{
          position,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1001,
          background: '#fff',
          borderRadius: '12px 12px 0 0',
          padding: 16,
          boxShadow: '0 -6px 16px rgba(0,0,0,0.12)',
          maxHeight: '70%',
          overflow: 'auto'
        }}
      >
        <Flex justify="space-between" align="center" style={{marginBottom: 12}}>
          <Typography.Text strong>{title}</Typography.Text>
          <Button type="link" onClick={onClose}>
            关闭
          </Button>
        </Flex>
        <Typography.Paragraph type="secondary" style={{marginBottom: 8}}>
          fixedModeClass = <Typography.Text code>{fixedModeClass || 'null（桌面）'}</Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
          mount = <Typography.Text code>{formatMount(mountNode)}</Typography.Text>
        </Typography.Paragraph>
        <div style={{height: 100, marginTop: 12, background: '#f5f5f5', borderRadius: 8, padding: 12}}>
          组件侧 CSS：.kne-is-boundary 用 absolute；.kne-is-viewport 用 fixed。
        </div>
      </div>
    </>,
    mountNode
  );
};

const MountDemo = ({cover, title, tip}) => {
  const {mode} = useResponsiveContext();
  const {isMobile, fixedModeClass, getMountNode, getPopupContainer, anchorRef} = useMobilePopupMount({
    cover
  });
  const [open, setOpen] = useState(false);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (!open) {
      setMountNode(null);
      return;
    }
    const trigger = document.querySelector(&#96;[data-cover="${cover}"][data-mode="${mode}"]&#96;);
    setMountNode(getMountNode(trigger) || getPopupContainer(trigger));
  }, [open, cover, mode, getMountNode, getPopupContainer]);

  return (
    <Card
      size="small"
      title={title}
      extra={<Tag color={cover === 'viewport' ? 'blue' : 'green'}>cover={cover}</Tag>}
    >
      <Flex vertical gap={12}>
        <Typography.Text type="secondary">{tip}</Typography.Text>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Provider.mode">{mode}</Descriptions.Item>
          <Descriptions.Item label="isMobile">
            <Tag color={isMobile ? 'orange' : 'default'}>{String(isMobile)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="fixedModeClass">
            <Typography.Text code>{fixedModeClass || 'null'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="挂载节点">
            {open ? formatMount(mountNode) : '（打开后显示）'}
          </Descriptions.Item>
        </Descriptions>
        <div ref={anchorRef}>
          <Button
            data-cover={cover}
            data-mode={mode}
            type="primary"
            block
            onClick={() => setOpen(true)}
          >
            打开弹层
          </Button>
        </div>
        <DemoOverlay
          open={open}
          fixedModeClass={fixedModeClass}
          title={title}
          mountNode={mountNode}
          onClose={() => setOpen(false)}
        />
      </Flex>
    </Card>
  );
};

const ContainerModeDemo = () => {
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(PHONE_WIDTH);

  return (
    <Flex vertical gap={12}>
      <Alert
        showIcon
        type="info"
        message="场景 A：mode=container"
        description={
          <>
            按 <Typography.Text code>containerWidth</Typography.Text> 判定移动端。两种 cover
            都应挂在当前 boundary 内，class 为 <Typography.Text code>kne-is-boundary</Typography.Text>。
          </>
        }
      />
      <Radio.Group
        value={containerWidth}
        onChange={e => setContainerWidth(e.target.value)}
        options={[
          {label: '375 窄屏', value: 375},
          {label: '768 临界', value: 768},
          {label: '1024 宽屏', value: 1024}
        ]}
      />
      <div
        ref={boundaryRef}
        className={RESPONSIVE_BOUNDARY_CLASS}
        style={{
          position: 'relative',
          width: Math.min(containerWidth, PHONE_WIDTH + 48),
          height: PHONE_HEIGHT,
          margin: '0 auto',
          border: '1px solid #d9d9d9',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#f5f5f5',
          boxSizing: 'content-box'
        }}
      >
        <div
          ref={scrollRef}
          className={RESPONSIVE_SCROLL_CLASS}
          style={{height: '100%', overflow: 'auto', padding: 12, boxSizing: 'border-box'}}
        >
          <ResponsiveProvider
            mode="container"
            containerWidth={containerWidth}
            boundaryRef={boundaryRef}
            scrollRef={scrollRef}
          >
            <Flex vertical gap={12}>
              <MountDemo
                cover={MOBILE_POPUP_COVER.boundary}
                title="Modal · cover=boundary"
                tip="对话框默认选这个"
              />
              <MountDemo
                cover={MOBILE_POPUP_COVER.viewport}
                title="半屏 · cover=viewport"
                tip="container 模式下同样落在 boundary，不穿出滚动区"
              />
              <Card size="small">滚动后弹层仍相对本 boundary 铺满。</Card>
            </Flex>
          </ResponsiveProvider>
        </div>
      </div>
    </Flex>
  );
};

const ViewportModeDemo = () => {
  const boundaryRef = useRef(null);

  return (
    <Flex vertical gap={12}>
      <Alert
        showIcon
        type="warning"
        message="场景 B：mode=viewport"
        description={
          <>
            跟浏览器窗口宽度走。把窗口缩到 &lt;768px 后：
            <br />
            cover=boundary → 本区 boundary + kne-is-boundary
            <br />
            cover=viewport → document.body + kne-is-viewport
          </>
        }
      />
      <div
        ref={boundaryRef}
        className={RESPONSIVE_BOUNDARY_CLASS}
        style={{
          position: 'relative',
          border: '1px dashed #91caff',
          borderRadius: 8,
          padding: 12,
          background: '#f0f5ff',
          minHeight: 260
        }}
      >
        <ResponsiveProvider mode="viewport" boundaryRef={boundaryRef}>
          <Flex vertical gap={12}>
            <MountDemo
              cover={MOBILE_POPUP_COVER.boundary}
              title="Modal · cover=boundary"
              tip="挂当前 Provider boundary"
            />
            <MountDemo
              cover={MOBILE_POPUP_COVER.viewport}
              title="半屏 · cover=viewport"
              tip="窄屏时挂 body，用 fixed 罩住可视区"
            />
          </Flex>
        </ResponsiveProvider>
      </div>
    </Flex>
  );
};

const UseMobilePopupMountExample = () => {
  const [tab, setTab] = useState('container');

  const snippet = useMemo(
    () => &#96;// Modal
const { isMobile, getPopupContainer, fixedModeClass, anchorRef } = useMobilePopupMount();

// 半屏 Sheet / Select
const sheet = useMobilePopupMount({ cover: 'viewport' });

// Antd
<Modal getContainer={getPopupContainer} wrapClassName={fixedModeClass} />
<button ref={anchorRef}>打开</button>&#96;,
    []
  );

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="success"
        message="核心约定：业务只选 cover"
        description={
          <Space wrap style={{marginTop: 4}}>
            <Tag>{MOBILE_POPUP_MODE.boundary}</Tag>
            <Tag>{MOBILE_POPUP_MODE.viewport}</Tag>
          </Space>
        }
      />
      <pre
        style={{
          margin: 0,
          padding: 12,
          background: '#fafafa',
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}
      >
        {snippet}
      </pre>
      <Radio.Group
        value={tab}
        onChange={e => setTab(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        options={[
          {label: '① container 模式', value: 'container'},
          {label: '② viewport 模式', value: 'viewport'}
        ]}
      />
      {tab === 'container' ? <ContainerModeDemo /> : <ViewportModeDemo />}
    </Flex>
  );
};

render(<UseMobilePopupMountExample />);

```

- DOM 工具
- findScrollParent / findResponsive* / resolve* 等底层解析（优先用 Hooks）
- _ResponsiveUtils(@kne/current-lib_responsive-utils)[import * as _ResponsiveUtils from "@kne/responsive-utils"],antd(antd)

```jsx
/**
 * DOM 工具：无 React 上下文、或写底层封装时使用
 *
 * 业务组件优先用 Hooks；此处演示纯函数如何解析 boundary / scroll。
 */
const {
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  findScrollParent,
  findResponsiveBoundary,
  findResponsiveScroll,
  resolveBoundaryElement,
  resolveScrollElement,
  getDefaultBoundaryElement,
  getDefaultScrollElement
} = _ResponsiveUtils;
const {Alert, Button, Card, Descriptions, Flex, Typography} = antd;
const {useRef, useState} = React;

const DomUtilsExample = () => {
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);
  const anchorRef = useRef(null);
  const [result, setResult] = useState(null);

  const inspect = () => {
    const anchor = anchorRef.current;
    const scrollParent = findScrollParent(anchor);
    const byClassBoundary = findResponsiveBoundary(anchor);
    const byClassScroll = findResponsiveScroll(anchor);

    setResult({
      findScrollParent: scrollParent
        ? scrollParent.className || scrollParent.tagName
        : 'null（无可滚动祖先）',
      findResponsiveBoundary: byClassBoundary ? byClassBoundary.className : 'null',
      findResponsiveScroll: byClassScroll ? byClassScroll.className : 'null',
      resolveBoundaryElement: (() => {
        const el = resolveBoundaryElement(boundaryRef);
        return el === document.body ? 'document.body' : el.className || el.tagName;
      })(),
      resolveScrollElement: (() => {
        const el = resolveScrollElement(scrollRef, anchor);
        return el.className || el.tagName;
      })(),
      getDefaultBoundaryElement: getDefaultBoundaryElement().tagName,
      getDefaultScrollElement: getDefaultScrollElement().tagName
    });
  };

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="何时用 DOM 工具？"
        description="写底层组件、命令式 API、或暂时拿不到 Provider 时。日常页面请用 usePopupContainer / useScrollElement / useMobilePopupMount。"
      />

      <div
        style={{
          overflow: 'auto',
          height: 240,
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12
        }}
      >
        <Typography.Text type="secondary">外层 overflow:auto（findScrollParent 可能先命中它）</Typography.Text>
        <div style={{height: 40}} />
        <div
          ref={boundaryRef}
          className={RESPONSIVE_BOUNDARY_CLASS}
          style={{border: '1px dashed #91caff', borderRadius: 6, padding: 12, background: '#f0f5ff'}}
        >
          <div
            ref={scrollRef}
            className={RESPONSIVE_SCROLL_CLASS}
            style={{height: 120, overflow: 'auto', background: '#fff', padding: 8}}
          >
            <div ref={anchorRef} style={{height: 200, paddingTop: 48}}>
              <Typography.Text>锚点元素 — 点下方按钮解析</Typography.Text>
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
            {Object.entries(result).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                <Typography.Text code>{value}</Typography.Text>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}

      <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
        <Typography.Text code>resolveBoundaryElement(ref)</Typography.Text> 优先 ref，否则{' '}
        <Typography.Text code>body</Typography.Text>；
        <Typography.Text code>resolveScrollElement(ref, anchor)</Typography.Text> 优先 ref，否则从
        anchor 找可滚父级 / 文档滚动根。
      </Typography.Paragraph>
    </Flex>
  );
};

render(<DomUtilsExample />);

```

### API

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
