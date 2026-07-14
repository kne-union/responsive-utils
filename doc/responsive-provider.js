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
