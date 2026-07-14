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
