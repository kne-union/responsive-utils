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
      >{`import {
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
</div>`}</pre>

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
