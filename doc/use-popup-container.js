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
