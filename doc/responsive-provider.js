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
