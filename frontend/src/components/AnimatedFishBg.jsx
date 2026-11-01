import { useEffect, useRef } from 'react';

/*
 * Hero background: one shoal of fish swims in from the top-left corner,
 * follows the hand-drawn spiral (outer ring → middle ring → link) and then
 * keeps circling the hero text forever.
 *
 * Every point is a fraction of the hero's width / height, traced from the
 * reference drawing. Each ring runs the same way round: down the left side,
 * right along the bottom, up the right side, left along the top.
 */

// Ring 1 — from the top-left corner around the whole screen
const OUTER = [
  [0.001, 0.001], [0.020, 0.098], [0.021, 0.155], [0.022, 0.212], [0.043, 0.293],
  [0.047, 0.350], [0.048, 0.455], [0.055, 0.545], [0.063, 0.625], [0.067, 0.720],
  [0.073, 0.830], [0.080, 0.887], [0.094, 0.928], [0.112, 0.950], [0.147, 0.955],
  [0.199, 0.952], [0.262, 0.955], [0.347, 0.952], [0.410, 0.952], [0.471, 0.954],
  [0.515, 0.950], [0.575, 0.948], [0.610, 0.938], [0.644, 0.935], [0.725, 0.935],
  [0.759, 0.916], [0.802, 0.880], [0.819, 0.815], [0.839, 0.718], [0.844, 0.650],
  [0.848, 0.564], [0.850, 0.484], [0.848, 0.392], [0.846, 0.320], [0.836, 0.258],
  [0.824, 0.228], [0.805, 0.198], [0.779, 0.171], [0.750, 0.150], [0.713, 0.141],
  [0.685, 0.135], [0.645, 0.124], [0.605, 0.113], [0.560, 0.112], [0.487, 0.105],
  [0.451, 0.114], [0.418, 0.122], [0.393, 0.130], [0.360, 0.148], [0.332, 0.157],
  [0.303, 0.175], [0.286, 0.215], [0.273, 0.260], [0.258, 0.292],
];

// Ring 2 — the middle loop
const MIDDLE = [
  [0.245, 0.325], [0.228, 0.357], [0.234, 0.395], [0.246, 0.440], [0.248, 0.495],
  [0.252, 0.530], [0.258, 0.590], [0.269, 0.635], [0.279, 0.682], [0.287, 0.725],
  [0.297, 0.785], [0.310, 0.815], [0.368, 0.852], [0.392, 0.862], [0.408, 0.890],
  [0.440, 0.905], [0.494, 0.924], [0.540, 0.925], [0.584, 0.932], [0.611, 0.905],
  [0.628, 0.845], [0.678, 0.812], [0.692, 0.782], [0.710, 0.726], [0.729, 0.690],
  [0.747, 0.646], [0.757, 0.605], [0.761, 0.540], [0.756, 0.495], [0.745, 0.455],
  [0.734, 0.412], [0.718, 0.372], [0.695, 0.330], [0.677, 0.290], [0.650, 0.245],
  [0.618, 0.222], [0.560, 0.203], [0.514, 0.206], [0.470, 0.205], [0.425, 0.204],
  [0.362, 0.201], [0.339, 0.216], [0.313, 0.236], [0.285, 0.262],
];

// Link — swings out to the left and sweeps into the bottom of the inner ring
const LINK = [
  [0.240, 0.300], [0.215, 0.320], [0.190, 0.335], [0.175, 0.365], [0.166, 0.420],
  [0.160, 0.470], [0.165, 0.515], [0.180, 0.578], [0.215, 0.607], [0.254, 0.634],
  [0.282, 0.642], [0.315, 0.662], [0.344, 0.678], [0.385, 0.692], [0.420, 0.703],
  [0.447, 0.712],
];

// Ring 3 — closed loop around the text; the shoal circles this forever
const INNER = [
  [0.475, 0.713], [0.505, 0.716], [0.534, 0.718], [0.577, 0.694], [0.615, 0.665],
  [0.652, 0.611], [0.676, 0.545], [0.660, 0.485], [0.633, 0.402], [0.611, 0.335],
  [0.590, 0.275], [0.571, 0.268], [0.533, 0.270], [0.482, 0.265], [0.440, 0.276],
  [0.414, 0.283], [0.389, 0.300], [0.360, 0.335], [0.346, 0.365], [0.344, 0.415],
  [0.343, 0.465], [0.347, 0.520], [0.353, 0.568], [0.360, 0.610], [0.378, 0.642],
  [0.398, 0.668], [0.420, 0.684], [0.447, 0.700],
];

