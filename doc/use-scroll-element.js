const {ResponsiveProvider, useScrollElement} = _ResponsiveUtils;
const {Button, Card, Flex, Typography} = antd;
const {useEffect, useRef, useState} = React;

const ScrollMonitor = () => {
  const getScrollElement = useScrollElement();
  const [info, setInfo] = useState({scrollTop: 0, clientHeight: 0, scrollHeight: 0});

  useEffect(() => {
    const el = getScrollElement();
    const update = () => {
      setInfo({
        scrollTop: el.scrollTop,
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight
      });
    };
    update();
    el.addEventListener('scroll', update, {passive: true});
    return () => el.removeEventListener('scroll', update);
  }, [getScrollElement]);

  const scrollToTop = () => {
    const el = getScrollElement();
    el.scrollTo({top: 0, behavior: 'smooth'});
  };

  const scrollToBottom = () => {
    const el = getScrollElement();
    el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
  };

  return (
    <Flex vertical gap={8}>
      <Typography.Text>
        scrollTop: {info.scrollTop}px / 可视高度: {info.clientHeight}px / 总高度: {info.scrollHeight}px
      </Typography.Text>
      <Flex gap={8}>
        <Button size="small" onClick={scrollToTop}>
          滚到顶部
        </Button>
        <Button size="small" onClick={scrollToBottom}>
          滚到底部
        </Button>
      </Flex>
    </Flex>
  );
};

const UseScrollElementExample = () => {
  const scrollRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Card size="small">
        <Typography.Paragraph type="secondary" style={{margin: 0}}>
          useScrollElement 返回滚动容器 getter，适用于虚拟列表、锚点导航、滚动同步等场景。
        </Typography.Paragraph>
      </Card>
      <div
        ref={scrollRef}
        style={{
          height: 200,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12,
          background: '#fafafa'
        }}
      >
        <ResponsiveProvider scrollRef={scrollRef}>
          <ScrollMonitor />
          <div style={{height: 400, marginTop: 16}}>
            {Array.from({length: 8}, (_, i) => (
              <Card key={i} size="small" style={{marginBottom: 8}}>
                审批单 #{10086 + i} — 差旅报销 · 待部门经理审批
              </Card>
            ))}
          </div>
        </ResponsiveProvider>
      </div>
    </Flex>
  );
};

render(<UseScrollElementExample />);
