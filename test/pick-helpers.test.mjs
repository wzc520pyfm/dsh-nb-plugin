import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientSrc = readFileSync(join(root, 'client.js'), 'utf8');
const start = clientSrc.indexOf('/* <pick-utils> */');
const end = clientSrc.indexOf('/* </pick-utils> */');
assert.ok(start >= 0 && end > start, 'client.js must contain a <pick-utils> block');
const block = clientSrc.slice(start, end + '/* </pick-utils> */'.length);

const sandbox = { crypto, Uint8Array, Array, Set, Map, Number, String, Math, Date, console };
vm.createContext(sandbox);
vm.runInContext(`${block}\nthis.__pickUtils = pickUtils;`, sandbox);
const {
  PICK_ATTR,
  MAX_CUSTOM,
  cssAttrValue,
  randomPickId,
  hideSelectorForPickId,
  sanitizePath,
  sanitizeSimilar,
  sanitizeCustom,
  buildPath,
  resolvePath,
  similarSignature,
  signatureMatches,
  similarIsSpecific,
  findSimilar,
  eventPickTarget,
  expandableParent,
  isPluginChrome,
} = sandbox.__pickUtils;

function clone(value) {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
}

/* ---------------- sanitizeCustom / CSS injection ---------------- */

test('keeps legacy selector+label entries', () => {
  const out = sanitizeCustom([
    { selector: '[data-slot="conversation.input.model"] > button:nth-child(2)', label: 'Model' },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].selector, '[data-slot="conversation.input.model"] > button:nth-child(2)');
  assert.equal(out[0].label, 'Model');
  assert.equal(out[0].pickId, undefined);
});

test('rejects CSS-injection characters and duplicates, caps at 60', () => {
  assert.equal(sanitizeCustom([{ selector: 'div{color:red}', label: 'x' }]).length, 0);
  assert.equal(sanitizeCustom([{ selector: 'div<script>', label: 'x' }]).length, 0);
  assert.equal(sanitizeCustom([{ selector: 'div\\foo', label: 'x' }]).length, 0);
  const dup = sanitizeCustom([
    { selector: 'button.a', label: 'one' },
    { selector: 'button.a', label: 'two' },
  ]);
  assert.equal(dup.length, 1);
  assert.equal(dup[0].label, 'one');
  const many = sanitizeCustom(
    Array.from({ length: 80 }, (_, i) => ({ selector: `span.n${i}`, label: `n${i}` })),
  );
  assert.equal(many.length, MAX_CUSTOM);
  assert.equal(sanitizeCustom('nope').length, 0);
  assert.equal(sanitizeCustom(null).length, 0);
});

test('keeps valid pick path fields and drops invalid pickId extras', () => {
  const path = [
    { kind: 'node', tag: 'body', index: 2 },
    { kind: 'node', tag: 'div', index: 1, slot: 'conversation.chat' },
    { kind: 'shadow' },
    { kind: 'node', tag: 'button', index: 1, aria: 'Copy' },
  ];
  const kept = sanitizeCustom([
    {
      selector: '[data-dsh-uiv-pick="uiv-aabbcc"]',
      label: 'Copy',
      pickId: 'uiv-aabbcc',
      mode: 'similar',
      path,
      similar: { tag: 'button', aria: 'Copy' },
    },
  ]);
  assert.equal(kept.length, 1);
  assert.equal(kept[0].pickId, 'uiv-aabbcc');
  assert.equal(kept[0].mode, 'similar');
  assert.equal(kept[0].path.length, 4);
  assert.equal(clone(kept[0].path[2]).kind, 'shadow');
  assert.equal(kept[0].similar.aria, 'Copy');

  const dropped = sanitizeCustom([
    {
      selector: 'button.ok',
      label: 'x',
      pickId: 'not-valid',
      mode: 'similar',
      path,
      similar: { tag: 'button' },
    },
  ]);
  assert.equal(dropped[0].pickId, undefined);
  assert.equal(dropped[0].mode, undefined);
  assert.equal(dropped[0].path, undefined);
});

test('sanitizePath and sanitizeSimilar reject unsafe values', () => {
  assert.equal(sanitizePath(null), null);
  assert.equal(sanitizePath([{ kind: 'node', tag: 'BUTTON', index: 1 }])[0].tag, 'button');
  assert.equal(sanitizePath([{ kind: 'node', tag: 'div{', index: 1 }]), null);
  assert.equal(sanitizePath([{ kind: 'node', tag: 'div', index: 0 }]), null);
  assert.equal(sanitizePath([{ kind: 'wow', tag: 'div', index: 1 }]), null);
  const cleaned = sanitizeSimilar({ tag: 'BUTTON', aria: 'Copy{oops}', slot: 's' });
  assert.equal(cleaned.tag, 'button');
  assert.equal(cleaned.aria, undefined);
  assert.equal(cleaned.slot, 's');
});