const REF_TEXT_CENTER = [0.4986, 0.503];
const MID_W = 0.3;
const LEAD_SECONDS = 8;
const ORBIT_SECONDS = 12;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const lerpT = (a, b, ta, tb, t) => {
  const f = (t - ta) / (tb - ta);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
};

function sampleSegment(p0, p1, p2, p3, out) {
  const knot = (a, b) => Math.max(Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])), 1e-4);
  const t1 = knot(p0, p1);
  const t2 = t1 + knot(p1, p2);
  const t3 = t2 + knot(p2, p3);
  const steps = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 4));
  for (let k = 0; k < steps; k++) {
    const t = t1 + (t2 - t1) * (k / steps);
    const a1 = lerpT(p0, p1, 0, t1, t);
    const a2 = lerpT(p1, p2, t1, t2, t);
    const a3 = lerpT(p2, p3, t2, t3, t);
    const b1 = lerpT(a1, a2, 0, t2, t);
    const b2 = lerpT(a2, a3, t1, t3, t);
    out.push(lerpT(b1, b2, t1, t2, t));
  }
}

function buildPath(w, h, text) {
  const [rcx, rcy] = REF_TEXT_CENTER;
  let kx = 1;
  let ky = 1;
  let cx = rcx;
  let cy = rcy;

  if (text && text.width > 0 && text.height > 0) {
    cx = (text.left + text.width / 2) / w;
    cy = (text.top + text.height / 2) / h;
    const xs = INNER.map((p) => p[0]);
    const ys = INNER.map((p) => p[1]);
    const left = rcx - Math.min(...xs);
    const right = Math.max(...xs) - rcx;
    const top = rcy - Math.min(...ys);
    const bottom = Math.max(...ys) - rcy;
    const pad = Math.min(56, w * 0.08);
    kx = Math.max(1, (text.width / 2 + pad) / (Math.min(left, right) * w));
    ky = Math.max(1, (text.height / 2 + pad * 0.85) / (Math.min(top, bottom) * h));
    kx = Math.min(kx, Math.max(1, (0.5 * w - 12) / (Math.max(left, right) * w)));
    ky = Math.min(ky, Math.max(1, (0.5 * h - 12) / (Math.max(top, bottom) * h)));
  }

  const place = ([x, y], wgt) => {
    if (wgt === 0) return [x * w, y * h];
    const sx = 1 + (kx - 1) * wgt;
    const sy = 1 + (ky - 1) * wgt;
    const px = rcx + (cx - rcx) * wgt + (x - rcx) * sx;
    const py = rcy + (cy - rcy) * wgt + (y - rcy) * sy;
    return [clamp(px * w, 14, w - 14), clamp(py * h, 14, h - 14)];
  };

  const pts = [];
  const rampFrom = OUTER.length - 3;
  OUTER.forEach((p, i) => pts.push(place(p, i < rampFrom ? 0 : (MID_W * (i - rampFrom + 1)) / 3)));
  MIDDLE.forEach((p) => pts.push(place(p, MID_W)));
  LINK.forEach((p, i) => pts.push(place(p, MID_W + ((1 - MID_W) * (i + 1)) / LINK.length)));

  const a = pts[0];
  const b = pts[1];
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  pts.unshift([a[0] - ((b[0] - a[0]) / d) * 160, a[1] - ((b[1] - a[1]) / d) * 160]);

  const e1 = pts.length;
  INNER.forEach((p) => pts.push(place(p, 1)));
  const e2 = pts.length;
  INNER.forEach((p) => pts.push(place(p, 1)));
  const e3 = pts.length;
  INNER.slice(0, 4).forEach((p) => pts.push(place(p, 1)));

  const n = pts.length;
  const get = (i) => {
    if (i < 0) return [2 * pts[0][0] - pts[1][0], 2 * pts[0][1] - pts[1][1]];
    if (i >= n) return [2 * pts[n - 1][0] - pts[n - 2][0], 2 * pts[n - 1][1] - pts[n - 2][1]];
    return pts[i];
  };

  const raw = [];
  const segStart = [];
  for (let i = 0; i < n - 1; i++) {
    segStart.push(raw.length);
    sampleSegment(get(i - 1), get(i), get(i + 1), get(i + 2), raw);
  }
  segStart.push(raw.length);
  raw.push(pts[n - 1]);

  const R = 8;
  const N = raw.length;
  const X = new Float64Array(N);
  const Y = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let sx = 0;
    let sy = 0;
    let c = 0;
    for (let j = Math.max(0, i - R); j <= Math.min(N - 1, i + R); j++) {
      sx += raw[j][0];
      sy += raw[j][1];
      c++;
    }
    X[i] = sx / c;
    Y[i] = sy / c;
  }

  const S = new Float64Array(N);
  const TX = new Float64Array(N);
  const TY = new Float64Array(N);
  for (let i = 1; i < N; i++) S[i] = S[i - 1] + Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]);
  for (let i = 0; i < N; i++) {
    const i0 = Math.max(0, i - 2);
    const i1 = Math.min(N - 1, i + 2);
    const dx = X[i1] - X[i0];
    const dy = Y[i1] - Y[i0];
    const l = Math.hypot(dx, dy) || 1;
    TX[i] = dx / l;
    TY[i] = dy / l;
  }

  return { X, Y, S, TX, TY, sE1: S[segStart[e1]], sE2: S[segStart[e2]], sE3: S[segStart[e3]] };
}

