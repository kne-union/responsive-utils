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