test('hideSelectorForPickId and cssAttrValue and randomPickId', () => {
  assert.equal(hideSelectorForPickId('uiv-ab'), '[data-dsh-uiv-pick="uiv-ab"]');
  assert.equal(hideSelectorForPickId('nope'), null);
  assert.equal(PICK_ATTR, 'data-dsh-uiv-pick');
  assert.equal(cssAttrValue('a"b\\c'), 'a\\"b\\\\c');
  const id = randomPickId();
  assert.match(id, /^uiv-[a-z0-9]+$/);
  const existing = new Set([id]);
  const next = randomPickId(existing);
  assert.notEqual(next, id);
});

/* ---------------- fake DOM for path / similar / events ---------------- */

class FakeNode {
  constructor(tag, attrs = {}, children = []) {
    this.nodeType = 1;
    this.tagName = tag.toUpperCase();
    this.attrs = { ...attrs };
    this.childNodes = [];
    this.parentNode = null;
    this.parentElement = null;
    this.shadowRoot = null;
    this.ownerDocument = null;
    for (const child of children) this.appendChild(child);
  }
  get children() {
    return this.childNodes.filter((node) => node.nodeType === 1);
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
  }
  setAttribute(name, value) {
    this.attrs[name] = String(value);
  }
  removeAttribute(name) {
    delete this.attrs[name];
  }
  appendChild(child) {
    child.parentNode = this;
    child.parentElement = this._isShadowRoot ? null : this;
    child.ownerDocument = this.ownerDocument || (this.nodeType === 9 ? this : null);
    this.childNodes.push(child);
    this._assignDocs(child, child.ownerDocument);
    return child;
  }
  _assignDocs(node, doc) {
    node.ownerDocument = doc;
    if (node.childNodes) {
      for (const child of node.childNodes) this._assignDocs(child, doc);
    }
    if (node.shadowRoot) this._assignDocs(node.shadowRoot, doc);
  }
  closest(selector) {
    let node = this;
    while (node && node.nodeType === 1) {
      if (matchesChrome(node, selector)) return node;
      node = node.parentElement;
    }
    return null;
  }
  getRootNode() {
    if (this._isShadowRoot) return this;
    let node = this;
    while (node.parentNode) node = node.parentNode;
    return node;
  }
  attachShadow() {
    const root = new FakeNode('#shadow');
    root.nodeType = 11;
    root.tagName = '#shadow-root';
    root._isShadowRoot = true;
    root.host = this;
    root.ownerDocument = this.ownerDocument;
    this.shadowRoot = root;
    return root;
  }
}

function matchesChrome(node, selector) {
  // Only the chrome selector used by isPluginChrome is needed in these tests.
  const attrs = ['data-dsh-uiv-dock', 'data-dsh-uiv-picker', 'data-dsh-uiv-highlight'];
  return attrs.some((attr) => node.getAttribute(attr) !== null);
}

class FakeDocument extends FakeNode {
  constructor() {
    super('document');
    this.nodeType = 9;
    this.tagName = '#document';
    this.ownerDocument = this;
    this.documentElement = new FakeNode('html');
    this.documentElement.ownerDocument = this;
    this.documentElement.parentNode = this;
    this.documentElement.parentElement = null;
    this.body = new FakeNode('body');
    this.head = new FakeNode('head');
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
    this.body.ownerDocument = this;
    this.childNodes = [this.documentElement];
  }
}

function bindTree(doc, node) {
  node.ownerDocument = doc;
  for (const child of node.childNodes || []) bindTree(doc, child);
  if (node.shadowRoot) {
    node.shadowRoot.ownerDocument = doc;
    for (const child of node.shadowRoot.childNodes || []) bindTree(doc, child);
  }
}

function insertFirst(parent, child) {
  child.parentNode = parent;
  child.parentElement = parent._isShadowRoot ? null : parent;
  child.ownerDocument = parent.ownerDocument || parent;
  parent.childNodes.unshift(child);
  bindTree(child.ownerDocument, child);
}

test('buildPath and resolvePath find a recreated node at the same structure', () => {
  const doc = new FakeDocument();
  const list = new FakeNode('div', { 'data-slot': 'conversation.chat' });
  const first = new FakeNode('article');
  const target = new FakeNode('button', { 'aria-label': 'Copy' });
  first.appendChild(target);
  list.appendChild(first);
  doc.body.appendChild(list);
  bindTree(doc, doc.documentElement);

  const path = buildPath(target, doc);
  assert.ok(path);
  assert.equal(path.some((step) => step.kind === 'shadow'), false);
  assert.equal(resolvePath(path, doc), target);

  // Recreate the same tree (React re-render / refresh) and resolve the stored path.
  first.childNodes.splice(0, 1);
  const replacement = new FakeNode('button', { 'aria-label': 'Copy' });
  first.appendChild(replacement);
  bindTree(doc, doc.documentElement);
  assert.equal(resolvePath(path, doc), replacement);
});

test('resolvePath uses a stable data-slot even if the wrapper index shifts', () => {
  const doc = new FakeDocument();
  const list = new FakeNode('div', { 'data-slot': 'conversation.chat' });
  const first = new FakeNode('article');
  const target = new FakeNode('button', { 'aria-label': 'Copy' });
  first.appendChild(target);
  list.appendChild(first);
  doc.body.appendChild(list);
  bindTree(doc, doc.documentElement);
  const path = buildPath(target, doc);
  insertFirst(doc.body, new FakeNode('aside'));
  assert.equal(resolvePath(path, doc), target);
});