function pointAt(path, s, out) {
  const { X, Y, S, TX, TY, sE2, sE3 } = path;
  if (s >= sE2) s = sE2 + ((s - sE2) % (sE3 - sE2));
  if (s <= 0) {
    out.x = X[0] + TX[0] * s;
    out.y = Y[0] + TY[0] * s;
    out.tx = TX[0];
    out.ty = TY[0];
    return out;
  }
  let lo = 0;
  let hi = S.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (S[mid] <= s) lo = mid;
    else hi = mid;
  }
  const f = (s - S[lo]) / (S[hi] - S[lo] || 1);
  out.x = X[lo] + (X[hi] - X[lo]) * f;
  out.y = Y[lo] + (Y[hi] - Y[lo]) * f;
  const tx = TX[lo] + (TX[hi] - TX[lo]) * f;
  const ty = TY[lo] + (TY[hi] - TY[lo]) * f;
  const l = Math.hypot(tx, ty) || 1;
  out.tx = tx / l;
  out.ty = ty / l;
  return out;
}

function drawFish(ctx, s, alpha, tail) {
  const c = Math.cos(tail);
  const sn = Math.sin(tail);
  const px = -0.55 * s;
  const tx = (x, y) => px + (x * c - y * sn) * s;
  const ty = (x, y) => (x * sn + y * c) * s;

  ctx.beginPath();
  ctx.moveTo(s, 0);
  ctx.bezierCurveTo(0.7 * s, -0.28 * s, 0.3 * s, -0.35 * s, -0.1 * s, -0.18 * s);
  ctx.bezierCurveTo(-0.3 * s, -0.12 * s, -0.5 * s, -0.08 * s, -0.55 * s, -0.05 * s);
  ctx.lineTo(tx(-0.3, -0.25), ty(-0.3, -0.25));
  ctx.lineTo(tx(-0.05, 0), ty(-0.05, 0));
  ctx.lineTo(tx(-0.3, 0.25), ty(-0.3, 0.25));
  ctx.lineTo(-0.55 * s, 0.05 * s);
  ctx.bezierCurveTo(-0.5 * s, 0.08 * s, -0.3 * s, 0.12 * s, -0.1 * s, 0.18 * s);
  ctx.bezierCurveTo(0.3 * s, 0.35 * s, 0.7 * s, 0.28 * s, s, 0);
  ctx.closePath();
  ctx.fillStyle = `rgba(15, 25, 35, ${alpha})`;
  ctx.fill();

  if (s > 10) {
    ctx.beginPath();
    ctx.moveTo(0.2 * s, -0.3 * s);
    ctx.quadraticCurveTo(0.05 * s, -0.5 * s, -0.15 * s, -0.32 * s);
    ctx.closePath();
    ctx.fillStyle = `rgba(15, 25, 35, ${alpha * 0.7})`;
    ctx.fill();
  }
}

