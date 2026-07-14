/**
 * DOM 工具：无 React 上下文、或写底层封装时使用
 *
 * 业务组件优先用 Hooks；此处演示纯函数如何解析 boundary / scroll。
 */
const {
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  findScrollParent,
  findResponsiveBoundary,
  findResponsiveScroll,
  resolveBoundaryElement,
  resolveScrollElement,
  getDefaultBoundaryElement,
  getDefaultScrollElement
} = _ResponsiveUtils;
const {Alert, Button, Card, Descriptions, Flex, Typography} = antd;
const {useRef, useState} = React;

const DomUtilsExample = () => {
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);
  const anchorRef = useRef(null);
  const [result, setResult] = useState(null);

  const inspect = () => {
    const anchor = anchorRef.current;
    const scrollParent = findScrollParent(anchor);
    const byClassBoundary = findResponsiveBoundary(anchor);
    const byClassScroll = findResponsiveScroll(anchor);

    setResult({
      findScrollParent: scrollParent
        ? scrollParent.className || scrollParent.tagName
        : 'null（无可滚动祖先）',
      findResponsiveBoundary: byClassBoundary ? byClassBoundary.className : 'null',
      findResponsiveScroll: byClassScroll ? byClassScroll.className : 'null',
      resolveBoundaryElement: (() => {
        const el = resolveBoundaryElement(boundaryRef);
        return el === document.body ? 'document.body' : el.className || el.tagName;
      })(),
      resolveScrollElement: (() => {
        const el = resolveScrollElement(scrollRef, anchor);
        return el.className || el.tagName;
      })(),
      getDefaultBoundaryElement: getDefaultBoundaryElement().tagName,
      getDefaultScrollElement: getDefaultScrollElement().tagName
    });
  };

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="何时用 DOM 工具？"
        description="写底层组件、命令式 API、或暂时拿不到 Provider 时。日常页面请用 usePopupContainer / useScrollElement / useMobilePopupMount。"
      />

      <div
        style={{
          overflow: 'auto',
          height: 240,
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12
        }}
      >
        <Typography.Text type="secondary">外层 overflow:auto（findScrollParent 可能先命中它）</Typography.Text>
        <div style={{height: 40}} />
        <div
          ref={boundaryRef}
          className={RESPONSIVE_BOUNDARY_CLASS}
          style={{border: '1px dashed #91caff', borderRadius: 6, padding: 12, background: '#f0f5ff'}}
        >
          <div
            ref={scrollRef}
            className={RESPONSIVE_SCROLL_CLASS}
            style={{height: 120, overflow: 'auto', background: '#fff', padding: 8}}
          >
            <div ref={anchorRef} style={{height: 200, paddingTop: 48}}>
              <Typography.Text>锚点元素 — 点下方按钮解析</Typography.Text>
            </div>
          </div>
        </div>
      </div>

      <Button type="primary" onClick={inspect}>
        解析 DOM
      </Button>

      {result && (
        <Card size="small" title="解析结果">
          <Descriptions column={1} size="small">
            {Object.entries(result).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                <Typography.Text code>{value}</Typography.Text>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}

      <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
        <Typography.Text code>resolveBoundaryElement(ref)</Typography.Text> 优先 ref，否则{' '}
        <Typography.Text code>body</Typography.Text>；
        <Typography.Text code>resolveScrollElement(ref, anchor)</Typography.Text> 优先 ref，否则从
        anchor 找可滚父级 / 文档滚动根。
      </Typography.Paragraph>
    </Flex>
  );
};

render(<DomUtilsExample />);
