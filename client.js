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
      pickCancel: '取消',
      pickFailed: '这个元素定位不到，换个位置再点',
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
      pickCancel: 'Cancel',
      pickFailed: 'Could not address that element; try a different spot',
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
  z-index: 80;
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
}
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
html[data-dsh-uiv-picking] [data-dsh-uiv-hover] {
  outline: 2px solid #4d6bfe !important;
  outline-offset: -2px;
  background: rgba(77, 107, 254, 0.12) !important;
}
html[data-dsh-uiv-picking],
html[data-dsh-uiv-picking] * { cursor: crosshair !important; }

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

    /** Picked selectors are generated by us; still reject CSS-injection characters and duplicates. */
    function sanitizeCustom(value) {
      if (!Array.isArray(value)) return [];
      const seen = new Set();
      const out = [];
      for (const entry of value) {
        if (entry === null || typeof entry !== 'object') continue;
        const selector = typeof entry.selector === 'string' ? entry.selector.trim() : '';
        if (selector === '' || /[{}<>\\]/.test(selector) || seen.has(selector)) continue;
        seen.add(selector);
        out.push({ selector, label: typeof entry.label === 'string' ? entry.label.slice(0, 60) : selector });
        if (out.length >= 60) break;
      }
      return out;
    }

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

    /**
     * One observable state shared by the floating dock and the Settings page:
     * both mount in different roots but always agree.
     */
    function createVisibilityStore() {
      let state = { ...loadState(), picking: false };
      syncCustomStyle(state.custom);
      const listeners = new Set();
      const commit = (next) => {
        state = next;
        persistState(state);
        syncCustomStyle(state.custom);
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

    function cssAttrValue(value) {
      return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    /** One structural step, indexed among its parent's children so the path stays unique. */
    function segmentOf(node) {
      const parent = node.parentElement;
      const index = Array.prototype.indexOf.call(parent.children, node) + 1;
      return `${node.tagName.toLowerCase()}:nth-child(${index})`;
    }

    /**
     * Turn a picked element into one CSS selector: the nearest slot/region anchor plus the
     * child path below it. Returns null when the path is not unique or not addressable.
     */
    function selectorFor(element) {
      if (!(element instanceof Element)) return null;
      if (element === document.body || element === document.documentElement) return null;
      const slot = element.closest('[data-slot]');
      const anchor = slot !== null ? slot : element.closest('[data-dsh-uiv-region]');
      let anchorSelector = 'body';
      if (anchor !== null && anchor !== element) {
        anchorSelector =
          slot !== null
            ? `[data-slot="${cssAttrValue(anchor.getAttribute('data-slot'))}"]`
            : `[data-dsh-uiv-region="${cssAttrValue(anchor.getAttribute('data-dsh-uiv-region'))}"]`;
      }
      const parts = [];
      let node = element;
      while (node !== null && node !== anchor) {
        parts.unshift(segmentOf(node));
        node = node.parentElement;
      }
      if (node === null) return null;
      const selector = parts.length === 0 ? anchorSelector : `${anchorSelector} > ${parts.join(' > ')}`;
      try {
        return document.querySelectorAll(selector).length === 1 ? selector : null;
      } catch {
        return null;
      }
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

    /** Bottom hint bar plus the capture-phase listeners that turn a click into a selector. */
    function PickerOverlay({ t }) {
      const { picking } = useVisibility();
      const [failed, setFailed] = React.useState(false);

      React.useEffect(() => {
        if (!picking) {
          setFailed(false);
          return undefined;
        }
        let hovered = null;
        const clearHover = () => {
          if (hovered !== null) hovered.removeAttribute('data-dsh-uiv-hover');
          hovered = null;
        };
        const ignored = (target) =>
          !(target instanceof Element) || target.closest('[data-dsh-uiv-dock], [data-dsh-uiv-picker]') !== null;
        const onOver = (event) => {
          if (ignored(event.target)) {
            clearHover();
            return;
          }
          if (hovered === event.target) return;
          clearHover();
          hovered = event.target;
          hovered.setAttribute('data-dsh-uiv-hover', '');
        };
        const onClick = (event) => {
          if (ignored(event.target)) return;
          event.preventDefault();
          event.stopPropagation();
          const selector = selectorFor(event.target);
          if (selector === null) {
            setFailed(true);
            return;
          }
          visibility.addCustom({ selector, label: labelFor(event.target) });
          clearHover();
          visibility.stopPicking();
        };
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          event.stopPropagation();
          visibility.stopPicking();
        };
        document.documentElement.setAttribute('data-dsh-uiv-picking', '');
        document.addEventListener('pointerover', onOver, true);
        document.addEventListener('click', onClick, true);
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          clearHover();
          document.documentElement.removeAttribute('data-dsh-uiv-picking');
          document.removeEventListener('pointerover', onOver, true);
          document.removeEventListener('click', onClick, true);
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }, [picking]);

      if (!picking) return null;
      return h(
        'div',
        { 'data-dsh-uiv-picker': '', className: 'dsh-uiv-pickbar' },
        h('span', null, failed ? t('pickFailed') : t('pickHint')),
        h(
          'button',
          { type: 'button', className: 'dsh-uiv-pickcancel', onClick: () => visibility.stopPicking() },
          t('pickCancel'),
        ),
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
                h('span', { className: 'dsh-uiv-label', title: entry.selector }, entry.label),
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