export default function AnimatedFishBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas && canvas.parentElement;
    if (!canvas || !parent) return undefined;
    const ctx = canvas.getContext('2d');

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vw = window.innerWidth;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const count = isIOS ? 25 : vw < 600 ? 60 : vw < 1100 ? 90 : 130;
    const fish = [];
    for (let i = 0; i < count; i++) {
      const sizeN = Math.pow(Math.random(), 1.4);
      fish.push({
        u: (i + Math.random()) / count,
        lane: Math.random() * 2 - 1,
        sizeN,
        alpha: 0.18 + sizeN * 0.22,
        phase: Math.random() * Math.PI * 2,
        beat: Math.random() * Math.PI * 2,
        beatRate: 0.85 + Math.random() * 0.3,
        drift: 0.5 + Math.random() * 0.6,
      });
    }

    const st = { path: null, head: null, w: 0, h: 0, band: 30, packLen: 600, sizeScale: 1 };
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    const pt = { x: 0, y: 0, tx: 1, ty: 0 };

    const setup = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, isIOS ? 1 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let text = null;
      const textEl = parent.querySelector('.hero-content');
      if (textEl) {
        const pr = parent.getBoundingClientRect();
        const tr = textEl.getBoundingClientRect();
        text = { left: tr.left - pr.left, top: tr.top - pr.top, width: tr.width, height: tr.height };
      }

      const old = st.path;
      const path = buildPath(w, h, text);
      const lap = path.sE3 - path.sE2;

      if (st.head === null) {
        st.head = reduced ? path.sE1 + lap * 1.2 : -(path.sE1 / LEAD_SECONDS) * 0.3;
      } else if (old) {
        const oldLap = old.sE3 - old.sE2;
        st.head =
          st.head < old.sE1
            ? st.head * (path.sE1 / old.sE1)
            : path.sE1 + (st.head - old.sE1) * (lap / oldLap);
      }

      st.path = path;
      st.w = w;
      st.h = h;
      st.band = clamp(Math.min(w, h) * 0.04, 16, 42);
      st.packLen = lap;
      st.sizeScale = clamp(Math.min(w, h) / 900, 0.6, 1.15);
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      const { path, packLen, band, sizeScale } = st;
      if (path) {
        const lap = path.sE3 - path.sE2;
        const vFast = path.sE1 / LEAD_SECONDS;
        const vSlow = (lap / ORBIT_SECONDS) * (reduced ? 0.6 : 1);

        const tailPos = st.head - packLen;
        const decelStart = path.sE1 - lap * 0.35;
        const decelEnd = path.sE1 + lap * 0.15;
        let k = clamp((tailPos - decelStart) / (decelEnd - decelStart), 0, 1);
        k = k * k * (3 - 2 * k);
        const v = vFast + (vSlow - vFast) * k;
        st.head += v * dt;
        const fastness = 1 - k;

        if (visible) {
          ctx.clearRect(0, 0, st.w, st.h);
          for (let i = 0; i < fish.length; i++) {
            const f = fish[i];
            const s = st.head - f.u * packLen + Math.sin(time * 0.9 * f.drift + f.phase) * 6;
            if (s < 0) continue;

            pointAt(path, s, pt);
            const spindle = Math.pow(Math.sin(Math.PI * (0.08 + 0.84 * f.u)), 0.7);
            const env = spindle + (1 - spindle) * k;
            const lat =
              band * f.lane * env + Math.sin(time * 0.6 * f.drift + f.phase * 1.7) * band * 0.15;
            const x = pt.x - pt.ty * lat;
            const y = pt.y + pt.tx * lat;

            f.beat += dt * (7 + 7 * fastness) * f.beatRate;
            const tail = Math.sin(f.beat) * 0.35;
            const size = (6 + f.sizeN * 14) * sizeScale;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.atan2(pt.ty, pt.tx) - tail * 0.15);
            drawFish(ctx, size, f.alpha, tail);
            ctx.restore();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    setup();
    raf = requestAnimationFrame(frame);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => setup());
      ro.observe(parent);
      const textEl = parent.querySelector('.hero-content');
      if (textEl) ro.observe(textEl);
    } else {
      window.addEventListener('resize', setup);
    }

    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', setup);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-fish-bg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
