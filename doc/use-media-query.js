/**
 * useMediaQuery：订阅任意 CSS media query
 *
 * - 视口模式：标准 matchMedia
 * - container 模式：含 max-width 的 query 会映射到 Provider.getIsMobile()
 */
const {ResponsiveProvider, IS_MOBILE_QUERY, useIsMobile, useMediaQuery} = _ResponsiveUtils;
const {Alert, Card, Flex, InputNumber, Space, Switch, Tag, Typography} = antd;
const {useState} = React;

const QUERIES = [
  {label: '官方移动端 query', query: IS_MOBILE_QUERY, note: '与 useIsMobile 同源'},
  {label: '紧凑布局', query: '(max-width: 576px)', note: '可驱动更窄的表单间距'},
  {label: '宽屏工作台', query: '(min-width: 1200px)', note: 'container 下 min-width 仍走真实视口'},
  {label: '横屏', query: '(orientation: landscape)', note: '设备方向'},
  {label: '深色偏好', query: '(prefers-color-scheme: dark)', note: '系统主题'}
];

const QueryRow = ({label, query, note}) => {
  const matches = useMediaQuery(query);
  return (
    <Flex justify="space-between" align="center" gap={12}>
      <div>
        <Typography.Text>{label}</Typography.Text>
        <br />
        <Typography.Text type="secondary" style={{fontSize: 12}} code>
          {query}
        </Typography.Text>
        {note && (
          <>
            <br />
            <Typography.Text type="secondary" style={{fontSize: 12}}>
              {note}
            </Typography.Text>
          </>
        )}
      </div>
      <Tag color={matches ? 'success' : 'default'}>{matches ? '匹配' : '不匹配'}</Tag>
    </Flex>
  );
};

const Panel = () => {
  const isMobile = useIsMobile();
  return (
    <Flex vertical gap={12}>
      <Space>
        <Typography.Text>useIsMobile</Typography.Text>
        <Tag color={isMobile ? 'orange' : 'blue'}>{String(isMobile)}</Tag>
      </Space>
      {QUERIES.map(item => (
        <Card key={item.query} size="small">
          <QueryRow {...item} />
        </Card>
      ))}
    </Flex>
  );
};

const UseMediaQueryExample = () => {
  const [containerMode, setContainerMode] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="何时用 useMediaQuery？"
        description="只要「是不是移动端」→ useIsMobile；任意 query / 方向 / 配色偏好 → 用本 Hook。"
      />

      <Card size="small" title="运行环境">
        <Space wrap>
          <Typography.Text>容器模式</Typography.Text>
          <Switch checked={containerMode} onChange={setContainerMode} />
          {containerMode && (
            <>
              <Typography.Text>containerWidth</Typography.Text>
              <InputNumber
                min={320}
                max={1600}
                value={containerWidth}
                onChange={v => setContainerWidth(v || 500)}
                addonAfter="px"
              />
            </>
          )}
        </Space>
        <Typography.Paragraph type="secondary" style={{marginTop: 12, marginBottom: 0}}>
          打开容器模式后，调节宽度观察含 <Typography.Text code>max-width</Typography.Text>{' '}
          的条目；其它 query（横屏、深色、min-width）仍跟随真实浏览器。
        </Typography.Paragraph>
      </Card>

      {containerMode ? (
        <ResponsiveProvider mode="container" containerWidth={containerWidth}>
          <Card size="small" title={`容器 ${containerWidth}px`}>
            <Panel />
          </Card>
        </ResponsiveProvider>
      ) : (
        <Card size="small" title="视口模式">
          <Panel />
        </Card>
      )}
    </Flex>
  );
};

render(<UseMediaQueryExample />);