test('buildPath crosses open shadow roots and resolvePath re-enters them', () => {
  const doc = new FakeDocument();
  const host = new FakeNode('div', { 'data-slot': 'plugin.panel' });
  const root = host.attachShadow();
  const wrap = new FakeNode('div');
  const btn = new FakeNode('button', { 'aria-label': 'Close plugin' });
  wrap.appendChild(btn);
  root.appendChild(wrap);
  doc.body.appendChild(host);
  bindTree(doc, doc.documentElement);
  btn.getRootNode = () => root;
  wrap.getRootNode = () => root;

  const path = buildPath(btn, doc);
  assert.ok(path);
  assert.ok(path.some((step) => step.kind === 'shadow'));
  assert.equal(resolvePath(path, doc), btn);
});

test('resolvePath returns null for a closed (missing) shadow root instead of throwing', () => {
  const doc = new FakeDocument();
  const host = new FakeNode('div', { id: 'closedHost' });
  doc.body.appendChild(host);
  bindTree(doc, doc.documentElement);
  const path = [
    { kind: 'node', tag: 'body', index: 2 },
    { kind: 'node', tag: 'div', index: 1, id: 'closedHost' },
    { kind: 'shadow' },
    { kind: 'node', tag: 'button', index: 1 },
  ];
  assert.equal(resolvePath(path, doc), null);
});

test('similar matching finds the same kind of button on every message', () => {
  const doc = new FakeDocument();
  const thread = new FakeNode('div', { 'data-slot': 'conversation.chat' });
  const buttons = [];
  for (let i = 0; i < 3; i += 1) {
    const msg = new FakeNode('article', { role: 'listitem' });
    const copy = new FakeNode('button', { 'aria-label': 'Copy' });
    const more = new FakeNode('button', { 'aria-label': 'More' });
    msg.appendChild(copy);
    msg.appendChild(more);
    thread.appendChild(msg);
    buttons.push(copy);
  }
  doc.body.appendChild(thread);
  bindTree(doc, doc.documentElement);

  const sig = similarSignature(buttons[1]);
  assert.equal(sig.tag, 'button');
  assert.equal(sig.aria, 'Copy');
  assert.equal(similarIsSpecific(sig), true);
  const matches = findSimilar(doc, sig);
  assert.equal(matches.length, 3);
  assert.ok(matches.includes(buttons[0]) && matches.includes(buttons[2]));
  assert.equal(signatureMatches(buttons[0], sig), true);
  const more = thread.children[0].children[1];
  assert.equal(signatureMatches(more, sig), false);
});

test('similarIsSpecific rejects a generic unlabelled div', () => {
  const doc = new FakeDocument();
  const wrap = new FakeNode('div');
  const inner = new FakeNode('div');
  wrap.appendChild(inner);
  doc.body.appendChild(wrap);
  bindTree(doc, doc.documentElement);
  const sig = similarSignature(inner);
  assert.equal(sig.tag, 'div');
  assert.equal(similarIsSpecific(sig), false);
});

test('eventPickTarget uses composedPath and ignores the plugin dock / pick bar', () => {
  const doc = new FakeDocument();
  const host = new FakeNode('div');
  const root = host.attachShadow();
  const inner = new FakeNode('span');
  root.appendChild(inner);
  doc.body.appendChild(host);
  bindTree(doc, doc.documentElement);
  inner.getRootNode = () => root;

  const fromShadow = eventPickTarget({
    composedPath: () => [inner, root, host, doc.body, doc.documentElement, doc],
    target: host,
  });
  assert.equal(fromShadow, inner);

  const dock = new FakeNode('div', { 'data-dsh-uiv-dock': '' });
  const dockBtn = new FakeNode('button');
  dock.appendChild(dockBtn);
  doc.body.appendChild(dock);
  bindTree(doc, doc.documentElement);
  assert.equal(
    eventPickTarget({
      composedPath: () => [dockBtn, dock, doc.body, doc.documentElement, doc],
      target: dockBtn,
    }),
    null,
  );
  assert.equal(isPluginChrome(dockBtn), true);
  assert.equal(isPluginChrome(inner), false);
});

test('expandableParent walks out of a text-level node and then out of open shadow', () => {
  const doc = new FakeDocument();
  const host = new FakeNode('section');
  const root = host.attachShadow();
  const button = new FakeNode('button');
  const label = new FakeNode('span');
  button.appendChild(label);
  root.appendChild(button);
  doc.body.appendChild(host);
  bindTree(doc, doc.documentElement);
  label.getRootNode = () => root;
  button.getRootNode = () => root;

  assert.equal(expandableParent(label, doc), button);
  assert.equal(expandableParent(button, doc), host);
  assert.equal(expandableParent(host, doc), null);
});

console.log(`\n${passed} tests passed`);
