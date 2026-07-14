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
        message={`阈值：宽度 < ${MOBILE_BREAKPOINT}px → isMobile === true`}
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
