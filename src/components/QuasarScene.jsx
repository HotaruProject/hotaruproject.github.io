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
    vec3 starCol = mix(vec3(0.95, 0.98, 1.0), vec3(0.75, 0.90, 1.0), fract(rnd * 43.1));
    if (fract(rnd * 89.2) > 0.85) starCol = vec3(1.0, 0.92, 0.82);
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
  float dopplerFactor = pow(clamp(1.0 + 0.62 * doppler, 0.15, 2.7), 3.5);

  vec3 colHot = vec3(1.35, 1.40, 1.48);
  vec3 colMid = vec3(0.96, 0.98, 1.05);
  vec3 colWarm = vec3(0.85, 0.82, 0.78);
  vec3 colOuter = vec3(0.55, 0.35, 0.18);

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

  for (int i = 0; i < 360; i++) {
    vec3 prevPos = pos;
    float r = length(pos);
    minR = min(minR, r);

    float dt = clamp(r * 0.042, 0.005, 0.85);
    float r2safe = max(dot(pos, pos), 0.55);
    vec3 acc = -1.65 * h2 * pos / pow(r2safe, 2.5);
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
    col += vec3(1.35, 1.40, 1.48) * ringGlow * 2.9;
    float ringHalo = exp(-abs(minR - photonR) * 4.2);
    col += vec3(0.96, 0.98, 1.05) * ringHalo * 0.45;
  }

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

const DEFAULT_PITCH = 0.18;
const DEFAULT_DIST = 26.0;

function defaultFrame() {
  const cp = Math.cos(DEFAULT_PITCH);
  const back = [0.0, Math.sin(DEFAULT_PITCH), -cp];
  const right = norm(cross([0, 1, 0], back));
  const up = cross(back, right);
  return { right, up, back };
}

const QUALITY = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

const LABELS = {
  en: { hint: 'Drag to turn it any way, pinch or Ctrl and scroll to zoom', reset: 'Reset view' },
  ru: { hint: 'Тяните, чтобы повернуть в любую сторону, щипок или Ctrl и колесо для зума', reset: 'Сбросить вид' },
};

export function QuasarScene({ lang = 'en' }) {
  const labels = LABELS[lang] || LABELS.en;
  const canvasRef = useRef(null);
  const stateRef = useRef({
    ...defaultFrame(),
    dist: DEFAULT_DIST,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    velX: 0,
    velY: 0,
    hole: { x: 0, y: 0, r: 0 },
  });

  const resetCamera = useCallback(() => {
    Object.assign(stateRef.current, defaultFrame(), { dist: DEFAULT_DIST, velX: 0, velY: 0 });
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
      ['uRes', 'uTime', 'uCamPos', 'uCamRight', 'uCamUp', 'uCamFwd', 'uCenter', 'uScale', 'uTex'].forEach((n) => {
        loc[key][n] = gl.getUniformLocation(p, n);
      });
    });
    const sceneT = makeTarget(gl);

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let quality = coarse ? 1 : 2;
    let frameSum = 0;
    let frameCount = 0;
    let lastDraw = 0;
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
      const dt = Math.min((now - t0) * 0.001, 0.1);
      t0 = now;
      if (lastDraw) {
        frameSum += now - lastDraw;
        frameCount++;
        if (frameCount === 20) {
          const avg = frameSum / frameCount;
          if (avg > 34 && quality > 0) quality--;
          else if (avg > 21 && quality > 1) quality--;
          else if (avg < 17.5 && quality < QUALITY.length - 1) quality++;
          frameSum = 0;
          frameCount = 0;
        }
      }
      lastDraw = now;

      const rect = canvas.getBoundingClientRect();
      const isMobile = rect.width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const outW = Math.max(1, Math.round(rect.width * Math.min(dpr, 1.5)));
      const outH = Math.max(1, Math.round(rect.height * Math.min(dpr, 1.5)));
      const sw = Math.max(1, Math.round(rect.width * dpr * QUALITY[quality]));
      const sh = Math.max(1, Math.round(rect.height * dpr * QUALITY[quality]));

      if (canvas.width !== outW || canvas.height !== outH) {
        canvas.width = outW;
        canvas.height = outH;
      }
      sceneT.size(sw, sh);

      const st = stateRef.current;
      if (!st.isDragging) {
        const damp = Math.pow(0.93, dt * 60);
        st.velX *= damp;
        st.velY *= damp;
        let yawRate = st.velX;
        if (!reduceMotion.matches) yawRate += 0.06;
        turn(yawRate * dt, st.velY * dt);
      }

      const pos = st.back.map((v) => v * st.dist);
      const fwd = st.back.map((v) => -v);

      let center;
      let scale;
      const minCss = Math.min(rect.width, rect.height);
      if (isMobile) {
        center = [0.5, 0.72];
        scale = 0.9;
      } else {
        const cssW = rect.width;
        const textRight = Math.max(0, (cssW - 1440) / 2) + 760;
        const free = Math.max(cssW - textRight, 240);
        scale = Math.max(0.9, Math.min(1.8, (0.95 * minCss) / free));
        center = [(textRight + free / 2) / cssW, 0.5];
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
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      pass(progs.blit, null, outW, outH);
      bindTex(0, sceneT.tex, loc.blit.uTex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const moving = st.isDragging || Math.abs(st.velX) > 0.002 || Math.abs(st.velY) > 0.002;
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
    start();

    const SENS = 0.006;
    const dragTo = (x, y) => {
      const st = stateRef.current;
      const dx = x - st.lastX;
      const dy = y - st.lastY;
      st.lastX = x;
      st.lastY = y;
      turn(-dx * SENS, dy * SENS);
      st.velX = -dx * SENS * 40;
      st.velY = dy * SENS * 40;
    };
    const beginDrag = (x, y) => {
      Object.assign(stateRef.current, { isDragging: true, lastX: x, lastY: y, velX: 0, velY: 0 });
      start();
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
      stateRef.current.isDragging = false;
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
