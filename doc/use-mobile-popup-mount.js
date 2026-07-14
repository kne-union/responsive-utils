/**
 * useMobilePopupMount：移动端弹层一站式挂载
 *
 * 业务只选 cover：
 * - cover='boundary'（默认）：罩住 Provider boundary —— Modal 推荐
 * - cover='viewport'：罩住当前移动可视区 —— 半屏 Select / Sheet
 *     · mode=container → 挂 boundary + kne-is-boundary
 *     · mode=viewport 且移动端 → body + kne-is-viewport
 */
const {
  ResponsiveProvider,
  RESPONSIVE_BOUNDARY_CLASS,
  RESPONSIVE_SCROLL_CLASS,
  MOBILE_POPUP_MODE,
  MOBILE_POPUP_COVER,
  useMobilePopupMount,
  useResponsiveContext
} = _ResponsiveUtils;
const {Alert, Button, Card, Descriptions, Flex, Radio, Space, Tag, Typography} = antd;
const {useEffect, useMemo, useRef, useState} = React;
const {createPortal} = ReactDOM;

const PHONE_WIDTH = 375;
const PHONE_HEIGHT = 620;

const formatMount = node => {
  if (!node) return '-';
  if (node === document.body) return 'document.body';
  const cls = node.className || '';
  if (cls.includes(RESPONSIVE_BOUNDARY_CLASS)) return `.${RESPONSIVE_BOUNDARY_CLASS}`;
  return cls || node.tagName;
};

/** 演示弹层：按 fixedModeClass 切换 absolute / fixed */
const DemoOverlay = ({open, fixedModeClass, title, onClose, mountNode}) => {
  if (!open || !mountNode) return null;
  const useAbsolute = fixedModeClass === MOBILE_POPUP_MODE.boundary;
  const position = useAbsolute ? 'absolute' : 'fixed';

  return createPortal(
    <>
      <div
        className={fixedModeClass || undefined}
        style={{position, inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000}}
        onClick={onClose}
      />
      <div
        className={fixedModeClass || undefined}
        style={{
          position,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1001,
          background: '#fff',
          borderRadius: '12px 12px 0 0',
          padding: 16,
          boxShadow: '0 -6px 16px rgba(0,0,0,0.12)',
          maxHeight: '70%',
          overflow: 'auto'
        }}
      >
        <Flex justify="space-between" align="center" style={{marginBottom: 12}}>
          <Typography.Text strong>{title}</Typography.Text>
          <Button type="link" onClick={onClose}>
            关闭
          </Button>
        </Flex>
        <Typography.Paragraph type="secondary" style={{marginBottom: 8}}>
          fixedModeClass = <Typography.Text code>{fixedModeClass || 'null（桌面）'}</Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary" style={{marginBottom: 0}}>
          mount = <Typography.Text code>{formatMount(mountNode)}</Typography.Text>
        </Typography.Paragraph>
        <div style={{height: 100, marginTop: 12, background: '#f5f5f5', borderRadius: 8, padding: 12}}>
          组件侧 CSS：.kne-is-boundary 用 absolute；.kne-is-viewport 用 fixed。
        </div>
      </div>
    </>,
    mountNode
  );
};

