import React, { useCallback, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
uniform vec2 uCenter;
uniform float uScale;
uniform float uSteps;

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm2(vec2 p) {
  float v = 0.0;
  float amp = 0.52;
  for (int i = 0; i < 4; i++) {
    v += amp * noise2(p);
    p = p * 2.15 + 7.1;
    amp *= 0.48;
  }
  return v;
}

vec3 backgroundStars(vec3 dir) {
  vec3 col = vec3(0.0003, 0.0004, 0.0008);

  vec3 pStar = dir * 200.0;
  vec3 iStar = floor(pStar);
  vec3 fStar = fract(pStar) - 0.5;
  float rnd = hash13(iStar);
  if (rnd > 0.985) {
    vec3 offset = (hash33(iStar) - 0.5) * 0.65;
    float dist = length(fStar - offset);
    float size = 0.045 + 0.055 * fract(rnd * 137.1);
    float glow = exp(-dist * dist / (size * size * 0.20));
    float twinkle = 0.75 + 0.25 * sin(uTime * 2.5 + rnd * 60.0);
    vec3 starCol = mix(vec3(1.0), vec3(0.68, 0.68, 0.68), fract(rnd * 43.1));
    if (fract(rnd * 89.2) > 0.85) starCol = vec3(0.86);
    col += starCol * glow * twinkle * 2.2;
  }

  return col;
}

vec4 sampleDisk(vec3 hit, vec3 rayDir) {
  float rad = length(hit.xz);
  float innerR = 1.88;
  float outerR = 7.6;
  if (rad < innerR || rad > outerR) return vec4(0.0);

  float speed = 1.55 / (sqrt(rad) + 0.25);
  float angle = -uTime * speed;
  float ca = cos(angle), sa = sin(angle);
  vec2 rotP = vec2(ca * hit.x - sa * hit.z, sa * hit.x + ca * hit.z);

  float turb = fbm2(rotP * 0.95);
  float bands = 0.35 * sin(rad * 22.0 + turb * 2.8 - uTime * 0.2)
              + 0.25 * sin(rad * 46.0)
              + 0.20 * sin(rad * 8.5)
              + 0.45;
  float edgeIn = smoothstep(innerR, innerR + 0.35, rad);
  float edgeOut = smoothstep(outerR, outerR - 1.5, rad);
  float density = edgeIn * edgeOut * (0.35 + 0.65 * turb) * (0.5 + 0.5 * bands);

  vec3 diskVelocity = normalize(vec3(-hit.z, 0.0, hit.x));
  float doppler = dot(diskVelocity, -rayDir);
  float dop = clamp(1.0 + 0.62 * doppler, 0.15, 2.7);
  float dopplerFactor = dop * dop * dop * sqrt(dop);

  vec3 colHot = vec3(1.42);
  vec3 colMid = vec3(0.99);
  vec3 colWarm = vec3(0.78);
  vec3 colOuter = vec3(0.34);

  vec3 col = mix(colOuter, colWarm, smoothstep(0.0, 0.35, density));
  col = mix(col, colMid, smoothstep(0.3, 0.7, density));
  col = mix(col, colHot, smoothstep(0.65, 0.98, density));

  float innerGlow = smoothstep(innerR + 0.95, innerR, rad);
  col += colHot * innerGlow * innerGlow * 2.4;

  col *= dopplerFactor * 1.95;
  float alpha = smoothstep(0.015, 0.32, density);
  return vec4(col, alpha);
}

vec3 traceScene(vec2 uv) {
  vec3 camPos = uCamPos;
  vec3 fwd = uCamFwd;
  vec3 right = uCamRight;
  vec3 up = uCamUp;
  float fov = 0.85;
  vec3 dir = normalize(fwd + uv.x * fov * right + uv.y * fov * up);

  vec3 pos = camPos;
  vec3 hvec = cross(pos, dir);
  float h2 = dot(hvec, hvec);
  float eventR = 1.0;
  float photonR = 1.52;

  vec4 diskAccum = vec4(0.0);
  bool captured = false;
  float minR = 1000.0;
  int diskCrossings = 0;

  // the walk through the curved space is the expensive part of the frame.
  // the step budget is set from the outside, so a slow device spends less
  // of it and a quick one keeps every detail
  for (int i = 0; i < 300; i++) {
    if (float(i) >= uSteps) break;
    vec3 prevPos = pos;
    float r = length(pos);
    minR = min(minR, r);

    float dt = clamp(r * 0.042, 0.005, 0.85);
    float r2safe = max(dot(pos, pos), 0.55);
    vec3 acc = -1.65 * h2 * pos / (r2safe * r2safe * sqrt(r2safe));
    dir = normalize(dir + acc * dt);
    pos += dir * dt;

    if (r < eventR) {
      captured = true;
      break;
    }

    if (prevPos.y * pos.y < 0.0 && diskAccum.a < 0.98) {
      float t = prevPos.y / (prevPos.y - pos.y);
      vec3 hit = mix(prevPos, pos, t);
      vec4 dc = sampleDisk(hit, dir);
      if (diskCrossings >= 2) {
        dc.rgb *= 0.35;
        dc.a *= 0.35;
      }
      diskAccum.rgb += dc.rgb * dc.a * (1.0 - diskAccum.a);
      diskAccum.a += dc.a * (1.0 - diskAccum.a);
      diskCrossings++;
    }

    if (r > 40.0) {
      break;
    }
  }

  vec3 col = diskAccum.rgb;
  if (!captured) {
    col += backgroundStars(normalize(dir)) * (1.0 - diskAccum.a);
    float ringGlow = exp(-abs(minR - photonR) * 22.0);
    col += vec3(1.0) * ringGlow * 2.9;
    float ringHalo = exp(-abs(minR - photonR) * 4.2);
    col += vec3(0.95) * ringHalo * 0.5;
    float halo = exp(-abs(minR - photonR) * 0.85);
    col += vec3(0.7) * halo * 0.34;
  }

  float dScreen = length(uv);
  float bloom = exp(-max(0.0, dScreen - 0.58) * 3.1);
  col += vec3(0.62) * bloom * 0.17;

  return col;
}

void main() {
  float minDim = min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - uCenter * uRes) / minDim * uScale;
  vec3 col = traceScene(uv);
  col = col / (1.0 + col);
  col = pow(col, vec3(0.86));
  vec2 vigUv = (gl_FragCoord.xy - 0.5 * uRes) / minDim;
  float vig = 1.0 - 0.22 * smoothstep(0.35, 1.5, length(vigUv));
  col *= vig;
  gl_FragColor = vec4(col, 1.0);
}
`;

const BLIT_SRC = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
void main() {
  gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0);
}
`;

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(err || 'Shader compile failed');
  }
  return sh;
}

