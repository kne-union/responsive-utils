const {
  findScrollParent,
  resolveBoundaryElement,
  resolveScrollElement,
  getDefaultScrollElement,
  getDefaultBoundaryElement
} = _ResponsiveUtils;
const {Button, Card, Descriptions, Flex, Typography} = antd;
const {useRef, useState} = React;

const DomUtilsExample = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);
  const [result, setResult] = useState(null);

  const inspect = () => {
    const anchor = innerRef.current;
    const scrollParent = findScrollParent(anchor);
    setResult({
      scrollParent: scrollParent ? scrollParent.className || scrollParent.tagName : 'null',
      resolvedBoundary: resolveBoundaryElement(boundaryRef).className || 'body',
      resolvedScroll: resolveScrollElement(scrollRef, anchor).className || 'documentElement',
      defaultBoundary: getDefaultBoundaryElement().tagName,
      defaultScroll: getDefaultScrollElement().tagName
    });
  };

  return (
    <Flex vertical gap={16}>
      <div
        ref={outerRef}
        className="dom-utils-outer"
        style={{overflow: 'auto', height: 220, border: '1px solid #d9d9d9', borderRadius: 8, padding: 12}}
      >
        <Typography.Text type="secondary">外层可滚动容器 (.dom-utils-outer)</Typography.Text>
        <div style={{height: 120}} />
        <div
          ref={boundaryRef}
          className="dom-utils-boundary"
          style={{border: '1px dashed #91caff', padding: 12, borderRadius: 6, background: '#f0f5ff'}}
        >
          <div
            ref={scrollRef}
            className="dom-utils-scroll"
            style={{height: 100, overflow: 'auto', background: '#fff', padding: 8}}
          >
            <div ref={innerRef} className="dom-utils-anchor" style={{height: 200, paddingTop: 60}}>
              <Typography.Text>锚点元素 (.dom-utils-anchor)</Typography.Text>
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
            <Descriptions.Item label="findScrollParent(anchor)">{result.scrollParent}</Descriptions.Item>
            <Descriptions.Item label="resolveBoundaryElement(boundaryRef)">
              {result.resolvedBoundary}
            </Descriptions.Item>
            <Descriptions.Item label="resolveScrollElement(scrollRef, anchor)">
              {result.resolvedScroll}
            </Descriptions.Item>
            <Descriptions.Item label="getDefaultBoundaryElement()">{result.defaultBoundary}</Descriptions.Item>
            <Descriptions.Item label="getDefaultScrollElement()">{result.defaultScroll}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Flex>
  );
};

render(<DomUtilsExample />);