const MountDemo = ({cover, title, tip}) => {
  const {mode} = useResponsiveContext();
  const {isMobile, fixedModeClass, getMountNode, getPopupContainer, anchorRef} = useMobilePopupMount({
    cover
  });
  const [open, setOpen] = useState(false);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (!open) {
      setMountNode(null);
      return;
    }
    const trigger = document.querySelector(`[data-cover="${cover}"][data-mode="${mode}"]`);
    setMountNode(getMountNode(trigger) || getPopupContainer(trigger));
  }, [open, cover, mode, getMountNode, getPopupContainer]);

  return (
    <Card
      size="small"
      title={title}
      extra={<Tag color={cover === 'viewport' ? 'blue' : 'green'}>cover={cover}</Tag>}
    >
      <Flex vertical gap={12}>
        <Typography.Text type="secondary">{tip}</Typography.Text>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Provider.mode">{mode}</Descriptions.Item>
          <Descriptions.Item label="isMobile">
            <Tag color={isMobile ? 'orange' : 'default'}>{String(isMobile)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="fixedModeClass">
            <Typography.Text code>{fixedModeClass || 'null'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="挂载节点">
            {open ? formatMount(mountNode) : '（打开后显示）'}
          </Descriptions.Item>
        </Descriptions>
        <div ref={anchorRef}>
          <Button
            data-cover={cover}
            data-mode={mode}
            type="primary"
            block
            onClick={() => setOpen(true)}
          >
            打开弹层
          </Button>
        </div>
        <DemoOverlay
          open={open}
          fixedModeClass={fixedModeClass}
          title={title}
          mountNode={mountNode}
          onClose={() => setOpen(false)}
        />
      </Flex>
    </Card>
  );
};

const ContainerModeDemo = () => {
  const boundaryRef = useRef(null);
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(PHONE_WIDTH);

  return (
    <Flex vertical gap={12}>
      <Alert
        showIcon
        type="info"
        message="场景 A：mode=container"
        description={
          <>
            按 <Typography.Text code>containerWidth</Typography.Text> 判定移动端。两种 cover
            都应挂在当前 boundary 内，class 为 <Typography.Text code>kne-is-boundary</Typography.Text>。
          </>
        }
      />
      <Radio.Group
        value={containerWidth}
        onChange={e => setContainerWidth(e.target.value)}
        options={[
          {label: '375 窄屏', value: 375},
          {label: '768 临界', value: 768},
          {label: '1024 宽屏', value: 1024}
        ]}
      />
      <div
        ref={boundaryRef}
        className={RESPONSIVE_BOUNDARY_CLASS}
        style={{
          position: 'relative',
          width: Math.min(containerWidth, PHONE_WIDTH + 48),
          height: PHONE_HEIGHT,
          margin: '0 auto',
          border: '1px solid #d9d9d9',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#f5f5f5',
          boxSizing: 'content-box'
        }}
      >
        <div
          ref={scrollRef}
          className={RESPONSIVE_SCROLL_CLASS}
          style={{height: '100%', overflow: 'auto', padding: 12, boxSizing: 'border-box'}}
        >
          <ResponsiveProvider
            mode="container"
            containerWidth={containerWidth}
            boundaryRef={boundaryRef}
            scrollRef={scrollRef}
          >
            <Flex vertical gap={12}>
              <MountDemo
                cover={MOBILE_POPUP_COVER.boundary}
                title="Modal · cover=boundary"
                tip="对话框默认选这个"
              />
              <MountDemo
                cover={MOBILE_POPUP_COVER.viewport}
                title="半屏 · cover=viewport"
                tip="container 模式下同样落在 boundary，不穿出滚动区"
              />
              <Card size="small">滚动后弹层仍相对本 boundary 铺满。</Card>
            </Flex>
          </ResponsiveProvider>
        </div>
      </div>
    </Flex>
  );
};

const ViewportModeDemo = () => {
  const boundaryRef = useRef(null);

  return (
    <Flex vertical gap={12}>
      <Alert
        showIcon
        type="warning"
        message="场景 B：mode=viewport"
        description={
          <>
            跟浏览器窗口宽度走。把窗口缩到 &lt;768px 后：
            <br />
            cover=boundary → 本区 boundary + kne-is-boundary
            <br />
            cover=viewport → document.body + kne-is-viewport
          </>
        }
      />
      <div
        ref={boundaryRef}
        className={RESPONSIVE_BOUNDARY_CLASS}
        style={{
          position: 'relative',
          border: '1px dashed #91caff',
          borderRadius: 8,
          padding: 12,
          background: '#f0f5ff',
          minHeight: 260
        }}
      >
        <ResponsiveProvider mode="viewport" boundaryRef={boundaryRef}>
          <Flex vertical gap={12}>
            <MountDemo
              cover={MOBILE_POPUP_COVER.boundary}
              title="Modal · cover=boundary"
              tip="挂当前 Provider boundary"
            />
            <MountDemo
              cover={MOBILE_POPUP_COVER.viewport}
              title="半屏 · cover=viewport"
              tip="窄屏时挂 body，用 fixed 罩住可视区"
            />
          </Flex>
        </ResponsiveProvider>
      </div>
    </Flex>
  );
};

const UseMobilePopupMountExample = () => {
  const [tab, setTab] = useState('container');

  const snippet = useMemo(
    () => `// Modal
const { isMobile, getPopupContainer, fixedModeClass, anchorRef } = useMobilePopupMount();

// 半屏 Sheet / Select
const sheet = useMobilePopupMount({ cover: 'viewport' });

// Antd
<Modal getContainer={getPopupContainer} wrapClassName={fixedModeClass} />
<button ref={anchorRef}>打开</button>`,
    []
  );

  return (
    <Flex vertical gap={16}>
      <Alert
        showIcon
        type="success"
        message="核心约定：业务只选 cover"
        description={
          <Space wrap style={{marginTop: 4}}>
            <Tag>{MOBILE_POPUP_MODE.boundary}</Tag>
            <Tag>{MOBILE_POPUP_MODE.viewport}</Tag>
          </Space>
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
      >
        {snippet}
      </pre>
      <Radio.Group
        value={tab}
        onChange={e => setTab(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        options={[
          {label: '① container 模式', value: 'container'},
          {label: '② viewport 模式', value: 'viewport'}
        ]}
      />
      {tab === 'container' ? <ContainerModeDemo /> : <ViewportModeDemo />}
    </Flex>
  );
};

render(<UseMobilePopupMountExample />);
