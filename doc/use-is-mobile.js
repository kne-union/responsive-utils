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
