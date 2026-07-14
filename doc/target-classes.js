/**
 * 目标类名：推荐的页面结构约定
 *
 * 在布局根节点打上这三个类后，Provider / Hooks 可自动解析，无需层层传 ref。
 * Global、system-layout 等布局容器均按同一约定接线。
 */
const {
  ResponsiveProvider,
  RESPONSIVE_CONTAINER_CLASS,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  findResponsiveBoundary,
  findResponsiveScroll,
  useIsMobile,
  usePopupContainer
} = _ResponsiveUtils;
const {Alert, Button, Card, Descriptions, Flex, Select, Space, Tag, Typography} = antd;
const {useRef, useState} = React;

const Probe = () => {
  const isMobile = useIsMobile();
  const getPopupContainer = usePopupContainer();
  const anchorRef = useRef(null);
  const [result, setResult] = useState(null);

  const inspect = () => {
    const anchor = anchorRef.current;
    const boundary = findResponsiveBoundary(anchor);
    const scroll = findResponsiveScroll(anchor);
    const popup = getPopupContainer();
    setResult({
      isMobile,
      boundary: boundary ? `.${boundary.className.split(' ').filter(Boolean).join('.')}` : 'null',
      scroll: scroll ? `.${scroll.className.split(' ').filter(Boolean).join('.')}` : 'null',
      popup: popup === document.body ? 'document.body' : popup?.className || popup?.tagName
    });
  };

  return (
    <Flex vertical gap={12}>
      <Space wrap>
        <Tag color={isMobile ? 'orange' : 'blue'}>useIsMobile → {String(isMobile)}</Tag>
        <span ref={anchorRef} />
        <Button type="primary" onClick={inspect}>
          从当前锚点解析 boundary / scroll
        </Button>
      </Space>
      <Select
        style={{width: '100%'}}
        placeholder="下拉会挂到 boundary"
        getPopupContainer={getPopupContainer}
        options={[
          {label: '招聘需求', value: 'req'},
          {label: '候选人', value: 'cand'},
          {label: 'offer 审批', value: 'offer'}
        ]}
      />
      {result && (
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="findResponsiveBoundary">{result.boundary}</Descriptions.Item>
          <Descriptions.Item label="findResponsiveScroll">{result.scroll}</Descriptions.Item>
          <Descriptions.Item label="usePopupContainer()">{result.popup}</Descriptions.Item>
        </Descriptions>
      )}
    </Flex>
  );
};

const TargetClassesExample = () => {
  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="三个类名各管一件事"
        description={
          <Descriptions size="small" column={1} style={{marginTop: 8}}>
            <Descriptions.Item label={RESPONSIVE_CONTAINER_CLASS}>
              容器查询宿主（配合 SCSS <Typography.Text code>@include resp.responsive-container</Typography.Text>
              ）
            </Descriptions.Item>
            <Descriptions.Item label={RESPONSIVE_BOUNDARY_CLASS}>
              弹层挂载边界（Select / DatePicker / Modal）
            </Descriptions.Item>
            <Descriptions.Item label={RESPONSIVE_SCROLL_CLASS}>
              滚动参照（Affix、BackTop、虚拟列表、锚点）
            </Descriptions.Item>
          </Descriptions>
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
      >{`<div className={RESPONSIVE_CONTAINER_CLASS}>
  <div className={RESPONSIVE_BOUNDARY_CLASS} style={{ position: 'relative' }}>
    <div className={RESPONSIVE_SCROLL_CLASS} style={{ overflow: 'auto', height: '100%' }}>
      <ResponsiveProvider>{children}</ResponsiveProvider>
    </div>
  </div>
</div>`}</pre>

      <div
        className={RESPONSIVE_CONTAINER_CLASS}
        style={{border: '1px solid #b7eb8f', borderRadius: 8, padding: 8, background: '#f6ffed'}}
      >
        <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
          .{RESPONSIVE_CONTAINER_CLASS}
        </Typography.Text>
        <div
          className={RESPONSIVE_BOUNDARY_CLASS}
          style={{
            position: 'relative',
            border: '1px dashed #91caff',
            borderRadius: 8,
            padding: 8,
            background: '#f0f5ff'
          }}
        >
          <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
            .{RESPONSIVE_BOUNDARY_CLASS}
          </Typography.Text>
          <div
            className={RESPONSIVE_SCROLL_CLASS}
            style={{
              height: 200,
              overflow: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: 12,
              background: '#fff'
            }}
          >
            <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
              .{RESPONSIVE_SCROLL_CLASS}
            </Typography.Text>
            <ResponsiveProvider>
              <Probe />
              <div style={{height: 160}} />
            </ResponsiveProvider>
          </div>
        </div>
      </div>

      <Card size="small">
        <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
          传 <Typography.Text code>boundaryRef</Typography.Text> /{' '}
          <Typography.Text code>scrollRef</Typography.Text> 时以 ref 为准；没传则按类名从触发器向上找，再回退{' '}
          <Typography.Text code>body</Typography.Text> / 文档滚动根。
        </Typography.Paragraph>
      </Card>
    </Flex>
  );
};

render(<TargetClassesExample />);
