const {ResponsiveProvider, useMediaQuery, useIsMobile, IS_MOBILE_QUERY} = _ResponsiveUtils;
const {Card, Flex, InputNumber, Switch, Tag, Typography} = antd;
const {useState} = React;

const CUSTOM_QUERIES = [
  {label: '紧凑模式 (max-width: 576px)', query: '(max-width: 576px)'},
  {label: '宽屏 (min-width: 1200px)', query: '(min-width: 1200px)'},
  {label: '横屏', query: '(orientation: landscape)'},
  {label: '深色偏好', query: '(prefers-color-scheme: dark)'}
];

const QueryRow = ({label, query}) => {
  const matches = useMediaQuery(query);
  return (
    <Flex justify="space-between" align="center">
      <Typography.Text>{label}</Typography.Text>
      <Tag color={matches ? 'success' : 'default'}>{matches ? '匹配' : '不匹配'}</Tag>
    </Flex>
  );
};

const MediaQueryPanel = () => {
  const isMobile = useIsMobile();

  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between" align="center">
        <Typography.Text>IS_MOBILE_QUERY</Typography.Text>
        <Tag color={isMobile ? 'orange' : 'blue'}>{isMobile ? '匹配' : '不匹配'}</Tag>
      </Flex>
      {CUSTOM_QUERIES.map((item) => (
        <QueryRow key={item.query} {...item} />
      ))}
    </Flex>
  );
};

const UseMediaQueryExample = () => {
  const [containerMode, setContainerMode] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);

  return (
    <Flex vertical gap={16}>
      <Card size="small">
        <Typography.Paragraph type="secondary" style={{margin: 0}}>
          useMediaQuery 订阅标准 matchMedia。容器模式下，含 max-width 的 query 会映射到 Provider 的
          getIsMobile()。
        </Typography.Paragraph>
      </Card>
      <Flex gap={12} align="center">
        <Typography.Text>容器模式</Typography.Text>
        <Switch checked={containerMode} onChange={setContainerMode} />
        {containerMode && (
          <InputNumber
            min={320}
            max={1600}
            value={containerWidth}
            onChange={(v) => setContainerWidth(v || 500)}
            addonAfter="px"
          />
        )}
      </Flex>
      {containerMode ? (
        <ResponsiveProvider mode="container" containerWidth={containerWidth}>
          <Card size="small" title={`容器 ${containerWidth}px`}>
            <MediaQueryPanel />
          </Card>
        </ResponsiveProvider>
      ) : (
        <Card size="small" title="视口模式">
          <MediaQueryPanel />
        </Card>
      )}
      <Typography.Text type="secondary" code>
        {IS_MOBILE_QUERY}
      </Typography.Text>
    </Flex>
  );
};

render(<UseMediaQueryExample />);
