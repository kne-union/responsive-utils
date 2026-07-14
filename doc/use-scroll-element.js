/**
 * useScrollElement：拿到真正的滚动根
 *
 * 后台常在「主内容区」滚，而不是 window。锚点、Affix、锁滚动、虚拟列表都需要这个 getter。
 */
const {
  ResponsiveProvider,
  RESPONSIVE_SCROLL_CLASS,
  useScrollElement
} = _ResponsiveUtils;
const {Alert, Button, Card, Flex, Space, Typography} = antd;
const {useEffect, useRef, useState} = React;

const APPROVALS = Array.from({length: 12}, (_, i) => ({
  id: 10086 + i,
  title: `差旅报销单 #${10086 + i}`,
  owner: ['陈晓', '林舟', '周宁'][i % 3],
  status: ['待部门经理', '待财务', '已通过'][i % 3]
}));

const ScrollToolbar = () => {
  const getScrollElement = useScrollElement();
  const [info, setInfo] = useState({scrollTop: 0, clientHeight: 0, scrollHeight: 0, tag: '-'});

  useEffect(() => {
    const el = getScrollElement();
    if (!el) return undefined;
    const update = () => {
      setInfo({
        scrollTop: Math.round(el.scrollTop || 0),
        clientHeight: el.clientHeight || 0,
        scrollHeight: el.scrollHeight || 0,
        tag: el.className || el.tagName
      });
    };
    update();
    el.addEventListener('scroll', update, {passive: true});
    return () => el.removeEventListener('scroll', update);
  }, [getScrollElement]);

  return (
    <Card size="small" title="滚动监控（业务组件内）" style={{position: 'sticky', top: 0, zIndex: 1}}>
      <Typography.Paragraph style={{marginBottom: 8}}>
        当前滚动根：<Typography.Text code>{info.tag}</Typography.Text>
      </Typography.Paragraph>
      <Typography.Text type="secondary">
        scrollTop {info.scrollTop} / 可视 {info.clientHeight} / 总高 {info.scrollHeight}
      </Typography.Text>
      <div style={{marginTop: 8}}>
        <Space>
          <Button
            size="small"
            onClick={() => getScrollElement()?.scrollTo({top: 0, behavior: 'smooth'})}
          >
            回顶
          </Button>
          <Button
            size="small"
            onClick={() => {
              const el = getScrollElement();
              el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
            }}
          >
            到底
          </Button>
          <Button
            size="small"
            onClick={() => {
              const el = getScrollElement();
              const target = el?.querySelector('[data-anchor="finance"]');
              target?.scrollIntoView({behavior: 'smooth', block: 'start'});
            }}
          >
            跳到「待财务」区块
          </Button>
        </Space>
      </div>
    </Card>
  );
};

const UseScrollElementExample = () => {
  const scrollRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="info"
        message="用法"
        description={
          <span>
            <Typography.Text code>const getScrollElement = useScrollElement();</Typography.Text>
            {' → '}
            <Typography.Text code>getScrollElement()</Typography.Text> 得到 HTMLElement，再监听 scroll /
            scrollTo / 量尺寸。
          </span>
        }
      />

      <div
        ref={scrollRef}
        className={RESPONSIVE_SCROLL_CLASS}
        style={{
          height: 280,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12,
          background: '#fafafa'
        }}
      >
        <ResponsiveProvider scrollRef={scrollRef}>
          <ScrollToolbar />
          <Flex vertical gap={8} style={{marginTop: 12}}>
            {APPROVALS.map(item => (
              <Card
                key={item.id}
                size="small"
                data-anchor={item.status === '待财务' ? 'finance' : undefined}
              >
                <Typography.Text strong>{item.title}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  {item.owner} · {item.status}
                </Typography.Text>
              </Card>
            ))}
          </Flex>
        </ResponsiveProvider>
      </div>

      <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
        也可只标 <Typography.Text code>{RESPONSIVE_SCROLL_CLASS}</Typography.Text>
        ，不传 scrollRef。打开弹层锁滚动等场景常与 <Typography.Text code>usePopupContainer</Typography.Text>{' '}
        一起用。
      </Typography.Paragraph>
    </Flex>
  );
};

render(<UseScrollElementExample />);