function createProgram(gl, vsSrc, fsSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'aPos');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(err || 'Program link failed');
  }
  return prog;
}

function makeTarget(gl) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer();
  const t = { tex, fb, w: 0, h: 0 };
  t.size = (w, h) => {
    if (t.w === w && t.h === h) return;
    t.w = w;
    t.h = h;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  };
  t.free = () => {
    gl.deleteTexture(tex);
    gl.deleteFramebuffer(fb);
  };
  return t;
}

const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function rotate(v, k, ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const kv = cross(k, v);
  const d = dot(k, v) * (1 - c);
  return [v[0] * c + kv[0] * s + k[0] * d, v[1] * c + kv[1] * s + k[1] * d, v[2] * c + kv[2] * s + k[2] * d];
}

// the disk opens far enough that the hole reads as a big body of light
// reaching across the frame, rather than a thin band that leaves half
// the page bare
const DEFAULT_PITCH = 0.34;
const DEFAULT_DIST = 26.0;
// how far the eye sits below the middle of the band, to compensate for the
// bright limb of the disk glowing above the eye point
const BRIGHT_LIFT = 16;

const isWideScreen = () =>
  typeof window !== 'undefined' && window.innerWidth >= 768;

function defaultFrame() {
  const cp = Math.cos(DEFAULT_PITCH);
  const back = [0.0, Math.sin(DEFAULT_PITCH), -cp];
  const right = norm(cross([0, 1, 0], back));
  const up = cross(back, right);
  return { right, up, back };
}

