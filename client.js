window.__ModuleLoader__.load({
  id: 'dsh-nb-plugin',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /**
     * Every switchable region: id (stored token + hide attribute), its group, and its
     * label key. Coarse regions keep their original ids; finer ones target `data-slot`
     * anchors, which the slot outlet renders as `display: contents` wrappers.
     */
    const REGIONS = [
      { id: 'sidebar', group: 'groupSidebar', label: 'regionSidebar' },
      { id: 'sidebarSessions', group: 'groupSidebar', label: 'regionSidebarSessions' },
      { id: 'sidebarPanels', group: 'groupSidebar', label: 'regionSidebarPanels' },
      { id: 'sidebarSettings', group: 'groupSidebar', label: 'regionSidebarSettings' },
      { id: 'center', group: 'groupSession', label: 'regionCenter' },
      { id: 'header', group: 'groupSession', label: 'regionHeader' },
      { id: 'headerActions', group: 'groupSession', label: 'regionHeaderActions' },
      { id: 'chat', group: 'groupSession', label: 'regionChat' },
      { id: 'chatActions', group: 'groupSession', label: 'regionChatActions' },
      { id: 'composer', group: 'groupSession', label: 'regionComposer' },
      { id: 'heroWorkspace', group: 'groupSession', label: 'regionHeroWorkspace' },
      { id: 'heroPreset', group: 'groupSession', label: 'regionHeroPreset' },
      { id: 'composerAttachments', group: 'groupSession', label: 'regionComposerAttachments' },
      { id: 'composerModel', group: 'groupSession', label: 'regionComposerModel' },
      { id: 'composerPermission', group: 'groupSession', label: 'regionComposerPermission' },
      { id: 'composerPlan', group: 'groupSession', label: 'regionComposerPlan' },
      { id: 'rightbar', group: 'groupShell', label: 'regionRightbar' },
      { id: 'rightbarTabs', group: 'groupShell', label: 'regionRightbarTabs' },
      { id: 'bottom', group: 'groupShell', label: 'regionBottom' },
      { id: 'leading', group: 'groupShell', label: 'regionLeading' },
      { id: 'handles', group: 'groupShell', label: 'regionHandles' },
      { id: 'overlay', group: 'groupShell', label: 'regionOverlay' },
    ];
    const REGION_IDS = REGIONS.map((region) => region.id);
    const GROUPS = ['groupSidebar', 'groupSession', 'groupShell'];
    const STORAGE_KEY = 'dsh.ui-visibility.v2';
    const LEGACY_STORAGE_KEY = 'dsh.ui-visibility.v1';
    /* A fresh install hides the composer and its own floating button; the Settings page brings both back. */
    const DEFAULT_HIDDEN = ['composer'];
    const DEFAULT_DOCK = false;
    const NS = 'uiVisibility';
    const SHORTCUT_LABEL = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘⇧H' : 'Ctrl+Shift+H';

    const zh = {
      title: '界面显隐',
      summaryLabel: '已隐藏',
      master: '全部显示',
      section: '区域',
      groupSidebar: '侧边栏',
      groupSession: '会话',
      groupShell: '外壳',
      regionSidebar: '左侧边栏（整体）',
      regionSidebarSessions: '会话列表',
      regionSidebarPanels: '面板入口',
      regionSidebarSettings: '设置入口',
      regionCenter: '主面板',
      regionHeader: '会话标题栏',
      regionHeaderActions: '标题栏按钮',
      regionChat: '对话内容',
      regionChatActions: '消息按钮',
      regionComposer: '输入区',
      regionHeroWorkspace: '工作区选择',
      regionHeroPreset: '模式选择',
      regionComposerAttachments: '附件区',
      regionComposerModel: '模型选择',
      regionComposerPermission: '权限选择',
      regionComposerPlan: '计划开关',
      regionRightbar: '右侧面板',
      regionRightbarTabs: '右侧内容',
      regionBottom: '底部栏',
      regionLeading: '顶部工具',
      regionHandles: '拖拽手柄',
      regionOverlay: '浮层与挂件',
      presetImmersive: '沉浸模式',
      presetShowAll: '全部显示',
      shortcut: '切换全部隐藏',
      open: '打开界面显隐面板',
      close: '关闭界面显隐面板',
      pluginSection: '插件',
      pickElement: '拾取元素',
      pickHint: '点击要隐藏的元素，Esc 取消',
      pickHintConfirm: '确认要隐藏的是这一层，或往上扩大范围',
      pickCancel: '取消',
      pickFailed: '这个元素没法标记，换个位置再点',
      pickExpand: '往上扩一层',
      pickShrink: '回到里层',
      pickHideOne: '只藏这一个',
      pickHideSimilar: '同样的都藏',
      pickSimilarUnavailable: '特征不够，无法匹配同类',
      pickTargetPrefix: '当前：',
      pickSimilarBadge: '同类',
      customSection: '已拾取元素',
      customEmpty: '还没有拾取任何元素',
      clearPicked: '全部恢复',
      removePicked: '恢复显示',
      dockButton: '悬浮按钮',
      dockHint: '右侧的显隐面板入口',
      settingsNav: '界面显隐',
      settingsTitle: '界面显隐',
      settingsDesc: '逐个显示或隐藏界面区域。设置在这里修改，和浮动面板共用同一份状态。',
      settingsHint: '悬浮按钮被隐藏后，仍可从本页或快捷键 ⌘⇧H / Ctrl+Shift+H 恢复。',
      shortcutHint: '快捷键：显示 / 隐藏全部区域',
    };

    const en = {
      title: 'UI Visibility',
      summaryLabel: 'hidden',
      master: 'Show all',
      section: 'Regions',
      groupSidebar: 'Sidebar',
      groupSession: 'Session',
      groupShell: 'Shell',
      regionSidebar: 'Left sidebar (whole)',
      regionSidebarSessions: 'Session list',
      regionSidebarPanels: 'Panel entries',
      regionSidebarSettings: 'Settings entry',
      regionCenter: 'Main panel',
      regionHeader: 'Session header',
      regionHeaderActions: 'Header actions',
      regionChat: 'Transcript',
      regionChatActions: 'Message actions',
      regionComposer: 'Composer',
      regionHeroWorkspace: 'Workspace picker',
      regionHeroPreset: 'Mode picker',
      regionComposerAttachments: 'Attachments',
      regionComposerModel: 'Model picker',
      regionComposerPermission: 'Permission picker',
      regionComposerPlan: 'Plan toggle',
      regionRightbar: 'Right panel',
      regionRightbarTabs: 'Right panel content',
      regionBottom: 'Bottom bar',
      regionLeading: 'Top controls',
      regionHandles: 'Resize handles',
      regionOverlay: 'Overlays & widgets',
      presetImmersive: 'Immersive',
      presetShowAll: 'Show all',
      shortcut: 'Toggle all regions',
      open: 'Open UI Visibility panel',
      close: 'Close UI Visibility panel',
      pluginSection: 'Plugin',
      pickElement: 'Pick element',
      pickHint: 'Click the element to hide · Esc to cancel',
      pickHintConfirm: 'Confirm this layer, or expand upward',
      pickCancel: 'Cancel',
      pickFailed: 'Could not mark that element; try a different spot',
      pickExpand: 'Expand upward',
      pickShrink: 'Back inward',
      pickHideOne: 'Hide only this',
      pickHideSimilar: 'Hide all similar',
      pickSimilarUnavailable: 'Not enough to match similar items',
      pickTargetPrefix: 'Current: ',
      pickSimilarBadge: 'similar',
      customSection: 'Picked elements',
      customEmpty: 'Nothing picked yet',
      clearPicked: 'Restore all',
      removePicked: 'Show again',
      dockButton: 'Floating button',
      dockHint: 'The panel trigger on the right edge',
      settingsNav: 'UI Visibility',
      settingsTitle: 'UI Visibility',
      settingsDesc: 'Show or hide each interface region. This page and the floating panel share one state.',
      settingsHint: 'With the floating button hidden, restore it here or with ⌘⇧H / Ctrl+Shift+H.',
      shortcutHint: 'Shortcut: show / hide every region',
    };

    const REGION_LABELS = Object.fromEntries(REGIONS.map((region) => [region.id, region.label]));

    /** The immersive preset keeps only the transcript and composer visible. */
    const IMMERSIVE_HIDDEN = ['sidebar', 'header', 'rightbar', 'bottom', 'leading', 'handles', 'overlay'];

    const CSS = String.raw`
[data-dsh-uiv-dock] {
  position: fixed;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  z-index: 60;
  pointer-events: auto;
  font-family: var(--dsw-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
}
[data-dsh-uiv-dock] * { box-sizing: border-box; }

.dsh-uiv-toggle {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-secondary);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.dsh-uiv-toggle:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-uiv-toggle[aria-expanded="true"] {
  color: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-uiv-toggle:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.dsh-uiv-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--dsw-alias-brand-primary);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  line-height: 17px;
  text-align: center;
}

.dsh-uiv-panel {
  position: absolute;
  top: 50%;
  right: calc(100% + 10px);
  transform: translateY(-50%);
  width: 278px;
  max-width: calc(100vw - 76px);
  max-height: min(78vh, 640px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
}
.dsh-uiv-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 2px 4px 6px;
}
.dsh-uiv-heading { flex: 1; min-width: 0; }
.dsh-uiv-title { font-size: 13px; font-weight: 600; }
.dsh-uiv-sub {
  margin-top: 1px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}
.dsh-uiv-close {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dsh-uiv-close:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-uiv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 30px;
  padding: 0 4px;
  border-radius: 8px;
}
.dsh-uiv-row:hover { background: var(--dsw-alias-bg-layer-2); }
.dsh-uiv-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-uiv-row--master .dsh-uiv-label { font-weight: 600; }
.dsh-uiv-sep { height: 1px; margin: 6px 4px; background: var(--dsw-alias-border-l1); }
.dsh-uiv-section {
  padding: 4px 4px 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
.dsh-uiv-group { margin-bottom: 2px; }
.dsh-uiv-group:last-child { margin-bottom: 0; }
.dsh-uiv-switch {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l1);
  cursor: pointer;
  transition: background 0.15s;
}
.dsh-uiv-switch[aria-checked="true"] {
  background: var(--dsw-alias-brand-primary);
  box-shadow: none;
}
.dsh-uiv-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
}
.dsh-uiv-switch[aria-checked="true"]::after { transform: translateX(14px); }
.dsh-uiv-switch:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.dsh-uiv-actions { display: flex; gap: 6px; padding: 8px 4px 0; }
.dsh-uiv-action {
  flex: 1;
  min-height: 28px;
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.dsh-uiv-action:hover { background: var(--dsw-alias-bg-layer-1); }
.dsh-uiv-action--accent {
  color: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-uiv-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 4px 2px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
.dsh-uiv-kbd {
  padding: 0 4px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 4px;
  font-family: inherit;
  font-size: 10px;
  line-height: 16px;
}
.dsh-uiv-page { max-width: 680px; padding: 4px 0 24px; }
.dsh-uiv-pageTitle { font-size: 16px; font-weight: 600; line-height: 24px; }
.dsh-uiv-pageDesc {
  margin: 2px 0 10px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-uiv-pageHint {
  padding: 8px 4px 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}
.dsh-uiv-empty {
  padding: 2px 4px 4px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}
.dsh-uiv-remove {
  flex: none;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}
.dsh-uiv-remove:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-uiv-pickbar {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 2147483646;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  max-width: min(92vw, 560px);
}
.dsh-uiv-pickbar--confirm {
  flex-direction: column;
  align-items: stretch;
  border-radius: 16px;
  gap: 8px;
  padding: 10px 12px;
}
.dsh-uiv-picktarget {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-uiv-pickhint {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}
.dsh-uiv-pickactions { display: flex; flex-wrap: wrap; gap: 6px; }
.dsh-uiv-pickactions .dsh-uiv-action { flex: 1 1 auto; min-width: 0; }
.dsh-uiv-pickcancel {
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}
.dsh-uiv-pickcancel:hover { background: var(--dsw-alias-bg-layer-2); }
.dsh-uiv-action:disabled,
.dsh-uiv-pickcancel:disabled {
  opacity: 0.45;
  cursor: default;
}
.dsh-uiv-highlight {
  position: fixed;
  pointer-events: none;
  z-index: 2147483645;
  border: 2px solid #4d6bfe;
  background: rgba(77, 107, 254, 0.12);
  box-sizing: border-box;
  display: none;
}
html[data-dsh-uiv-picking],
html[data-dsh-uiv-picking] * { cursor: crosshair !important; }
html[data-dsh-uiv-picking] [data-dsh-uiv-picker],
html[data-dsh-uiv-picking] [data-dsh-uiv-picker] * { cursor: pointer !important; }

html[data-dsh-uiv] [data-dsh-uiv-frame] > [data-dsh-uiv-region="sidebar"] { grid-column: 1; grid-row: 1; }
html[data-dsh-uiv] [data-dsh-uiv-frame] > [data-dsh-uiv-region="center"] { grid-column: 2; grid-row: 1; }
html[data-dsh-uiv] [data-dsh-uiv-frame] > [data-dsh-uiv-region="rightbar"] { grid-column: 3; grid-row: 1; }
html[data-dsh-uiv-grid] [data-dsh-uiv-frame] { grid-template-columns: var(--dsh-uiv-grid) !important; }

html[data-dsh-uiv-hide~="sidebar"] [data-dsh-uiv-region="sidebar"],
html[data-dsh-uiv-hide~="center"] [data-dsh-uiv-region="center"],
html[data-dsh-uiv-hide~="rightbar"] [data-dsh-uiv-region="rightbar"],
html[data-dsh-uiv-hide~="bottom"] [data-shell-bottom],
html[data-dsh-uiv-hide~="leading"] [data-shell-leading],
html[data-dsh-uiv-hide~="handles"] [data-side],
html[data-dsh-uiv-hide~="handles"] [data-width-handle],
html[data-dsh-uiv-hide~="sidebar"] [data-side="sidebar"],
html[data-dsh-uiv-hide~="rightbar"] [data-side="rightbar"],
html[data-dsh-uiv-hide~="header"] [data-dsh-uiv-region="center"] [data-phase] > header,
html[data-dsh-uiv-hide~="chat"] [data-dsh-uiv-region="center"] [data-conversation-scroll] > :not([data-composer-seat]),
html[data-dsh-uiv-hide~="composer"] [data-dsh-uiv-region="center"] [data-composer-seat],
html[data-dsh-uiv-hide~="overlay"] [data-shell-overlay] > [data-slot="shell.overlay"] > :not([data-dsh-uiv-dock]):not([data-dsh-uiv-picker]) {
  display: none !important;
}

/* Fine-grained regions: each targets one stable slot anchor (display:contents wrapper). */
html[data-dsh-uiv-hide~="sidebarSessions"] [data-slot="sidebar.workspaces"],
html[data-dsh-uiv-hide~="sidebarPanels"] [data-slot="sidebar.panellist"],
html[data-dsh-uiv-hide~="sidebarSettings"] [data-slot="sidebar.settings"],
html[data-dsh-uiv-hide~="headerActions"] [data-slot="conversation.session.header.actions"],
html[data-dsh-uiv-hide~="headerActions"] [data-slot="conversation.session.header.utilities"],
html[data-dsh-uiv-hide~="headerActions"] [data-slot="conversation.session.header.corner"],
html[data-dsh-uiv-hide~="chatActions"] [data-slot="conversation.chat.assistant-actions"],
html[data-dsh-uiv-hide~="composerAttachments"] [data-slot="conversation.input.attachments"],
html[data-dsh-uiv-hide~="composerModel"] [data-slot="conversation.input.model"],
html[data-dsh-uiv-hide~="composerPermission"] [data-slot="conversation.input.permission"],
html[data-dsh-uiv-hide~="composerPlan"] [data-slot="conversation.input.plan"],
html[data-dsh-uiv-hide~="rightbarTabs"] [data-slot="sidebar.right.pane.tab"],
html[data-dsh-uiv-hide~="heroWorkspace"] [data-slot="conversation.hero.workspace"],
html[data-dsh-uiv-hide~="heroPreset"] [data-slot="conversation.hero.agentPreset"] {
  display: none !important;
}
`;

    function sanitizeHidden(value) {
      if (!Array.isArray(value)) return new Set();
      return new Set(value.filter((id) => REGION_IDS.includes(id)));
    }

    /* <pick-utils> */
    const PICK_ATTR = 'data-dsh-uiv-pick';
    const PICK_ID_RE = /^uiv-[a-z0-9]+$/;
    const MAX_CUSTOM = 60;
    /* Forbid CSS-breaking / injection characters. The child combinator '>' is allowed so legacy path selectors stay valid. */
    const FORBIDDEN_SELECTOR = /[{}<\\]/;
    const GENERIC_TAGS = new Set([
      'div',
      'span',
      'p',
      'i',
      'b',
      'em',
      'strong',
      'section',
      'article',
      'main',
      'header',
      'footer',
      'ul',
      'ol',
      'li',
      'nav',
      'a',
    ]);
    const CHROME_SELECTOR = '[data-dsh-uiv-dock], [data-dsh-uiv-picker], [data-dsh-uiv-highlight]';

    function cssAttrValue(value) {
      return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function randomPickId(existing) {
      const bytes = new Uint8Array(6);
      for (let attempt = 0; attempt < 8; attempt += 1) {
        if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
          crypto.getRandomValues(bytes);
        } else {
          for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
        }
        const id = `uiv-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
        if (!existing || !existing.has(id)) return id;
      }
      return `uiv-${Date.now().toString(16)}`;
    }

    function hideSelectorForPickId(pickId) {
      if (!PICK_ID_RE.test(pickId)) return null;
      return `[${PICK_ATTR}="${pickId}"]`;
    }

    function isSafeAttr(value) {
      return (
        typeof value === 'string' &&
        value !== '' &&
        value.length <= 80 &&
        !FORBIDDEN_SELECTOR.test(value)
      );
    }

    function isSafeTag(value) {
      return typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
    }

    function sanitizePath(path) {
      if (!Array.isArray(path)) return null;
      const out = [];
      for (const step of path) {
        if (step === null || typeof step !== 'object') return null;
        if (step.kind === 'shadow') {
          out.push({ kind: 'shadow' });
          continue;
        }
        if (step.kind !== 'node') return null;
        const tag = typeof step.tag === 'string' ? step.tag.toLowerCase().trim() : '';
        if (!isSafeTag(tag)) return null;
        const index = Number.isInteger(step.index) && step.index >= 1 && step.index <= 9999 ? step.index : 0;
        if (index < 1) return null;
        const clean = { kind: 'node', tag, index };
        for (const key of ['id', 'slot', 'region', 'role', 'type', 'name', 'aria', 'title']) {
          if (isSafeAttr(step[key])) clean[key] = step[key];
        }
        out.push(clean);
      }
      return out.length > 0 && out.length <= 40 ? out : null;
    }

    function sanitizeSimilar(value) {
      if (value === null || typeof value !== 'object') return null;
      const tag = typeof value.tag === 'string' ? value.tag.toLowerCase().trim() : '';
      if (!isSafeTag(tag)) return null;
      const out = { tag };
      for (const key of ['slot', 'role', 'type', 'name', 'aria', 'title']) {
        if (isSafeAttr(value[key])) out[key] = value[key];
      }
      if (Number.isInteger(value.nth) && value.nth >= 1 && value.nth <= 99) out.nth = value.nth;
      if (value.parent !== null && typeof value.parent === 'object') {
        const parentTag = typeof value.parent.tag === 'string' ? value.parent.tag.toLowerCase().trim() : '';
        if (isSafeTag(parentTag)) {
          const parent = { tag: parentTag };
          for (const key of ['slot', 'role', 'aria']) {
            if (isSafeAttr(value.parent[key])) parent[key] = value.parent[key];
          }
          out.parent = parent;
        }
      }
      return out;
    }

    function sanitizeCustom(value) {
      if (!Array.isArray(value)) return [];
      const seen = new Set();
      const out = [];
      for (const entry of value) {
        if (entry === null || typeof entry !== 'object') continue;
        const selector = typeof entry.selector === 'string' ? entry.selector.trim() : '';
        if (selector === '' || FORBIDDEN_SELECTOR.test(selector) || seen.has(selector)) continue;
        seen.add(selector);
        const item = {
          selector,
          label: typeof entry.label === 'string' ? entry.label.slice(0, 60) : selector,
        };
        const pickId = typeof entry.pickId === 'string' ? entry.pickId : '';
        if (PICK_ID_RE.test(pickId)) {
          item.pickId = pickId;
          const path = sanitizePath(entry.path);
          if (path !== null) item.path = path;
          if (entry.mode === 'similar' || entry.mode === 'single') item.mode = entry.mode;
          const similar = sanitizeSimilar(entry.similar);
          if (similar !== null) item.similar = similar;
        }
        out.push(item);
        if (out.length >= MAX_CUSTOM) break;
      }
      return out;
    }

    function isElementNode(node) {
      return node !== null && typeof node === 'object' && node.nodeType === 1 && typeof node.tagName === 'string';
    }

    function collectChildren(parent) {
      if (parent === null || typeof parent !== 'object') return [];
      if (parent.children !== undefined) return Array.from(parent.children);
      if (parent.childNodes !== undefined) {
        return Array.from(parent.childNodes).filter((node) => node && node.nodeType === 1);
      }
      return [];
    }

    function elementIndex(node) {
      const parent = node.parentElement || node.parentNode;
      if (parent === null || parent === undefined) return 1;
      return collectChildren(parent).indexOf(node) + 1 || 1;
    }

    function describeNode(node) {
      const step = { kind: 'node', tag: node.tagName.toLowerCase(), index: elementIndex(node) };
      const id = node.getAttribute('id');
      if (typeof id === 'string' && /^[A-Za-z][\w:.-]{0,79}$/.test(id)) step.id = id;
      const slot = node.getAttribute('data-slot');
      if (isSafeAttr(slot)) step.slot = slot.slice(0, 80);
      const region = node.getAttribute('data-dsh-uiv-region');
      if (isSafeAttr(region)) step.region = region.slice(0, 80);
      const role = node.getAttribute('role');
      if (isSafeAttr(role)) step.role = role.slice(0, 80);
      const type = node.getAttribute('type');
      if (isSafeAttr(type)) step.type = type.slice(0, 80);
      const name = node.getAttribute('name');
      if (isSafeAttr(name)) step.name = name.slice(0, 80);
      const aria = node.getAttribute('aria-label');
      if (isSafeAttr(aria) && aria.trim() !== '') step.aria = aria.trim().slice(0, 80);
      const title = node.getAttribute('title');
      if (isSafeAttr(title) && title.trim() !== '') step.title = title.trim().slice(0, 80);
      return step;
    }

    function buildPath(element, documentRef) {
      if (!isElementNode(element)) return null;
      const doc = documentRef || element.ownerDocument;
      if (doc === null || doc === undefined) return null;
      if (element === doc.body || element === doc.documentElement) return null;
      const steps = [];
      let node = element;
      let guard = 0;
      while (isElementNode(node) && node !== doc.documentElement && guard < 40) {
        guard += 1;
        steps.push(describeNode(node));
        if (node.parentElement !== null && node.parentElement !== undefined) {
          node = node.parentElement;
          continue;
        }
        const root = typeof node.getRootNode === 'function' ? node.getRootNode() : null;
        if (root !== null && root !== doc && root.host !== undefined && root.host !== null) {
          steps.push({ kind: 'shadow' });
          node = root.host;
          continue;
        }
        break;
      }
      steps.reverse();
      return sanitizePath(steps);
    }

    function attrsCompatible(el, step, ignoreId) {
      if (!ignoreId && step.id && el.getAttribute('id') !== step.id) return false;
      if (step.slot && el.getAttribute('data-slot') !== step.slot) return false;
      if (step.region && el.getAttribute('data-dsh-uiv-region') !== step.region) return false;
      if (step.role && el.getAttribute('role') !== step.role) return false;
      if (step.type && el.getAttribute('type') !== step.type) return false;
      if (step.name && el.getAttribute('name') !== step.name) return false;
      if (step.aria && (el.getAttribute('aria-label') || '').trim() !== step.aria) return false;
      if (step.title && (el.getAttribute('title') || '').trim() !== step.title) return false;
      return true;
    }

    function findChild(parent, step) {
      const children = collectChildren(parent);
      const sameTag = children.filter(
        (el) => isElementNode(el) && el.tagName.toLowerCase() === step.tag,
      );
      if (step.id) {
        const byId = children.filter((el) => isElementNode(el) && el.getAttribute('id') === step.id);
        if (byId.length === 1) return byId[0];
      }
      if (step.slot) {
        const bySlot = children.filter(
          (el) => isElementNode(el) && el.getAttribute('data-slot') === step.slot,
        );
        if (bySlot.length === 1) return bySlot[0];
      }
      const identified = sameTag.filter((el) => attrsCompatible(el, step, true));
      if (identified.length === 1) return identified[0];
      const atIndex = children[step.index - 1];
      if (isElementNode(atIndex) && atIndex.tagName.toLowerCase() === step.tag) return atIndex;
      if (identified.length > 1 && identified.includes(atIndex)) return atIndex;
      return identified[0] || null;
    }

    function resolvePath(path, documentRef) {
      const sanitized = sanitizePath(path);
      if (sanitized === null || documentRef === null || documentRef === undefined) return null;
      let current = documentRef.documentElement || documentRef;
      for (const step of sanitized) {
        if (step.kind === 'shadow') {
          if (!isElementNode(current) || current.shadowRoot === null || current.shadowRoot === undefined) {
            return null;
          }
          current = current.shadowRoot;
          continue;
        }
        const found = findChild(current, step);
        if (found === null) return null;
        current = found;
      }
      return isElementNode(current) ? current : null;
    }

    function similarSignature(element) {
      if (!isElementNode(element)) return null;
      const sig = { tag: element.tagName.toLowerCase() };
      const slot = element.getAttribute('data-slot');
      if (isSafeAttr(slot)) sig.slot = slot.slice(0, 80);
      const role = element.getAttribute('role');
      if (isSafeAttr(role)) sig.role = role.slice(0, 80);
      const type = element.getAttribute('type');
      if (isSafeAttr(type)) sig.type = type.slice(0, 80);
      const name = element.getAttribute('name');
      if (isSafeAttr(name)) sig.name = name.slice(0, 80);
      const aria = element.getAttribute('aria-label');
      if (isSafeAttr(aria) && aria.trim() !== '') sig.aria = aria.trim().slice(0, 80);
      const title = element.getAttribute('title');
      if (isSafeAttr(title) && title.trim() !== '') sig.title = title.trim().slice(0, 80);
      const hasIdentity = sig.slot !== undefined || sig.aria !== undefined || sig.title !== undefined || sig.name !== undefined || sig.role !== undefined;
      if (!hasIdentity) {
        const parent = element.parentElement;
        if (isElementNode(parent)) {
          const sibs = collectChildren(parent).filter(
            (el) => isElementNode(el) && el.tagName.toLowerCase() === sig.tag,
          );
          const nth = sibs.indexOf(element) + 1;
          if (nth >= 1) sig.nth = nth;
          sig.parent = { tag: parent.tagName.toLowerCase() };
          const parentSlot = parent.getAttribute('data-slot');
          if (isSafeAttr(parentSlot)) sig.parent.slot = parentSlot.slice(0, 80);
          const parentRole = parent.getAttribute('role');
          if (isSafeAttr(parentRole)) sig.parent.role = parentRole.slice(0, 80);
          const parentAria = parent.getAttribute('aria-label');
          if (isSafeAttr(parentAria) && parentAria.trim() !== '') sig.parent.aria = parentAria.trim().slice(0, 80);
        }
      }
      return sanitizeSimilar(sig);
    }

    function signatureMatches(el, sig) {
      const match = sanitizeSimilar(sig);
      if (match === null || !isElementNode(el)) return false;
      if (el.tagName.toLowerCase() !== match.tag) return false;
      if (match.slot !== undefined && el.getAttribute('data-slot') !== match.slot) return false;
      if (match.role !== undefined && el.getAttribute('role') !== match.role) return false;
      if (match.type !== undefined && el.getAttribute('type') !== match.type) return false;
      if (match.name !== undefined && el.getAttribute('name') !== match.name) return false;
      if (match.aria !== undefined && (el.getAttribute('aria-label') || '').trim() !== match.aria) return false;
      if (match.title !== undefined && (el.getAttribute('title') || '').trim() !== match.title) return false;
      if (match.parent !== undefined) {
        const parent = el.parentElement;
        if (!isElementNode(parent) || parent.tagName.toLowerCase() !== match.parent.tag) return false;
        if (match.parent.slot !== undefined && parent.getAttribute('data-slot') !== match.parent.slot) return false;
        if (match.parent.role !== undefined && parent.getAttribute('role') !== match.parent.role) return false;
        if (match.parent.aria !== undefined && (parent.getAttribute('aria-label') || '').trim() !== match.parent.aria) return false;
        if (match.nth !== undefined) {
          const sibs = collectChildren(parent).filter(
            (child) => isElementNode(child) && child.tagName.toLowerCase() === match.tag,
          );
          if (sibs.indexOf(el) + 1 !== match.nth) return false;
        }
      }
      return true;
    }

    function similarIsSpecific(sig) {
      const match = sanitizeSimilar(sig);
      if (match === null) return false;
      if (match.slot !== undefined || match.aria !== undefined || match.title !== undefined || match.name !== undefined || match.role !== undefined) {
        return true;
      }
      if (!GENERIC_TAGS.has(match.tag)) return true;
      if (match.parent !== undefined && (match.parent.slot !== undefined || match.parent.role !== undefined || match.parent.aria !== undefined)) {
        return true;
      }
      return false;
    }

    function walkElements(root, visit) {
      if (root === null || root === undefined) return;
      const queue = [];
      if (isElementNode(root)) queue.push(root);
      else if (root.documentElement) queue.push(root.documentElement);
      else {
        for (const child of collectChildren(root)) queue.push(child);
      }
      const seen = new Set();
      while (queue.length > 0) {
        const node = queue.shift();
        if (!isElementNode(node) || seen.has(node)) continue;
        seen.add(node);
        visit(node);
        for (const child of collectChildren(node)) queue.push(child);
        if (node.shadowRoot !== null && node.shadowRoot !== undefined) {
          for (const child of collectChildren(node.shadowRoot)) queue.push(child);
        }
      }
    }

    function collectOpenRoots(documentRef) {
      const roots = [];
      if (documentRef === null || documentRef === undefined) return roots;
      roots.push(documentRef);
      walkElements(documentRef, (el) => {
        if (el.shadowRoot !== null && el.shadowRoot !== undefined) roots.push(el.shadowRoot);
      });
      return roots;
    }

    function findSimilar(documentRef, sig) {
      const match = sanitizeSimilar(sig);
      if (match === null) return [];
      const matches = [];
      walkElements(documentRef, (el) => {
        if (signatureMatches(el, match)) matches.push(el);
      });
      return matches;
    }

    function isPluginChrome(node) {
      if (!isElementNode(node) || typeof node.closest !== 'function') return false;
      return node.closest(CHROME_SELECTOR) !== null;
    }

    function isRootShell(node, doc) {
      if (!isElementNode(node) || doc === null || doc === undefined) return false;
      return node === doc.body || node === doc.documentElement;
    }

    function eventPickTarget(event) {
      if (event === null || typeof event !== 'object') return null;
      const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
      let first = null;
      for (const node of path) {
        if (!isElementNode(node)) continue;
        if (isPluginChrome(node)) return null;
        if (first === null) first = node;
      }
      if (first === null) return null;
      const doc = first.ownerDocument;
      if (isRootShell(first, doc)) return null;
      return first;
    }

    function expandableParent(element, documentRef) {
      if (!isElementNode(element)) return null;
      const doc = documentRef || element.ownerDocument;
      const parent = element.parentElement;
      if (isElementNode(parent) && !isRootShell(parent, doc) && !isPluginChrome(parent)) return parent;
      const root = typeof element.getRootNode === 'function' ? element.getRootNode() : null;
      if (root !== null && isElementNode(root.host) && !isRootShell(root.host, doc) && !isPluginChrome(root.host)) {
        return root.host;
      }
      return null;
    }

    const pickUtils = {
      PICK_ATTR,
      PICK_ID_RE,
      MAX_CUSTOM,
      FORBIDDEN_SELECTOR,
      cssAttrValue,
      randomPickId,
      hideSelectorForPickId,
      sanitizePath,
      sanitizeSimilar,
      sanitizeCustom,
      isElementNode,
      describeNode,
      buildPath,
      resolvePath,
      similarSignature,
      signatureMatches,
      similarIsSpecific,
      collectOpenRoots,
      findSimilar,
      isPluginChrome,
      eventPickTarget,
      expandableParent,
      walkElements,
    };
    /* </pick-utils> */

    /** Read the durable state, migrating the flat v1 array and applying install defaults. */
    function loadState() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return {
              hidden: sanitizeHidden(parsed.hidden),
              dock: parsed.dock !== false,
              custom: sanitizeCustom(parsed.custom),
            };
          }
        }
        const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy !== null) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed)) {
            const migrated = { hidden: sanitizeHidden(parsed), dock: true, custom: [] };
            persistState(migrated);
            window.localStorage.removeItem(LEGACY_STORAGE_KEY);
            return migrated;
          }
        }
      } catch {
        /* Unreadable storage falls through to the install defaults. */
      }
      return { hidden: new Set(DEFAULT_HIDDEN), dock: DEFAULT_DOCK, custom: [] };
    }

    function persistState(state) {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            hidden: REGION_IDS.filter((id) => state.hidden.has(id)),
            dock: state.dock,
            custom: state.custom,
          }),
        );
      } catch {
        /* Storage can be unavailable; the panel keeps working for this page. */
      }
    }

    /** Picked elements hide through one owned stylesheet, not through inline styles. */
    function syncCustomStyle(custom) {
      const existing = document.querySelector('style[data-dsh-uiv-custom]');
      if (custom.length === 0) {
        if (existing !== null) existing.remove();
        return;
      }
      let tag = existing;
      if (tag === null) {
        tag = document.createElement('style');
        tag.setAttribute('data-dsh-uiv-custom', '');
        document.head.append(tag);
      }
      tag.textContent = custom.map((entry) => `${entry.selector}{display:none !important}`).join('\n');
    }

    const SHADOW_STYLE_ATTR = 'data-dsh-uiv-custom-shadow';
    const SHADOW_HIDE_RULE = `[${PICK_ATTR}]{display:none !important}`;

    function syncShadowStyles(documentRef, needed) {
      const doc = documentRef;
      for (const root of collectOpenRoots(doc)) {
        if (root === doc || typeof root.querySelector !== 'function') continue;
        let tag = null;
        try {
          tag = root.querySelector(`style[${SHADOW_STYLE_ATTR}]`);
        } catch {
          continue;
        }
        if (!needed) {
          if (tag !== null) tag.remove();
          continue;
        }
        if (tag === null) {
          tag = doc.createElement('style');
          tag.setAttribute(SHADOW_STYLE_ATTR, '');
          tag.textContent = SHADOW_HIDE_RULE;
          root.appendChild(tag);
        } else if (tag.textContent !== SHADOW_HIDE_RULE) {
          tag.textContent = SHADOW_HIDE_RULE;
        }
      }
    }

    function applyEntryMarks(documentRef, entry) {
      if (typeof entry.pickId !== 'string') return;
      let targets = [];
      if (entry.mode === 'similar' && entry.similar !== undefined) {
        targets = findSimilar(documentRef, entry.similar);
      } else if (entry.path !== undefined) {
        const el = resolvePath(entry.path, documentRef);
        if (el !== null) targets = [el];
      }
      for (const el of targets) {
        if (isPluginChrome(el)) continue;
        if (el === documentRef.body || el === documentRef.documentElement) continue;
        el.setAttribute(PICK_ATTR, entry.pickId);
      }
    }

    function syncPickedDom(custom, documentRef) {
      const doc = documentRef || (typeof document !== 'undefined' ? document : null);
      if (doc === null || doc === undefined) return;
      const ids = new Set();
      for (const entry of custom) {
        if (typeof entry.pickId === 'string') ids.add(entry.pickId);
      }
      walkElements(doc, (el) => {
        const id = el.getAttribute(PICK_ATTR);
        if (id !== null && !ids.has(id)) el.removeAttribute(PICK_ATTR);
      });
      for (const entry of custom) applyEntryMarks(doc, entry);
      syncShadowStyles(doc, ids.size > 0);
    }

    function startPickObserver(documentRef) {
      const doc = documentRef || document;
      const root = doc.documentElement || doc;
      const observed = new WeakSet();
      let timer = 0;
      const observer = new MutationObserver(() => schedule());
      const attach = (node) => {
        if (node === null || node === undefined || observed.has(node)) return;
        if (typeof node.nodeType !== 'number') return;
        observed.add(node);
        observer.observe(node, { childList: true, subtree: true });
      };
      const run = () => {
        timer = 0;
        for (const tree of collectOpenRoots(doc)) {
          if (tree !== doc) attach(tree);
        }
        syncPickedDom(visibility.get().custom, doc);
      };
      const schedule = () => {
        if (timer !== 0) return;
        timer = setTimeout(run, 50);
      };
      attach(root);
      run();
      return () => {
        if (timer !== 0) clearTimeout(timer);
        observer.disconnect();
      };
    }

    /**
     * One observable state shared by the floating dock and the Settings page:
     * both mount in different roots but always agree.
     */
    function createVisibilityStore() {
      let state = { ...loadState(), picking: false };
      syncCustomStyle(state.custom);
      syncPickedDom(state.custom);
      const listeners = new Set();
      const commit = (next) => {
        state = next;
        persistState(state);
        syncCustomStyle(state.custom);
        syncPickedDom(state.custom);
        for (const listener of listeners) listener();
      };
      return {
        get: () => state,
        subscribe: (listener) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        toggleRegion: (id) => {
          const hidden = new Set(state.hidden);
          if (hidden.has(id)) hidden.delete(id);
          else hidden.add(id);
          commit({ ...state, hidden });
        },
        setHidden: (hidden) => commit({ ...state, hidden: new Set(hidden) }),
        /** Hide every region, or show every region and the button that hides them. */
        setAll: (allHidden) =>
          commit(allHidden ? { ...state, hidden: new Set(REGION_IDS) } : { ...state, hidden: new Set(), dock: true }),
        setDock: (dock) => commit({ ...state, dock }),
        addCustom: (entry) => commit({ ...state, custom: sanitizeCustom([...state.custom, entry]) }),
        removeCustom: (selector) => commit({ ...state, custom: state.custom.filter((entry) => entry.selector !== selector) }),
        clearCustom: () => commit({ ...state, custom: [] }),
        startPicking: () => commit({ ...state, picking: true }),
        stopPicking: () => commit({ ...state, picking: false }),
      };
    }

    const visibility = createVisibilityStore();

    function useVisibility() {
      const [state, setState] = React.useState(visibility.get);
      React.useEffect(() => {
        const unsubscribe = visibility.subscribe(() => setState(visibility.get()));
        /* Catch a commit that landed between this render and the subscription. */
        setState(visibility.get());
        return unsubscribe;
      }, []);
      return state;
    }

    function labelFor(element) {
      for (const name of ['aria-label', 'title']) {
        const value = element.getAttribute(name);
        if (value !== null && value.trim() !== '') return value.trim().slice(0, 40);
      }
      const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (text !== '') return text.slice(0, 40);
      const slot = element.getAttribute('data-slot');
      if (slot !== null) return slot;
      return element.tagName.toLowerCase();
    }

    /** Mark the shipped frame and its top-level regions with our own data attributes. */
    function tagFrame(frame) {
      if (frame === null) return;
      frame.setAttribute('data-dsh-uiv-frame', '');
      const children = Array.from(frame.children);
      for (const el of children) {
        if (el.hasAttribute('data-dsh-uiv-region')) continue;
        if (el.hasAttribute('data-shell-overlay')) el.setAttribute('data-dsh-uiv-region', 'overlay');
        else if (el.hasAttribute('data-shell-bottom')) el.setAttribute('data-dsh-uiv-region', 'bottom');
        else if (el.hasAttribute('data-shell-leading')) el.setAttribute('data-dsh-uiv-region', 'leading');
        else if (el.hasAttribute('data-rightbar-col')) el.setAttribute('data-dsh-uiv-region', 'rightbar');
        else if (el.hasAttribute('data-side')) el.setAttribute('data-dsh-uiv-region', 'handle');
      }
      /* The two remaining column boxes keep the frame's own order: sidebar, then center.
         Re-tagging stays correct when only one of the two boxes is replaced. */
      const tagged = new Set(
        children.map((el) => el.getAttribute('data-dsh-uiv-region')).filter((region) => region !== null),
      );
      const rest = children.filter((el) => !el.hasAttribute('data-dsh-uiv-region'));
      if (!tagged.has('sidebar') && !tagged.has('center')) {
        if (rest[0] !== undefined) rest[0].setAttribute('data-dsh-uiv-region', 'sidebar');
        if (rest[1] !== undefined) rest[1].setAttribute('data-dsh-uiv-region', 'center');
      } else if (!tagged.has('sidebar') && rest[0] !== undefined) {
        rest[0].setAttribute('data-dsh-uiv-region', 'sidebar');
      } else if (!tagged.has('center') && rest[0] !== undefined) {
        rest[0].setAttribute('data-dsh-uiv-region', 'center');
      }
    }

    function readTracks(frame) {
      const inline = frame.style.gridTemplateColumns.trim();
      const direct = /^([\d.]+px)\s+(minmax\([^)]*\))\s+(minmax\([^)]*\))$/.exec(inline);
      if (direct !== null) return [direct[1], direct[2], direct[3]];
      if (document.documentElement.hasAttribute('data-dsh-uiv-grid')) return null;
      const computed = window.getComputedStyle(frame).gridTemplateColumns.trim().split(/\s+/);
      if (computed.length !== 3) return null;
      return computed.every((value) => /^[\d.]+px$/.test(value)) ? computed : null;
    }

    /** Keep the frame's three tracks but collapse the ones whose column is hidden. */
    function syncGrid(frame, hidden) {
      if (frame === null) return;
      const root = document.documentElement;
      const needs = hidden.has('sidebar') || hidden.has('center') || hidden.has('rightbar');
      if (!needs) {
        frame.style.removeProperty('--dsh-uiv-grid');
        root.removeAttribute('data-dsh-uiv-grid');
        return;
      }
      const tracks = readTracks(frame);
      if (tracks === null) {
        frame.style.removeProperty('--dsh-uiv-grid');
        root.removeAttribute('data-dsh-uiv-grid');
        return;
      }
      const value = [
        hidden.has('sidebar') ? '0px' : tracks[0],
        hidden.has('center') ? '0px' : tracks[1],
        hidden.has('rightbar') ? '0px' : tracks[2],
      ].join(' ');
      if (frame.style.getPropertyValue('--dsh-uiv-grid') !== value) {
        frame.style.setProperty('--dsh-uiv-grid', value);
      }
      root.setAttribute('data-dsh-uiv-grid', '');
    }

    function applyHidden(hidden) {
      const root = document.documentElement;
      if (hidden.size === 0) root.removeAttribute('data-dsh-uiv-hide');
      else root.setAttribute('data-dsh-uiv-hide', REGION_IDS.filter((id) => hidden.has(id)).join(' '));
    }

    function EyeIcon() {
      return h(
        'svg',
        { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinejoin: 'round',
        }),
        h('circle', { cx: 12, cy: 12, r: 3.1, fill: 'currentColor' }),
      );
    }

    function EyeOffIcon() {
      return h(
        'svg',
        { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'M3.5 8.6C5.9 6 8.7 4.7 12 4.7c1.4 0 2.7 0.4 3.9 1',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M20.5 8.6c-2.4 2.6-5.2 3.9-8.5 3.9-1.4 0-2.7-0.4-3.9-1',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M12 16.1c-2.3 0-4.3-0.9-6-2.7',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'm4.5 4.5 15 15',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
        }),
      );
    }

    function CloseIcon() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'm3.5 3.5 7 7m0-7-7 7',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
        }),
      );
    }

    function Switch(props) {
      return h('button', {
        type: 'button',
        role: 'switch',
        className: 'dsh-uiv-switch',
        'aria-checked': props.checked,
        'aria-label': props.label,
        onClick: props.onToggle,
      });
    }

    /** One switch per region, grouped by interface area. */
    function RegionSwitches({ t, hidden, onToggle }) {
      return GROUPS.map((group) =>
        h(
          'div',
          { className: 'dsh-uiv-group', key: group },
          h('div', { className: 'dsh-uiv-section' }, t(group)),
          REGIONS.filter((region) => region.group === group).map((region) =>
            h(
              'div',
              { className: 'dsh-uiv-row', key: region.id },
              h('span', { className: 'dsh-uiv-label' }, t(region.label)),
              h(Switch, {
                checked: !hidden.has(region.id),
                label: t(region.label),
                onToggle: () => onToggle(region.id),
              }),
            ),
          ),
        ),
      );
    }

    function syncHighlightBox(box, target) {
      if (box === null) return;
      if (!isElementNode(target) || typeof target.getBoundingClientRect !== 'function') {
        box.style.display = 'none';
        return;
      }
      const rect = target.getBoundingClientRect();
      box.style.display = 'block';
      box.style.top = `${rect.top}px`;
      box.style.left = `${rect.left}px`;
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
    }

    /** Bottom hint bar plus the capture-phase listeners that turn a click into a marked node. */
    function PickerOverlay({ t }) {
      const { picking } = useVisibility();
      const [failed, setFailed] = React.useState(false);
      const [hover, setHover] = React.useState(null);
      const [candidate, setCandidate] = React.useState(null);
      const [stack, setStack] = React.useState([]);
      const highlightRef = React.useRef(null);
      const candidateRef = React.useRef(null);
      const hoverRef = React.useRef(null);
      candidateRef.current = candidate;
      hoverRef.current = hover;
      const current = candidate !== null ? candidate : hover;

      React.useEffect(() => {
        if (!picking) {
          setFailed(false);
          setHover(null);
          setCandidate(null);
          setStack([]);
          return undefined;
        }
        const box = document.createElement('div');
        box.setAttribute('data-dsh-uiv-highlight', '');
        box.className = 'dsh-uiv-highlight';
        document.body.append(box);
        highlightRef.current = box;
        const paint = () => syncHighlightBox(box, candidateRef.current || hoverRef.current);
        const onOver = (event) => {
          if (candidateRef.current !== null) return;
          setHover(eventPickTarget(event));
        };
        const onClick = (event) => {
          const target = eventPickTarget(event);
          if (target === null) return;
          event.preventDefault();
          event.stopPropagation();
          setFailed(false);
          setCandidate(target);
          setStack([]);
        };
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          event.stopPropagation();
          if (candidateRef.current !== null) {
            setCandidate(null);
            setStack([]);
            return;
          }
          visibility.stopPicking();
        };
        document.documentElement.setAttribute('data-dsh-uiv-picking', '');
        document.addEventListener('pointerover', onOver, true);
        document.addEventListener('click', onClick, true);
        document.addEventListener('keydown', onKeyDown, true);
        window.addEventListener('scroll', paint, true);
        window.addEventListener('resize', paint);
        paint();
        return () => {
          document.documentElement.removeAttribute('data-dsh-uiv-picking');
          document.removeEventListener('pointerover', onOver, true);
          document.removeEventListener('click', onClick, true);
          document.removeEventListener('keydown', onKeyDown, true);
          window.removeEventListener('scroll', paint, true);
          window.removeEventListener('resize', paint);
          box.remove();
          highlightRef.current = null;
        };
      }, [picking]);

      React.useEffect(() => {
        syncHighlightBox(highlightRef.current, current);
      }, [current]);

      const confirm = (mode) => {
        if (!isElementNode(candidate)) return;
        const path = buildPath(candidate, document);
        if (path === null) {
          setFailed(true);
          return;
        }
        const existing = new Set();
        for (const entry of visibility.get().custom) {
          if (typeof entry.pickId === 'string') existing.add(entry.pickId);
        }
        const pickId = randomPickId(existing);
        const selector = hideSelectorForPickId(pickId);
        if (selector === null) {
          setFailed(true);
          return;
        }
        const entry = { selector, label: labelFor(candidate), pickId, path, mode };
        if (mode === 'similar') {
          const similar = similarSignature(candidate);
          if (similar === null || !similarIsSpecific(similar)) {
            setFailed(true);
            return;
          }
          entry.similar = similar;
        }
        visibility.addCustom(entry);
        visibility.stopPicking();
      };

      if (!picking) return null;
      const parent = candidate !== null ? expandableParent(candidate, document) : null;
      const canShrink = stack.length > 0;
      const similarOk = candidate !== null && similarIsSpecific(similarSignature(candidate));
      const label = candidate !== null ? labelFor(candidate) : '';

      return h(
        'div',
        {
          'data-dsh-uiv-picker': '',
          className: candidate !== null ? 'dsh-uiv-pickbar dsh-uiv-pickbar--confirm' : 'dsh-uiv-pickbar',
        },
        candidate === null
          ? [
              h('span', { key: 'hint' }, failed ? t('pickFailed') : t('pickHint')),
              h(
                'button',
                {
                  key: 'cancel',
                  type: 'button',
                  className: 'dsh-uiv-pickcancel',
                  onClick: () => visibility.stopPicking(),
                },
                t('pickCancel'),
              ),
            ]
          : [
              h(
                'div',
                { key: 'target', className: 'dsh-uiv-picktarget', title: label },
                t('pickTargetPrefix') + label,
              ),
              h('div', { key: 'hint', className: 'dsh-uiv-pickhint' }, failed ? t('pickFailed') : t('pickHintConfirm')),
              h(
                'div',
                { key: 'actions', className: 'dsh-uiv-pickactions' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-uiv-action',
                    disabled: parent === null,
                    onClick: () => {
                      if (parent === null) return;
                      setStack((prev) => [...prev, candidate]);
                      setCandidate(parent);
                      setFailed(false);
                    },
                  },
                  t('pickExpand'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-uiv-action',
                    disabled: !canShrink,
                    onClick: () => {
                      if (stack.length === 0) return;
                      const prev = stack[stack.length - 1];
                      setStack(stack.slice(0, -1));
                      setCandidate(prev);
                      setFailed(false);
                    },
                  },
                  t('pickShrink'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-uiv-action dsh-uiv-action--accent',
                    onClick: () => confirm('single'),
                  },
                  t('pickHideOne'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-uiv-action dsh-uiv-action--accent',
                    disabled: !similarOk,
                    title: similarOk ? undefined : t('pickSimilarUnavailable'),
                    onClick: () => {
                      if (!similarOk) return;
                      confirm('similar');
                    },
                  },
                  t('pickHideSimilar'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-uiv-pickcancel',
                    onClick: () => visibility.stopPicking(),
                  },
                  t('pickCancel'),
                ),
              ),
            ],
      );
    }

    /** The picked-element list plus its two entry points. */
    function PickedSection({ t, custom }) {
      return [
        h('div', { className: 'dsh-uiv-section', key: 'picked-title' }, t('customSection')),
        custom.length === 0
          ? h('div', { className: 'dsh-uiv-empty', key: 'picked-empty' }, t('customEmpty'))
          : custom.map((entry) =>
              h(
                'div',
                { className: 'dsh-uiv-row', key: entry.selector },
                h(
                  'span',
                  { className: 'dsh-uiv-label', title: entry.selector },
                  entry.mode === 'similar' ? `${entry.label} · ${t('pickSimilarBadge')}` : entry.label,
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-uiv-remove',
                    'aria-label': t('removePicked'),
                    onClick: () => visibility.removeCustom(entry.selector),
                  },
                  '×',
                ),
              ),
            ),
        h(
          'div',
          { className: 'dsh-uiv-actions', key: 'picked-actions' },
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-uiv-action dsh-uiv-action--accent',
              onClick: () => visibility.startPicking(),
            },
            t('pickElement'),
          ),
          custom.length > 0
            ? h(
                'button',
                { type: 'button', className: 'dsh-uiv-action', onClick: () => visibility.clearCustom() },
                t('clearPicked'),
              )
            : null,
        ),
      ];
    }

    function Dock({ t }) {
      const [open, setOpen] = React.useState(false);
      const { hidden, dock, custom } = useVisibility();
      const dockRef = React.useRef(null);
      const frameRef = React.useRef(null);
      const hiddenRef = React.useRef(hidden);
      hiddenRef.current = hidden;

      const toggleRegion = (id) => visibility.toggleRegion(id);
      const setAll = (allHidden) => visibility.setAll(allHidden);

      /* Hiding the button takes its open panel with it. */
      React.useEffect(() => {
        if (!dock) setOpen(false);
      }, [dock]);

      /* Tag the frame once, then follow late-mounted seats (handles, leading seat). */
      React.useLayoutEffect(() => {
        const root = document.documentElement;
        const overlay = document.querySelector('[data-shell-overlay]');
        const frame = overlay === null ? null : overlay.parentElement;
        frameRef.current = frame;
        tagFrame(frame);
        applyHidden(hiddenRef.current);
        syncGrid(frame, hiddenRef.current);
        root.setAttribute('data-dsh-uiv', '');

        let observer = null;
        if (frame !== null) {
          observer = new MutationObserver(() => {
            tagFrame(frame);
            syncGrid(frame, hiddenRef.current);
          });
          observer.observe(frame, {
            childList: true,
            attributes: true,
            attributeFilter: ['style'],
          });
        }
        const onResize = () => syncGrid(frameRef.current, hiddenRef.current);
        window.addEventListener('resize', onResize);

        return () => {
          window.removeEventListener('resize', onResize);
          if (observer !== null) observer.disconnect();
          root.removeAttribute('data-dsh-uiv');
          root.removeAttribute('data-dsh-uiv-hide');
          root.removeAttribute('data-dsh-uiv-grid');
          if (frame !== null) {
            frame.style.removeProperty('--dsh-uiv-grid');
            frame.removeAttribute('data-dsh-uiv-frame');
            for (const el of Array.from(frame.children)) el.removeAttribute('data-dsh-uiv-region');
          }
        };
      }, []);

      React.useLayoutEffect(() => {
        applyHidden(hidden);
        syncGrid(frameRef.current, hidden);
      }, [hidden]);

      /* Cmd/Ctrl + Shift + H toggles every region from anywhere in the page. */
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (!(event.metaKey || event.ctrlKey) || !event.shiftKey) return;
          if (event.key.toLowerCase() !== 'h') return;
          event.preventDefault();
          event.stopPropagation();
          visibility.setAll(visibility.get().hidden.size < REGION_IDS.length);
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, []);

      React.useEffect(() => {
        if (!open) return;
        const onPointerDown = (event) => {
          if (visibility.get().picking) return;
          if (dockRef.current !== null && !dockRef.current.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        };
        window.addEventListener('pointerdown', onPointerDown, true);
        window.addEventListener('keydown', onKeyDown, true);
        return () => {
          window.removeEventListener('pointerdown', onPointerDown, true);
          window.removeEventListener('keydown', onKeyDown, true);
        };
      }, [open]);

      const panel = open
        ? h(
            'div',
            {
              className: 'dsh-uiv-panel',
              role: 'dialog',
              'aria-label': t('title'),
            },
            h(
              'div',
              { className: 'dsh-uiv-head' },
              h(
                'div',
                { className: 'dsh-uiv-heading' },
                h('div', { className: 'dsh-uiv-title' }, t('title')),
                h(
                  'div',
                  { className: 'dsh-uiv-sub' },
                  t('summaryLabel') + ' ' + hidden.size + '/' + REGION_IDS.length,
                ),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-uiv-close',
                  'aria-label': t('close'),
                  onClick: () => setOpen(false),
                },
                h(CloseIcon),
              ),
            ),
            h(
              'div',
              { className: 'dsh-uiv-row dsh-uiv-row--master' },
              h('span', { className: 'dsh-uiv-label' }, t('master')),
              h(Switch, {
                checked: hidden.size === 0,
                label: t('master'),
                onToggle: () => setAll(hidden.size === 0),
              }),
            ),
            h('div', { className: 'dsh-uiv-sep' }),
            h(RegionSwitches, { t, hidden, onToggle: toggleRegion }),
            h('div', { className: 'dsh-uiv-sep' }),
            h(PickedSection, { t, custom }),
            h('div', { className: 'dsh-uiv-sep' }),
            h('div', { className: 'dsh-uiv-section' }, t('pluginSection')),
            h(
              'div',
              { className: 'dsh-uiv-row', key: 'dock' },
              h('span', { className: 'dsh-uiv-label', title: t('dockHint') }, t('dockButton')),
              h(Switch, {
                checked: dock,
                label: t('dockButton'),
                onToggle: () => visibility.setDock(!dock),
              }),
            ),
            h('div', { className: 'dsh-uiv-sep' }),
            h(
              'div',
              { className: 'dsh-uiv-actions' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-uiv-action',
                  onClick: () => visibility.setHidden(IMMERSIVE_HIDDEN),
                },
                t('presetImmersive'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-uiv-action dsh-uiv-action--accent',
                  onClick: () => setAll(false),
                },
                t('presetShowAll'),
              ),
            ),
            h(
              'div',
              { className: 'dsh-uiv-hint' },
              h('span', null, t('shortcut')),
              h('kbd', { className: 'dsh-uiv-kbd' }, SHORTCUT_LABEL),
            ),
          )
        : null;

      /* The button can hide itself; the Settings page and the shortcut bring it back. */
      if (!dock) return null;

      return h(
        'div',
        { ref: dockRef, 'data-dsh-uiv-dock': '', className: 'dsh-uiv-dock' },
        panel,
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-uiv-toggle',
            'aria-expanded': open,
            'aria-haspopup': 'dialog',
            'aria-label': open ? t('close') : t('open'),
            title: t('title'),
            onClick: () => setOpen((value) => !value),
          },
          hidden.size > 0 ? h(EyeOffIcon) : h(EyeIcon),
          hidden.size > 0 ? h('span', { className: 'dsh-uiv-badge' }, String(hidden.size)) : null,
        ),
      );
    }

    /** The Settings page: the same switches as the floating panel, reachable while the button is hidden. */
    function SettingsSection({ t }) {
      const { hidden, dock, custom } = useVisibility();

      return h(
        'div',
        { className: 'dsh-uiv-page' },
        h('div', { className: 'dsh-uiv-pageTitle' }, t('settingsTitle')),
        h('div', { className: 'dsh-uiv-pageDesc' }, t('settingsDesc')),
        h(
          'div',
          { className: 'dsh-uiv-row dsh-uiv-row--master' },
          h('span', { className: 'dsh-uiv-label' }, t('master')),
          h(Switch, {
            checked: hidden.size === 0,
            label: t('master'),
            onToggle: () => visibility.setAll(hidden.size === 0),
          }),
        ),
        h('div', { className: 'dsh-uiv-sep' }),
        h(RegionSwitches, { t, hidden, onToggle: (id) => visibility.toggleRegion(id) }),
        h('div', { className: 'dsh-uiv-sep' }),
        h(PickedSection, { t, custom }),
        h('div', { className: 'dsh-uiv-sep' }),
        h('div', { className: 'dsh-uiv-section' }, t('pluginSection')),
        h(
          'div',
          { className: 'dsh-uiv-row' },
          h('span', { className: 'dsh-uiv-label', title: t('dockHint') }, t('dockButton')),
          h(Switch, {
            checked: dock,
            label: t('dockButton'),
            onToggle: () => visibility.setDock(!dock),
          }),
        ),
        h(
          'div',
          { className: 'dsh-uiv-actions' },
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-uiv-action',
              onClick: () => visibility.setHidden(IMMERSIVE_HIDDEN),
            },
            t('presetImmersive'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-uiv-action dsh-uiv-action--accent',
              onClick: () => visibility.setAll(false),
            },
            t('presetShowAll'),
          ),
        ),
        h(
          'div',
          { className: 'dsh-uiv-hint' },
          h('span', null, t('shortcutHint')),
          h('kbd', { className: 'dsh-uiv-kbd' }, SHORTCUT_LABEL),
        ),
        h('div', { className: 'dsh-uiv-pageHint' }, t('settingsHint')),
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'zh', zh), 'ui-visibility: zh dictionary');
        ctx.effect(() => ctx.locale.register(NS, 'en', en), 'ui-visibility: en dictionary');
        const t = ctx.locale.bind(NS);
        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.setAttribute('data-dsh-ui-visibility', '');
          tag.textContent = CSS;
          document.head.append(tag);
          return () => tag.remove();
        }, 'ui-visibility: stylesheet');
        ctx.effect(() => {
          syncPickedDom(visibility.get().custom);
          const stop = startPickObserver();
          return () => {
            stop();
            syncPickedDom([], document);
          };
        }, 'ui-visibility: pick reattachment');
        ctx.effect(
          () =>
            ctx.slots.inject('shell.overlay', () =>
              ctx.slots.register(
                {
                  name: 'shell.overlay',
                  id: 'ui-visibility',
                  order: 2000,
                  locale: NS,
                },
                Dock,
              ),
            ),
          'ui-visibility: floating dock',
        );
        ctx.effect(
          () =>
            ctx.slots.inject('shell.overlay', () =>
              ctx.slots.register(
                {
                  name: 'shell.overlay',
                  id: 'ui-visibility-picker',
                  order: 2001,
                  locale: NS,
                },
                PickerOverlay,
              ),
            ),
          'ui-visibility: element picker',
        );
        ctx.effect(
          () =>
            ctx.slots.inject('settings.section', () =>
              ctx.slots.register(
                {
                  name: 'settings.section',
                  id: 'ui-visibility',
                  order: 60,
                  label: () => t('settingsNav'),
                  inject: () => ({ t }),
                },
                SettingsSection,
              ),
            ),
          'ui-visibility: settings section',
        );
      },
    };
  },
});
