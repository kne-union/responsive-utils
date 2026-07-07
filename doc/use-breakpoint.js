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