const QUALITY = [0.8, 0.9, 1.0];
// how many steps of the ray walk each quality level is allowed to take
const STEPS = [110, 190, 300];
const COMPACT_HEIGHT = 560;
// the apparent width of the hole in css pixels, for a given camera scale
const FIT_SPAN = 0.674;
const TILT_BASE = 0.3986;
const TILT_GROW = 0.4111;
const PITCH_MIN = -0.62;
const PITCH_MAX = 0.62;
const SENS = 0.0036;
const FOLLOW_TAU = 0.075;
const VEL_TAU = 0.09;
const GLIDE = 2.0;
const MAX_RATE = 3.0;
const DRIFT = 0.055;
// how far the camera pulls back while the hole is being spun
const DOLLY_MAX = 0.46;

const LABELS = {
  en: { hint: 'Drag to turn it any way, pinch or Ctrl and scroll to zoom', reset: 'Reset view' },
  ru: { hint: 'Тяните, чтобы повернуть в любую сторону, щипок или Ctrl и колесо для зума', reset: 'Сбросить вид' },
};

export function QuasarScene({ lang = 'en', copyRef = null }) {
  const labels = LABELS[lang] || LABELS.en;
  const canvasRef = useRef(null);
  const layoutRef = useRef({ ready: false, scale: 1, eyeY: 0, room: 1, compact: false, shiftX: 0 });
  const rectRef = useRef({ width: 0, height: 0, top: 0, left: 0 });
  const stateRef = useRef({
    ...defaultFrame(),
    dist: DEFAULT_DIST,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    velX: 0,
    velY: 0,
    pendingX: 0,
    pendingY: 0,
    fit: 1,
    spin: 0,
    hole: { x: 0, y: 0, r: 0 },
  });

  useEffect(() => {
    const measure = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();
      const canvasW = canvasRect.width;
      const canvasH = canvasRect.height;
      rectRef.current = {
        width: canvasW,
        height: canvasH,
        top: canvasRect.top,
        left: canvasRect.left,
      };
      // a phone gets its own framing: the hole has to fit the width of the
      // screen with a margin on both sides, however the disk happens to
      // lean while it turns
      const phone = canvasW < 768;
      const compact = window.innerHeight < COMPACT_HEIGHT;
      if (!phone && !compact) {
        layoutRef.current = { ready: false, scale: 1, eyeY: 0, room: 1, compact: false, shiftX: 0 };
        return;
      }
      const scrollY = window.scrollY;
      const canvasDocTop = canvasRect.top + scrollY;
      const navHead = document.querySelector('.nav-head');
      const pill = document.querySelector('.nav-pill');
      let plateBottom = 68;
      if (navHead && pill) {
        const headTop = parseFloat(getComputedStyle(navHead).top);
        const pillH = pill.getBoundingClientRect().height;
        plateBottom = (Number.isFinite(headTop) ? headTop : 0) + pillH;
      }
      const copy = copyRef ? copyRef.current : null;
      const copyDocTop = copy
        ? copy.getBoundingClientRect().top + scrollY
        : canvasDocTop + canvasH * 0.44;
      const band = Math.max(60, copyDocTop - plateBottom);
      const gap = phone || compact ? 14 : 26;
      const room = Math.max(46, band - gap * 2);
      const minCss = Math.min(canvasW, canvasH);
      // the hole is the centerpiece: it sits dead centre, so the disk is
      // sized to leave the same margin on both sides of the frame
      const wanted = canvasW * (phone ? 0.82 : 0.80);
      const byHeight = room / 0.76;
      const apparent = Math.max(120, Math.min(wanted, byHeight));
      let scale = (FIT_SPAN * minCss) / apparent;
      if (scale > 3.4) scale = 3.4;
      // the bright limb of the disk reads a touch above the eye point, so the
      // eye is placed a little below the middle of the band to leave the
      // same air above and below the ring on any screen height
      const eyeMid = plateBottom + band / 2 + BRIGHT_LIFT;
      layoutRef.current = {
        ready: true,
        scale,
        room,
        // the hole sits on the centre line, so the ring reads as the
        // subject of the frame rather than something leaning to one side
        shiftX: 0,
        // the ring is centred in the band, so it is neither pinned under the
        // plate nor left adrift above the copy
        eyeY: eyeMid - canvasDocTop,
        compact,
      };
    };
    measure();
    // the two layouts frame the hole differently, so a change of size
    // across the line between them starts the camera afresh
    let wasWide = isWideScreen();
    const onResize = () => {
      const wide = isWideScreen();
      if (wide !== wasWide) {
        wasWide = wide;
        Object.assign(stateRef.current, defaultFrame(), {
          dist: DEFAULT_DIST,
          velX: 0,
          velY: 0,
          pendingX: 0,
          pendingY: 0,
          spin: 0,
        });
      }
      measure();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', measure);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (observer) {
      if (canvasRef.current) observer.observe(canvasRef.current);
      if (copyRef && copyRef.current) observer.observe(copyRef.current);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', measure);
      if (observer) observer.disconnect();
    };
  }, [copyRef]);

  const resetCamera = useCallback(() => {
    Object.assign(stateRef.current, defaultFrame(), {
      dist: DEFAULT_DIST,
      velX: 0,
      velY: 0,
      pendingX: 0,
      pendingY: 0,
      spin: 0,
    });
    stateRef.current.wake?.();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false });
    } catch {
      return;
    }
    if (!gl) return;

    let progs;
    try {
      progs = {
        scene: createProgram(gl, VERT_SRC, FRAG_SRC),
        blit: createProgram(gl, VERT_SRC, BLIT_SRC),
      };
    } catch {
      return;
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const loc = {};
    Object.entries(progs).forEach(([key, p]) => {
      loc[key] = {};
      ['uRes', 'uTime', 'uCamPos', 'uCamRight', 'uCamUp', 'uCamFwd', 'uCenter', 'uScale', 'uSteps', 'uTex'].forEach((n) => {
        loc[key][n] = gl.getUniformLocation(p, n);
      });
    });
    const sceneT = makeTarget(gl);

    let quality = QUALITY.length - 1;
    let frameSum = 0;
    let frameCount = 0;
    let lastDraw = 0;
    let windowStart = performance.now();
    canvas.dataset.quality = String(QUALITY.length - 1);
    // the number of frames actually put on the screen, so a caller can
    // wait for the scene to be on the glass instead of guessing at a delay
    let frames = 0;
    canvas.dataset.frames = '0';
    const FRAME_MIN = 1000 / 61;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let running = false;

    let animId;
    let t0 = performance.now();

    const pass = (prog, target, w, h) => {
      gl.useProgram(prog);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.viewport(0, 0, w, h);
    };
    const bindTex = (unit, tex, uniform) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uniform, unit);
    };

    const render = (now) => {
      if (now - lastDraw < FRAME_MIN) {
        animId = requestAnimationFrame(render);
        return;
      }
      const rawDt = (now - t0) * 0.001;
      const dt = Math.min(rawDt, 0.1);
      t0 = now;
      frames += 1;
      canvas.dataset.frames = String(frames);
      if (lastDraw) {
        frameSum += now - lastDraw;
        frameCount++;
        // the window is a slice of time rather than a number of frames, so
        // a weak device settles in a second or so instead of waiting for
        // twenty slow frames to pile up
        if (frameCount >= 3 && now - windowStart > 600) {
          const avg = frameSum / frameCount;
          if (avg > 45 && quality > 0) {
            // a device far off the pace drops more than one level at once
            quality = avg > 200 ? Math.max(0, quality - 2)
              : avg > 90 ? Math.max(0, quality - 1)
                : quality - 1;
          } else if (avg < 26 && quality < QUALITY.length - 1) {
            quality++;
          }
          frameSum = 0;
          frameCount = 0;
          windowStart = now;
          canvas.dataset.quality = String(quality);
        }
      }
      lastDraw = now;

      const rect = rectRef.current.width > 0 ? rectRef.current : canvas.getBoundingClientRect();
      const isMobile = rect.width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const outW = Math.max(1, Math.round(rect.width * dpr));
      const outH = Math.max(1, Math.round(rect.height * dpr));
      const sw = Math.max(1, Math.round(rect.width * dpr * QUALITY[quality]));
      const sh = Math.max(1, Math.round(rect.height * dpr * QUALITY[quality]));

      if (canvas.width !== outW || canvas.height !== outH) {
        canvas.width = outW;
        canvas.height = outH;
      }
      sceneT.size(sw, sh);

      const st = stateRef.current;
      const follow = 1 - Math.exp(-dt / FOLLOW_TAU);
      const takeX = st.pendingX * follow;
      const takeY = st.pendingY * follow;
      st.pendingX -= takeX;
      st.pendingY -= takeY;
      if (import.meta.env.DEV) {
        st.applied = (st.applied || 0) + takeX;
        st.appliedGlide = (st.appliedGlide || 0) + (st.isDragging ? 0 : st.velX * dt);
      }
      if (st.isDragging) {
        turn(takeX, takeY);
      } else {
        const damp = Math.exp(-GLIDE * dt);
        st.velX *= damp;
        st.velY *= damp;
        const yawRate = st.velX + (reduceMotion.matches ? 0 : DRIFT);
        turn(takeX + yawRate * dt, takeY + st.velY * dt);
      }

      // spinning the hole pulls the camera back, and it drifts in again
      // once the hand lets go. the return follows the clock, not the frame
      // rate, so a slow device recovers in the same time as a fast one
      const spinDt = Math.min(rawDt, 0.5);
      st.spin = st.isDragging
        ? Math.min(1, st.spin + spinDt * 1.15)
        : Math.max(0, st.spin - spinDt * 0.55);
      const dolly = 1 + DOLLY_MAX * st.spin;

      const pos = st.back.map((v) => v * st.dist * dolly);
      const fwd = st.back.map((v) => -v);

      let center;
      let scale;
      const minCss = Math.min(rect.width, rect.height);
      const layout = layoutRef.current;
      if (isMobile || layout.compact) {
        if (layout.ready) {
          scale = layout.scale;
          // the bright limb of the disk leans to one side, so the whole
          // ring is nudged back the other way to stay inside the frame
          center = [0.5 - (layout.shiftX || 0), 1 - layout.eyeY / rect.height];
        } else {
          center = [0.5, 0.7];
          scale = 1.0;
        }
      } else {
        const cssW = rect.width;
        let textRight = 760;
        if (cssW >= 1440) textRight = (cssW - 1440) / 2 + 760;
        else if (cssW < 1280) textRight = Math.min(760, cssW * 0.58);
        const free = Math.max(cssW - textRight, 200);
        scale = Math.max(0.6, Math.min(1.8, (0.52 * minCss) / free));
        center = [(textRight + free * 0.18) / cssW, 0.47];
      }
      if ((isMobile || layout.compact) && layout.ready) {
        const pitch = Math.asin(Math.max(-1, Math.min(1, st.back[1])));
        const tilt = Math.abs(Math.sin(pitch));
        const need = ((TILT_BASE + TILT_GROW * tilt) * minCss) / layout.room;
        const target = Math.max(1, need / layout.scale);
        st.fit += (target - st.fit) * Math.min(1, dt * 8);
        scale *= st.fit;
      } else {
        st.fit = 1;
      }
      scale *= st.dist / DEFAULT_DIST;

      const holeR = (0.37 * minCss) / scale;
      st.hole = { x: center[0] * rect.width, y: (1 - center[1]) * rect.height, r: holeR };

      const S = loc.scene;
      pass(progs.scene, sceneT, sw, sh);
      gl.uniform2f(S.uRes, sw, sh);
      gl.uniform1f(S.uTime, (now * 0.001) % 3600);
      gl.uniform3fv(S.uCamPos, pos);
      gl.uniform3fv(S.uCamRight, st.right);
      gl.uniform3fv(S.uCamUp, st.up);
      gl.uniform3fv(S.uCamFwd, fwd);
      gl.uniform2f(S.uCenter, center[0], center[1]);
      gl.uniform1f(S.uScale, scale);
      gl.uniform1f(S.uSteps, STEPS[quality]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      pass(progs.blit, null, outW, outH);
      bindTex(0, sceneT.tex, loc.blit.uTex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const moving = st.isDragging
        || Math.abs(st.velX) > 0.002
        || Math.abs(st.velY) > 0.002
        || Math.abs(st.pendingX) > 0.0001
        || Math.abs(st.pendingY) > 0.0001;
      if (visible && (!reduceMotion.matches || moving)) {
        animId = requestAnimationFrame(render);
      } else {
        running = false;
      }
    };

    const turn = (a, b) => {
      const st = stateRef.current;
      let { right, up, back } = st;
      if (a) {
        back = rotate(back, up, a);
        right = rotate(right, up, a);
      }
      if (b) {
        back = rotate(back, right, b);
        up = rotate(up, right, b);
      }
      back = norm(back);
      right = norm(cross(up, back));
      up = cross(back, right);
      const pitch = Math.asin(Math.max(-1, Math.min(1, back[1])));
      if (pitch > PITCH_MAX || pitch < PITCH_MIN) {
        const target = Math.max(PITCH_MIN, Math.min(PITCH_MAX, pitch));
        back = norm(rotate(back, right, target - pitch));
        right = norm(cross(up, back));
        up = cross(back, right);
        st.velY = 0;
        st.pendingY = 0;
      }
      Object.assign(st, { right, up, back });
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      t0 = performance.now();
      lastDraw = 0;
      animId = requestAnimationFrame(render);
    };
    stateRef.current.wake = start;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    observer.observe(canvas);
    reduceMotion.addEventListener('change', start);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(animId);
      running = false;
      visible = false;
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    if (import.meta.env.DEV) window.__hotaru = stateRef.current;
    start();

    const dragTo = (x, y) => {
      const st = stateRef.current;
      const now = performance.now();
      const dx = x - st.lastX;
      const dy = y - st.lastY;
      const dt = Math.min(0.2, Math.max(0.005, (now - st.lastT) / 1000));
      st.lastX = x;
      st.lastY = y;
      st.lastT = now;
      st.pendingX += -dx * SENS;
      st.pendingY += dy * SENS;
      const k = 1 - Math.exp(-dt / VEL_TAU);
      st.velX += (-dx * SENS / dt - st.velX) * k;
      st.velY += (dy * SENS / dt - st.velY) * k;
      st.velX = Math.max(-MAX_RATE, Math.min(MAX_RATE, st.velX));
      st.velY = Math.max(-MAX_RATE, Math.min(MAX_RATE, st.velY));
      const effort = Math.min(0.14, (Math.abs(dx) + Math.abs(dy)) * SENS * 26);
      st.spin = Math.min(1, st.spin + effort);
    };
    const beginDrag = (x, y) => {
      Object.assign(stateRef.current, {
        isDragging: true,
        lastX: x,
        lastY: y,
        lastT: performance.now(),
        velX: 0,
        velY: 0,
        pendingX: 0,
        pendingY: 0,
      });
      start();
    };
    const endDrag = () => {
      stateRef.current.isDragging = false;
    };
    const zoomBy = (k) => {
      stateRef.current.dist = Math.max(14.0, Math.min(48.0, stateRef.current.dist * k));
      start();
    };

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') return;
      beginDrag(e.clientX, e.clientY);
    };
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch' || !stateRef.current.isDragging) return;
      dragTo(e.clientX, e.clientY);
    };
    const onPointerUp = (e) => {
      if (e.pointerType === 'touch') return;
      endDrag();
    };

    let pinch = 0;
    const touchDist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const onTouchStart = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length === 2) {
        e.preventDefault();
        pinch = touchDist(e.touches);
        stateRef.current.isDragging = false;
        return;
      }
      const t = e.touches[0];
      const { hole } = stateRef.current;
      if (Math.hypot(t.clientX - rect.left - hole.x, t.clientY - rect.top - hole.y) > hole.r) return;
      e.preventDefault();
      beginDrag(t.clientX, t.clientY);
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinch) {
        e.preventDefault();
        const d = touchDist(e.touches);
        zoomBy(pinch / d);
        pinch = d;
        return;
      }
      if (!stateRef.current.isDragging) return;
      e.preventDefault();
      dragTo(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinch = 0;
      if (e.touches.length === 0) stateRef.current.isDragging = false;
    };

    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      if (e.deltaY) zoomBy(Math.exp(e.deltaY * 0.0015));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('blur', endDrag);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      reduceMotion.removeEventListener('change', start);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', endDrag);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('wheel', onWheel);
      gl.deleteBuffer(posBuf);
      sceneT.free();
      Object.values(progs).forEach((p) => gl.deleteProgram(p));
    };
  }, []);

  return (
    <figure className="relative m-0 w-full h-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-manipulation"
      />
      <figcaption className="hidden md:block absolute bottom-6 inset-x-0 z-raised pointer-events-none">
        <div className="max-w-container mx-auto px-[var(--gutter)] flex items-center justify-end gap-[var(--space-xs)] text-sm text-muted">
          <span>{labels.hint}</span>
          <button type="button" onClick={resetCamera} className="tab pointer-events-auto" aria-label={labels.reset}>
            <RotateCcw aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
