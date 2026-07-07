const {
  BREAKPOINTS,
  MOBILE_BREAKPOINT,
  IS_MOBILE_QUERY,
  useIsMobile,
  useBreakpoint
} = _ResponsiveUtils;
const {Card, Descriptions, Flex, Tag, Typography} = antd;
const {useMemo} = React;

const BreakpointTags = () => {
  const breakpoints = useBreakpoint();
  const isMobile = useIsMobile();

  const activeKeys = useMemo(
    () => Object.keys(breakpoints).filter((key) => key !== 'isMobile' && breakpoints[key]),
    [breakpoints]
  );

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="断点 Token">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="MOBILE_BREAKPOINT">{MOBILE_BREAKPOINT}px</Descriptions.Item>
          <Descriptions.Item label="IS_MOBILE_QUERY">{IS_MOBILE_QUERY}</Descriptions.Item>
          <Descriptions.Item label="BREAKPOINTS">
            {Object.entries(BREAKPOINTS)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' / ')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card size="small" title="实时响应式状态">
        <Flex vertical gap={8}>
          <Typography.Text>
            当前设备：
            <Tag color={isMobile ? 'orange' : 'blue'}>{isMobile ? '移动端' : '桌面端'}</Tag>
          </Typography.Text>
          <Typography.Text type="secondary">已命中断点：{activeKeys.join(', ') || 'xs'}</Typography.Text>
        </Flex>
      </Card>
    </Flex>
  );
};

render(<BreakpointTags />);
