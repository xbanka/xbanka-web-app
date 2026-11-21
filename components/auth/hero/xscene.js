/* eslint-disable */
// The Xbanka hero scene, from the Claude Design project "Xbanka hero 3D
// redesign" (Xbanka Hero.dc.html + xscene.js). Kept as the design exported
// it: a self-contained <x-scene> custom element that draws the 3D X, the
// segmented naira / crypto / bills ring, the sphere, the naira coin and the
// orbiting tokens into one SVG, frame by frame. It pauses off screen, follows
// the pointer inside its [data-xcard] ancestor, and shows the settled frame
// when the user prefers reduced motion or motion="off".
//
// Browser only: call defineXScene() from an effect, never during render.
export function defineXScene() {
if (typeof window === 'undefined' || customElements.get('x-scene')) return;
const TAU = Math.PI * 2, CX = 300, CY = 390, K = 0.40, RO = 190, RI = 105, H = 40, INTRO = 1.6;
const SL = [0.42, 0.33, 0.25], GAP = 2.4 * Math.PI / 180;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const bez = (x1, y1, x2, y2) => t => {
  if (t <= 0) return 0; if (t >= 1) return 1;
  let u = t;
  for (let i = 0; i < 8; i++) {
    const x = 3*x1*u*(1-u)*(1-u) + 3*x2*u*u*(1-u) + u*u*u - t;
    const d = 3*(1-u)*(1-u)*x1 + 6*(1-u)*u*(x2-x1) + 3*u*u*(1-x2);
    if (Math.abs(x) < 1e-5 || Math.abs(d) < 1e-6) break;
    u = clamp(u - x / d);
  }
  return 3*y1*u*(1-u)*(1-u) + 3*y2*u*u*(1-u) + u*u*u;
};
const E = {
  out: bez(.22, 1, .36, 1),
  back: bez(.34, 1.45, .64, 1),
  io: bez(.45, 0, .55, 1),
  fall: bez(.55, 0, .9, .45),
  spin: bez(.2, .55, .35, 1),
};
const f = n => n.toFixed(1);
const P = (a, r, y) => [CX + r * Math.cos(a), y + r * Math.sin(a) * K];
function arc(r, y, s, e, first) {
  const n = Math.max(2, Math.ceil(Math.abs(e - s) / (Math.PI / 40)));
  let d = '';
  for (let i = 0; i <= n; i++) {
    const [x, yy] = P(s + (e - s) * i / n, r, y);
    d += (i === 0 && first ? 'M' : 'L') + f(x) + ' ' + f(yy);
  }
  return d;
}
function ivs(a0, a1, lo, hi) {
  const o = [];
  for (let k = -1; k <= 2; k++) {
    const s = Math.max(a0, lo + TAU * k), e = Math.min(a1, hi + TAU * k);
    if (e > s + 1e-4) o.push([s, e]);
  }
  return o;
}
const band = (r, yt, yb, list) => list.map(([s, e]) => arc(r, yt, s, e, true) + arc(r, yb, e, s, false) + 'Z').join('');
function cap(a, yt, yb) {
  const p = [P(a, RI, yt), P(a, RO, yt), P(a, RO, yb), P(a, RI, yb)];
  return 'M' + p.map(q => f(q[0]) + ' ' + f(q[1])).join('L') + 'Z';
}
const COL = [
  { t: ['#4FE3CF', '#16B0A2', '#0C9A8E'], w: ['#17B5A7', '#0C9A8E', '#07665F'], i: ['#06615A', '#0C9A8E'] },
  { t: ['#1F8579', '#0F5E57', '#0B4F4A'], w: ['#167067', '#0B4F4A', '#062E2B'], i: ['#042825', '#0E6058'] },
  { t: ['#FFFFFF', '#EEF8F6', '#D3E5E1'], w: ['#EEF8F6', '#CADDD9', '#9DB8B3'], i: ['#9AB4AF', '#E2EFEC'] },
];
const TOK = [
  { A: 235, B: 46, per: 12, ph: 0.3, dir: 1, cy: 188, face: '#EEF8F6', edge: '#B9CFCB', ink: '#0B4F4A', g: '₿' },
  { A: 200, B: 60, per: 12, ph: 3.6, dir: -1, cy: 222, face: '#0B4F4A', edge: '#062E2B', ink: '#EEF8F6', g: 'Ξ' },
  { A: 168, B: 38, per: 6, ph: 1.9, dir: 1, cy: 150, face: '#0C9A8E', edge: '#07665F', ink: '#EEF8F6', g: 'bolt' },
];
function capsule(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * w, ny = dx / L * w;
  return `M${f(x1+nx)} ${f(y1+ny)}L${f(x2+nx)} ${f(y2+ny)}A${w} ${w} 0 0 0 ${f(x2-nx)} ${f(y2-ny)}L${f(x1-nx)} ${f(y1-ny)}A${w} ${w} 0 0 0 ${f(x1+nx)} ${f(y1+ny)}Z`;
}
let uid = 0;

class XScene extends HTMLElement {
  static get observedAttributes() { return ['motion', 'parallax']; }
  attributeChangedCallback() { this._cfg(); }
  set motion(v) { this._m = v; this._cfg(); }
  set parallax(v) { this._pl = v; this._cfg(); }
  connectedCallback() {
    if (!this._init) this._build();
    this._bind();
    this._cfg();
  }
  disconnectedCallback() {
    cancelAnimationFrame(this._raf); this._raf = 0;
    if (this._unbind) this._unbind();
    if (this._io) this._io.disconnect();
  }
  _cfg() {
    if (!this._init) return;
    const off = v => v === false || v === 'false' || v === 'off';
    const m = this._m !== undefined ? this._m : this.getAttribute('motion');
    const pl = this._pl !== undefined ? this._pl : this.getAttribute('parallax');
    const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wasStatic = this._static;
    this._static = rm || off(m);
    this._parOn = !this._static && !off(pl);
    if (!this._parOn) { this._tx = this._ty = 0; }
    if (this._static) { cancelAnimationFrame(this._raf); this._raf = 0; this._px = this._py = 0; this._draw(INTRO); }
    else { if (wasStatic || this._t0 == null) this._t0 = performance.now(); this._loop(); }
  }
  _loop() {
    if (this._raf || this._static || this._hidden) return;
    const tick = () => {
      this._raf = requestAnimationFrame(tick);
      const k = 0.075;
      this._px += (this._tx - this._px) * k; this._py += (this._ty - this._py) * k;
      this._draw((performance.now() - this._t0) / 1000);
    };
    this._raf = requestAnimationFrame(tick);
  }
  _bind() {
    const card = this.closest('[data-xcard]') || this;
    const mv = e => {
      if (!this._parOn || e.pointerType === 'touch') return;
      const r = card.getBoundingClientRect();
      this._tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      this._ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    };
    const lv = () => { this._tx = 0; this._ty = 0; };
    card.addEventListener('pointermove', mv); card.addEventListener('pointerleave', lv);
    this._unbind = () => { card.removeEventListener('pointermove', mv); card.removeEventListener('pointerleave', lv); };
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver(es => {
        const vis = es[es.length - 1].isIntersecting;
        if (!vis) { this._hidden = true; cancelAnimationFrame(this._raf); this._raf = 0; this._hAt = performance.now(); }
        else if (this._hidden) { this._hidden = false; if (this._hAt && this._t0 != null) this._t0 += performance.now() - this._hAt; this._loop(); }
      });
      this._io.observe(this);
    }
  }
  _build() {
    this._init = true;
    this._px = this._py = this._tx = this._ty = 0;
    const p = 'xs' + (++uid) + '_';
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const lg = (id, x1, y1, x2, y2, stops, extra = '') =>
      `<linearGradient id="${p}${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops.map((c, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
    const blur = (id, s) => `<filter id="${p}${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
    let defs = blur('b12', 12) + blur('b6', 6) + blur('b3', 3) + blur('b1', 1.4);
    TOK.forEach((_, i) => defs += `<filter id="${p}tb${i}" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="1"/></filter>`);
    COL.forEach((c, i) => {
      defs += lg('t' + i, 130, 280, 470, 420, c.t) + lg('w' + i, 110, 0, 490, 0, c.w) + lg('i' + i, 195, 0, 405, 0, c.i);
      defs += `<linearGradient id="${p}s${i}" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="120" y2="360"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    });
    defs += lg('xa', -100, -100, 100, 100, ['#7AF2DF', '#2DD4BF', '#0C9A8E']);
    defs += lg('xb', -60, -60, 60, 60, ['#3EDCC6', '#14A99C', '#0A847A']);
    defs += lg('xs', -60, -60, 60, 60, ['#ffffff00', '#ffffffd0', '#ffffff00']);
    defs += `<radialGradient id="${p}sp" cx=".38" cy=".34" r=".7" fx=".32" fy=".28"><stop offset="0" stop-color="#A6F7E8"/><stop offset=".28" stop-color="#2DD4BF"/><stop offset=".72" stop-color="#0C9A8E"/><stop offset="1" stop-color="#0B4F4A"/></radialGradient>`;
    defs += `<linearGradient id="${p}cf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCD34D"/><stop offset=".5" stop-color="#F2B530"/><stop offset="1" stop-color="#B45309"/></linearGradient>`;
    defs += `<linearGradient id="${p}ci" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FBCB45"/><stop offset="1" stop-color="#E39A1C"/></linearGradient>`;
    defs += `<linearGradient id="${p}cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0981E"/><stop offset=".5" stop-color="#B45309"/><stop offset="1" stop-color="#8A3F07"/></linearGradient>`;
    defs += `<radialGradient id="${p}chip" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>`;

    let slices = '';
    COL.forEach((_, i) => {
      slices += `<g data-sl="${i}"><path data-c0 fill="url(#${p}w${i})"/><path data-c1 fill="url(#${p}w${i})"/><path data-o fill="url(#${p}w${i})"/><path data-t fill="url(#${p}t${i})" stroke="#ffffff" stroke-opacity=".3" stroke-width="1" stroke-linejoin="round"/><path data-s fill="url(#${p}s${i})" fill-opacity="0"/></g>`;
    });
    let inners = COL.map((_, i) => `<path data-in="${i}" fill="url(#${p}i${i})"/>`).join('');

    const XA = 'M-132 -92L-52 -92L132 92L52 92Z', XB = 'M132 -92L52 -92L-132 92L-52 92Z';
    const ext = (d) => { let s = ''; for (let i = 14; i >= 1; i--) { const c = i > 10 ? '#0B4F4A' : i > 6 ? '#0A5F58' : i > 3 ? '#0A7068' : '#0B8379'; s += `<path d="${d}" fill="${c}" transform="translate(${f(i * 0.7)} ${f(i * 1.1)})"/>`; } return s; };
    const xg = `${ext(XB)}<path d="${XB}" fill="url(#${p}xb)"/><path d="${XB}" fill="none" stroke="#ffffff" stroke-opacity=".32" stroke-width="1.5" stroke-linejoin="miter"/>`
      + `${ext(XA)}<path d="${XA}" fill="url(#${p}xa)"/><path d="${XA}" fill="none" stroke="#ffffff" stroke-opacity=".38" stroke-width="1.5"/>`
      + `<path d="M-70 -84 L40 26" stroke="url(#${p}xs)" stroke-width="6" stroke-linecap="round" filter="url(#${p}b1)" opacity=".85"/>`;

    const tok = TOK.map((t, i) => {
      const glyph = t.g === 'bolt'
        ? `<path d="M2 -11L-6 1.5L-1 1.5L-2.5 11L6 -2L1 -2L3 -11Z" fill="${t.ink}"/>`
        : `<text text-anchor="middle" y="6.5" font-family="Geist, system-ui, sans-serif" font-weight="700" font-size="19" fill="${t.ink}">${t.g}</text>`;
      return `<g data-tok="${i}" filter="url(#${p}tb${i})"><circle cy="3.5" r="19" fill="${t.edge}"/><circle r="19" fill="${t.face}"/><circle r="19" fill="url(#${p}chip)"/>${glyph}</g>`;
    }).join('');

    this.innerHTML = `<svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible;will-change:transform" aria-hidden="true"><defs>${defs}</defs>
<g data-tback></g>
<g data-ring>
  <ellipse data-fs cx="314" cy="404" rx="204" ry="82" fill="#0B4F4A" opacity=".2" filter="url(#${p}b12)"/>
  <ellipse data-ao cx="302" cy="394" rx="190" ry="76" fill="#0B4F4A" opacity=".22" filter="url(#${p}b3)"/>
  <g data-inner>${inners}</g>
  <g data-slices>${slices}</g>
  <ellipse data-xsh fill="#0B4F4A" filter="url(#${p}b6)"/>
  <ellipse data-ssh fill="#0B4F4A" filter="url(#${p}b3)"/>
  <g data-sph><circle r="30" fill="url(#${p}sp)"/><ellipse cx="-10" cy="-12" rx="8" ry="6" fill="#fff" opacity=".8" filter="url(#${p}b1)"/><circle r="29" fill="none" stroke="#ffffff" stroke-opacity=".18" stroke-width="1"/></g>
</g>
<g data-coinp>
  <ellipse data-csh cy="481" fill="#0B4F4A" filter="url(#${p}b3)"/>
  <g data-coin>
    <ellipse data-crb ry="46" fill="url(#${p}cr)"/>
    <rect data-crr y="-46" height="92" fill="url(#${p}cr)"/>
    <g data-cf>
      <circle r="46" fill="url(#${p}cf)"/>
      <circle r="37" fill="url(#${p}ci)" stroke="#B45309" stroke-opacity=".55" stroke-width="1.5"/>
      <circle r="44.5" fill="none" stroke="#FCD34D" stroke-opacity=".7" stroke-width="1.2"/>
      <g font-family="Geist, system-ui, sans-serif" font-weight="800" font-size="42" text-anchor="middle">
        <text x="1.6" y="16.6" fill="#B45309" opacity=".85">₦</text>
        <text x="-1" y="14" fill="#FDECA8">₦</text>
        <text x="0" y="15" fill="#E9A626">₦</text>
      </g>
    </g>
  </g>
</g>
<g data-x>${xg}</g>
<g data-tfront>${tok}</g>
</svg>`;
    const q = s => this.querySelector(s);
    this.$ = {
      svg: q('svg'), ring: q('[data-ring]'), fs: q('[data-fs]'), ao: q('[data-ao]'), slices: q('[data-slices]'),
      sl: COL.map((_, i) => { const g = q(`[data-sl="${i}"]`); return { g, c0: g.querySelector('[data-c0]'), c1: g.querySelector('[data-c1]'), o: g.querySelector('[data-o]'), t: g.querySelector('[data-t]'), s: g.querySelector('[data-s]'), grad: q(`#${p}s${i}`) }; }),
      inn: COL.map((_, i) => q(`[data-in="${i}"]`)),
      xsh: q('[data-xsh]'), ssh: q('[data-ssh]'), sph: q('[data-sph]'),
      coinp: q('[data-coinp]'), coin: q('[data-coin]'), crb: q('[data-crb]'), crr: q('[data-crr]'), cf: q('[data-cf]'), csh: q('[data-csh]'),
      x: q('[data-x]'), tback: q('[data-tback]'), tfront: q('[data-tfront]'),
      tok: TOK.map((_, i) => q(`[data-tok="${i}"]`)), tblur: TOK.map((_, i) => q(`#${p}tb${i} feGaussianBlur`)),
    };
    this._order = '';
    this._tokLayer = TOK.map(() => 1);
  }
  _draw(t) {
    const $ = this.$, tau = Math.max(0, t - INTRO), px = this._px, py = this._py;
    $.svg.style.transform = (px || py) ? `perspective(1400px) rotateX(${f(-py * 3)}deg) rotateY(${f(px * 3)}deg)` : '';
    $.ring.setAttribute('transform', `translate(${f(px * 4)} ${f(py * 4)})`);

    // ring
    const rot = -0.5 + t * TAU / 40;
    let acc = 0, depth = [], liftOf = [], dyOf = [], spans = [];
    const lIdx = Math.floor(tau / 4) % 3, ph = tau % 4;
    let introAvg = 0;
    SL.forEach((fr, i) => {
      const span = fr * TAU - GAP, start = acc; acc += fr * TAU;
      const st = i * 0.14, e = E.back(clamp((t - st) / 0.75));
      const dy = (1 - e) * 80, op = clamp((t - st) / 0.3);
      introAvg += op / 3;
      let lift = 0, sweep = 0, sx = 0;
      if (tau > 0 && lIdx === i) {
        lift = 6 * (ph < 0.9 ? E.io(ph / 0.9) : ph < 1.1 ? 1 : ph < 2 ? 1 - E.io((ph - 1.1) / 0.9) : 0);
        const qd = E.io(clamp((ph - 0.3) / 1.2));
        sweep = Math.sin(Math.PI * qd); sx = 80 + 440 * qd;
      }
      const a0 = (((start + rot) % TAU) + TAU) % TAU, a1 = a0 + span;
      const yt = CY - H - lift + dy, yb = CY - lift + dy;
      const s = $.sl[i];
      s.t.setAttribute('d', arc(RO, yt, a0, a1, true) + arc(RI, yt, a1, a0, false) + 'Z');
      s.o.setAttribute('d', band(RO, yt, yb, ivs(a0, a1, 0, Math.PI)));
      $.inn[i].setAttribute('d', band(RI, yt, yb, ivs(a0, a1, Math.PI, TAU)));
      s.c0.setAttribute('d', Math.cos(a0) < 0 && Math.sin(a0) > 0 ? cap(a0, yt, yb) : '');
      s.c1.setAttribute('d', Math.cos(a1) > 0 && Math.sin(a1) > 0 ? cap(a1, yt, yb) : '');
      if (sweep > 0.001) {
        s.s.setAttribute('d', s.t.getAttribute('d'));
        s.grad.setAttribute('x1', f(sx - 70)); s.grad.setAttribute('x2', f(sx + 70));
        s.s.setAttribute('fill-opacity', f(sweep * 0.9));
      } else s.s.setAttribute('fill-opacity', '0');
      s.g.setAttribute('opacity', f(op)); $.inn[i].setAttribute('opacity', f(op));
      depth.push([Math.sin(a0 + span / 2), i]); liftOf.push(lift); dyOf.push(dy); spans.push([start, start + span]);
    });
    depth.sort((a, b) => a[0] - b[0]);
    const ord = depth.map(d => d[1]).join('');
    if (ord !== this._order) { this._order = ord; depth.forEach(d => $.slices.appendChild($.sl[d[1]].g)); }
    $.fs.setAttribute('opacity', f(0.2 * introAvg)); $.ao.setAttribute('opacity', f(0.22 * introAvg));

    // X
    const dp = clamp((t - 0.35) / 0.6), xop = E.out(clamp((t - 0.35) / 0.35));
    let xy = -120 * (1 - E.fall(dp)), sx = 1, sy = 1;
    const sp = (t - 0.95) / 0.65;
    if (sp > 0 && sp < 1) {
      if (sp < 0.4) { const k = Math.sin(Math.PI * sp / 0.4); sy = 1 - 0.08 * k; sx = 1 + 0.05 * k; }
      else { const k = Math.sin(Math.PI * (sp - 0.4) / 0.6); sy = 1 + 0.02 * k; sx = 1 - 0.012 * k; }
    }
    const fy = -14 * (1 - Math.cos(TAU * tau / 6)) / 2;
    const tilt = 4 * Math.sin(TAU * tau / 12) * clamp(tau / 1.5);
    const xx = 300 + px * 10, xyy = 195 + xy + fy + py * 10;
    $.x.setAttribute('transform', `translate(${f(xx)} ${f(xyy)}) rotate(${tilt.toFixed(2)}) translate(0 92) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(0 -92)`);
    $.x.setAttribute('opacity', f(xop));
    const hgt = -(xy + fy), ss = 1 / (1 + hgt / 32);
    $.xsh.setAttribute('cx', '304'); $.xsh.setAttribute('cy', '334');
    $.xsh.setAttribute('rx', f(118 * (0.55 + 0.45 * ss))); $.xsh.setAttribute('ry', f(24 * (0.55 + 0.45 * ss)));
    $.xsh.setAttribute('opacity', (0.26 * ss * xop).toFixed(3));

    // sphere
    const se = E.out(clamp((t - 0.55) / 0.9)), sop = clamp((t - 0.55) / 0.3);
    const phi = (155 + 3 * Math.sin(TAU * tau / 12)) * Math.PI / 180;
    const fa = (((phi - rot) % TAU) + TAU) % TAU;
    let under = 0; spans.forEach(([s0, s1], i) => { if (fa >= s0 && fa <= s1 + GAP) under = i; });
    const surf = 350 + 160 * Math.sin(phi) * K - liftOf[under] + dyOf[under];
    const sxp = CX + 160 * Math.cos(phi) - 170 * (1 - se);
    const br = 1 + 0.02 * (1 - Math.cos(TAU * tau / 6)) / 2;
    $.sph.setAttribute('transform', `translate(${f(sxp)} ${f(surf - 27 * br)}) scale(${br.toFixed(4)})`);
    $.sph.setAttribute('opacity', f(sop));
    $.ssh.setAttribute('cx', f(sxp + 6)); $.ssh.setAttribute('cy', f(surf + 1));
    $.ssh.setAttribute('rx', '24'); $.ssh.setAttribute('ry', '7'); $.ssh.setAttribute('opacity', f(0.35 * sop));

    // coin
    const cp = clamp((t - 0.75) / 0.85), ce = E.out(cp), cop = clamp((t - 0.75) / 0.2);
    let ang = -TAU * (1 - ce), wob = 0;
    const cyc = tau % 6;
    if (tau > 0 && cyc >= 2) { const p = (cyc - 2) / 4; ang = 3 * TAU * E.spin(p); wob = 4 * Math.sin(8 * Math.PI * p) * p * p * (1 - p) * 6.75; }
    const c = Math.cos(ang), sn = Math.sin(ang), ac = Math.abs(c);
    const dd = -10 * sn * (c >= 0 ? 1 : -1);
    const coy = -150 * (1 - ce);
    $.coinp.setAttribute('transform', `translate(${f(px * 6)} ${f(py * 6)})`);
    $.coin.setAttribute('transform', `translate(505 ${f(478 + coy)}) rotate(${wob.toFixed(2)}) translate(0 -46)`);
    $.coin.setAttribute('opacity', f(cop));
    $.crb.setAttribute('cx', f(dd)); $.crb.setAttribute('rx', f(Math.max(0.5, 46 * ac)));
    $.crr.setAttribute('x', f(Math.min(0, dd))); $.crr.setAttribute('width', f(Math.abs(dd)));
    $.cf.setAttribute('transform', `scale(${Math.max(0.01, ac).toFixed(3)} 1)`);
    $.csh.setAttribute('cx', f(507 + dd / 2)); $.csh.setAttribute('rx', f(14 + 32 * ac + Math.abs(dd) / 2)); $.csh.setAttribute('ry', '6');
    $.csh.setAttribute('opacity', f(0.3 * cop * (1 - Math.min(1, -coy / 100))));

    // tokens
    const ti = E.out(clamp((t - 1.0) / 0.6));
    $.tback.setAttribute('transform', `translate(${f(px * 18)} ${f(py * 18)})`);
    $.tfront.setAttribute('transform', `translate(${f(px * 18)} ${f(py * 18)})`);
    TOK.forEach((k, i) => {
      const th = k.ph + k.dir * TAU * tau / k.per;
      const x = 300 + k.A * Math.cos(th), y = k.cy + k.B * Math.sin(th), z = Math.sin(th);
      const sc = (0.74 + 0.3 * (z + 1) / 2) * (0.4 + 0.6 * ti);
      const el = $.tok[i];
      el.setAttribute('transform', `translate(${f(x)} ${f(y)}) scale(${sc.toFixed(3)})`);
      el.setAttribute('opacity', ((0.7 + 0.3 * (z + 1) / 2) * ti).toFixed(3));
      $.tblur[i].setAttribute('stdDeviation', (0.7 + 2.6 * (1 - z) / 2).toFixed(2));
      const layer = z >= 0 ? 1 : 0;
      if (layer !== this._tokLayer[i] || !el.parentNode) { this._tokLayer[i] = layer; (layer ? $.tfront : $.tback).appendChild(el); }
    });
  }
}
customElements.define('x-scene', XScene);
}
