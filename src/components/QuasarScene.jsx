import React, { useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// Schwarzschild black hole, rs = 1. Thin Novikov-Thorne disk from the ISCO (r = 3)
// out to DISK_OUT, its brightness set by the disk temperature, Doppler-beamed and gravitationally
// redshifted. Rays are integrated with an adaptive leapfrog step, so a pixel takes
// 20 to 70 iterations instead of hundreds.

uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uScale;
uniform float uTime;
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
uniform sampler2D uNoise;

const float ISCO = 3.0;
const float DISK_OUT = 11.0;
const float R_OUT = 16.0;
const float FLUX_NORM = 476.6;   // 1 / peak of (1 - sqrt(3/r)) / r^3, at r ~ 4.08
const int MAX_STEPS = 64;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  return texture2D(uNoise, p * (1.0 / 64.0)).r;
}

// Monochrome emission: the observed temperature sets brightness only. Cool gas
// fades to grey, the hottest blueshifted gas to a hard white.
vec3 glow(float t) {
  float v = smoothstep(0.05, 1.35, t);
  return vec3(mix(0.12, 1.0, v * v));
}

vec4 shadeDisk(vec3 hit, vec3 dir, float order) {
  float r = length(hit.xz);
  if (r < ISCO || r > DISK_OUT) return vec4(0.0);

  // Keplerian angular speed, slowed for the screen; the pattern is sampled in the
  // co-rotating frame, so the inner disk visibly laps the outer one.
  float omega = 2.4 * pow(r, -1.5);
  float a = atan(hit.z, hit.x) + uTime * omega;
  float lr = log(r);
  float sp = a + 2.2 * lr;
  vec2 q = vec2(sp * 2.0, lr * 16.0);
  float n = noise(q) * 0.5 + noise(q * 2.6 + 7.1) * 0.3 + noise(vec2(sp * 6.0, lr * 48.0)) * 0.2;
  float lanes = mix(0.22 + 0.78 * smoothstep(0.3, 0.78, n), 0.8, step(0.5, order));

  float flux = (1.0 - sqrt(ISCO / r)) / (r * r * r) * FLUX_NORM;
  float temp = pow(max(flux, 0.0), 0.25);

  // Orbital velocity and the full relativistic shift, gravitational and Doppler.
  float v = inversesqrt(2.0 * (r - 1.0));
  vec3 vel = normalize(vec3(-hit.z, 0.0, hit.x)) * v;
  float gamma = inversesqrt(1.0 - v * v);
  float g = sqrt(1.0 - 1.5 / r) / (gamma * (1.0 + dot(vel, dir)));

  vec3 col = glow(temp * g) * flux * g * g * g * g * lanes * 2.1;
  // The lensed (order 1) image is squeezed so hard near the ISCO that its inner edge
  // falls under a pixel and breaks into dots; it gets a much wider, softer inner edge.
  float inner = mix(0.45, 2.2, step(0.5, order));
  float edge = smoothstep(ISCO, ISCO + inner, r) * smoothstep(DISK_OUT, DISK_OUT - 5.0, r);
  return vec4(col * edge, edge * (0.55 + 0.4 * lanes));
}

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec3 stars(vec3 d) {
  vec3 p = d * 110.0;
  vec3 cell = floor(p);
  vec3 f = fract(p) - 0.5;
  float h = hash13(cell);
  float s = 0.0;
  if (h > 0.985) {
    vec3 o = vec3(hash13(cell + 3.1), hash13(cell + 7.7), hash13(cell + 1.9)) - 0.5;
    float k = (h - 0.985) * 66.7;
    vec3 q = f - o * 0.55;
    s = exp(-dot(q, q) * 160.0) * (0.12 + 1.2 * k * k);
  }
  return vec3(s);
}

void main() {
  float minDim = min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - uCenter * uRes) / minDim * uScale;

  vec3 dir = normalize(uCamFwd + uv.x * 0.9 * uCamRight + uv.y * 0.9 * uCamUp);
  vec3 pos = uCamPos;

  // Skip the flat space between the camera and the sphere where gravity matters.
  float b = dot(pos, dir);
  float c = dot(pos, pos) - R_OUT * R_OUT;
  float disc = b * b - c;
  vec3 col = vec3(0.0);
  float alpha = 0.0;
  bool captured = false;
  bool escaped = false;
  float impact = 100.0;

  if (disc > 0.0 && -b - sqrt(disc) > 0.0) {
    pos += dir * (-b - sqrt(disc));
    vec3 hv = cross(pos, dir);
    float h2 = dot(hv, hv);
    impact = sqrt(h2);

    int crossings = 0;
    for (int i = 0; i < MAX_STEPS; i++) {
      float r2 = dot(pos, pos);
      float r = sqrt(r2);
      if (r < 1.0) { captured = true; break; }
      if (r > R_OUT + 0.1 && dot(pos, dir) > 0.0) { escaped = true; break; }

      // Step grows with radius; past r = 9 rays barely bend, so they take long strides.
      float dt = max(r < 9.0 ? 0.14 * r : 0.35 * r, 0.03);
      vec3 prev = pos;
      vec3 vh = dir + (-0.75 * dt * h2 / (r2 * r2 * r)) * pos;
      pos += dt * vh;
      float r2n = dot(pos, pos);
      dir = vh + (-0.75 * dt * h2 / (r2n * r2n * sqrt(r2n))) * pos;

      if (prev.y * pos.y < 0.0 && crossings < 2) {
        float t = prev.y / (prev.y - pos.y);
        vec4 d = shadeDisk(mix(prev, pos, t), normalize(dir), float(crossings));
        // Right at the shadow edge the lensed image thins to under a pixel and breaks
        // into dots (measured at impact 2.61 to 2.67), so it fades out across that band.
        d *= crossings > 0 ? smoothstep(2.68, 2.95, impact) : smoothstep(2.585, 2.64, impact);
        crossings++;
        col += d.rgb * (1.0 - alpha);
        alpha += d.a * (1.0 - alpha);
        if (alpha > 0.985) { escaped = true; break; }
      }
    }
  }

  if (disc <= 0.0) escaped = true;
  // A ray still orbiting when the budget runs out sits on the photon sphere: its
  // light would wind around many times before leaving, so it reads as shadow.
  // A soft shadow edge: whatever the ray hit fades to black over a thin band of impact
  // parameter, so the rim stays smooth when the low-res canvas is upscaled.
  float shadowEdge = smoothstep(2.55, 2.64, impact);
  if (escaped && !captured) {
    // Right at the shadow edge the lens magnifies the sky so hard that neighbouring
    // pixels sample unrelated directions; stars there would show as a dotted rim.
    float skyFade = smoothstep(2.62, 3.4, impact);
    col += stars(normalize(dir)) * (1.0 - alpha) * skyFade;
  }

  col *= shadowEdge;

  // Filmic tone map, then a whisper of grain against banding on dark gradients.
  col = col * (2.51 * col + 0.03) / (col * (2.43 * col + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
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
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(err || 'Program link failed');
  }
  return prog;
}

// A 64x64 tileable value-noise texture, built once on the CPU. Sampling it is far
// cheaper per pixel than hashing fbm noise in the shader.
function makeNoiseTexture(gl) {
  const N = 64;
  const grid = 8;
  const lattice = new Float32Array(grid * grid);
  let seed = 1337;
  for (let i = 0; i < lattice.length; i++) {
    seed = (seed * 16807) % 2147483647;
    lattice[i] = seed / 2147483647;
  }
  const at = (x, y) => lattice[((y % grid) + grid) % grid * grid + (((x % grid) + grid) % grid)];
  const fade = (t) => t * t * (3 - 2 * t);
  const data = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let v = 0;
      let amp = 0.5;
      let freq = 1;
      for (let o = 0; o < 3; o++) {
        const fx = (x / N) * grid * freq;
        const fy = (y / N) * grid * freq;
        const ix = Math.floor(fx);
        const iy = Math.floor(fy);
        const ux = fade(fx - ix);
        const uy = fade(fy - iy);
        const a = at(ix, iy) * (1 - ux) + at(ix + 1, iy) * ux;
        const b = at(ix, iy + 1) * (1 - ux) + at(ix + 1, iy + 1) * ux;
        v += amp * (a * (1 - uy) + b * uy);
        amp *= 0.5;
        freq *= 2;
      }
      data[y * N + x] = Math.round((v / 0.875) * 255);
    }
  }
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, N, N, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return tex;
}

// Orbit camera around the hole, computed once per frame instead of per pixel.
function cameraBasis(yaw, pitch, dist) {
  const cp = Math.cos(pitch);
  const pos = [dist * cp * Math.sin(yaw), dist * Math.sin(pitch), -dist * cp * Math.cos(yaw)];
  const len = Math.hypot(pos[0], pos[1], pos[2]);
  const fwd = [-pos[0] / len, -pos[1] / len, -pos[2] / len];
  let right = [fwd[2], 0, -fwd[0]];
  const rl = Math.hypot(right[0], right[2]) || 1;
  right = [right[0] / rl, 0, right[2] / rl];
  const up = [
    right[1] * fwd[2] - right[2] * fwd[1],
    right[2] * fwd[0] - right[0] * fwd[2],
    right[0] * fwd[1] - right[1] * fwd[0],
  ];
  return { pos, fwd, right, up };
}

// Render scale steps: the canvas is drawn at this fraction of CSS pixels and the
// browser upscales it. The disk is soft, so 0.5 to 0.75 is indistinguishable at a glance.
const QUALITY = [0.33, 0.42, 0.5, 0.62, 0.75];

const LABELS = {
  en: { hint: 'Drag to rotate, Ctrl and scroll to zoom', reset: 'Reset view' },
  ru: { hint: 'Тяните, чтобы вращать, Ctrl и колесо для зума', reset: 'Сбросить вид' },
};

export function QuasarScene({ lang = 'en' }) {
  const labels = LABELS[lang] || LABELS.en;
  const canvasRef = useRef(null);
  const stateRef = useRef({
    yaw: 0.0,
    pitch: 0.16,
    dist: 30.0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    yawVel: 0,
    pitchVel: 0,
  });

  const resetCamera = useCallback(() => {
    stateRef.current.yaw = 0.0;
    stateRef.current.pitch = 0.16;
    stateRef.current.dist = 30.0;
    stateRef.current.yawVel = 0;
    stateRef.current.pitchVel = 0;
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

    let prog;
    try {
      prog = createProgram(gl, VERT_SRC, FRAG_SRC);
    } catch {
      return;
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'aPos');
    const loc = {};
    ['uRes', 'uCenter', 'uScale', 'uTime', 'uCamPos', 'uCamRight', 'uCamUp', 'uCamFwd', 'uNoise'].forEach((n) => {
      loc[n] = gl.getUniformLocation(prog, n);
    });
    const noiseTex = makeNoiseTexture(gl);

    gl.useProgram(prog);
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, noiseTex);
    gl.uniform1i(loc.uNoise, 0);

    // Adaptive quality: start mid, then step down when frames run long and back up
    // when there is headroom. Frame cost is measured as the gap between rAF calls
    // over a rolling window, and the loop is capped at 60fps on fast screens.
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
          if (avg > 34 && quality > 1) quality -= 2;
          else if (avg > 21 && quality > 0) quality--;
          else if (avg < 17.5 && quality < QUALITY.length - 1) quality++;
          frameSum = 0;
          frameCount = 0;
        }
      }
      lastDraw = now;

      const rect = canvas.getBoundingClientRect();
      const isMobile = rect.width < 768;
      const scale = QUALITY[quality] * Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * scale));
      const height = Math.max(1, Math.round(rect.height * scale));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      const st = stateRef.current;
      if (!st.isDragging && !reduceMotion.matches) {
        st.yaw += dt * 0.05;
      }

      if (!st.isDragging) {
        st.yaw += st.yawVel * dt;
        st.pitch += st.pitchVel * dt;
        const damp = Math.pow(0.92, dt * 60);
        st.yawVel *= damp;
        st.pitchVel *= damp;
      }

      st.pitch = Math.max(-0.6, Math.min(0.6, st.pitch));
      const cam = cameraBasis(st.yaw, st.pitch, st.dist);

      gl.uniform2f(loc.uRes, width, height);
      gl.uniform1f(loc.uTime, (now * 0.001) % 3600);
      gl.uniform3fv(loc.uCamPos, cam.pos);
      gl.uniform3fv(loc.uCamRight, cam.right);
      gl.uniform3fv(loc.uCamUp, cam.up);
      gl.uniform3fv(loc.uCamFwd, cam.fwd);
      if (isMobile) {
        gl.uniform2f(loc.uCenter, 0.5, 0.64);
        gl.uniform1f(loc.uScale, 1.25);
      } else {
        // Fit the hole into the space right of the hero text: the text column ends
        // about 760px into the capped 1440px container.
        const cssW = rect.width;
        const textRight = Math.max(0, (cssW - 1440) / 2) + 760;
        const free = Math.max(cssW - textRight, 240);
        // The lensed disk reaches about 0.52 of the short side from the centre
        // at uScale 1; shrink it until it fits the free column with a margin.
        const reach = 0.52 * Math.min(rect.width, rect.height) * (30 / st.dist);
        gl.uniform2f(loc.uCenter, (textRight + free / 2) / cssW, 0.5);
        gl.uniform1f(loc.uScale, Math.max(1.0, reach / (free / 2 - 32)));
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      const moving = st.isDragging || Math.abs(st.yawVel) > 0.001 || Math.abs(st.pitchVel) > 0.001;
      if (visible && (!reduceMotion.matches || moving)) {
        animId = requestAnimationFrame(render);
      } else {
        running = false;
      }
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

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') {
        stateRef.current.lastX = e.clientX;
        stateRef.current.lastY = e.clientY;
        return;
      }
      stateRef.current.isDragging = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      stateRef.current.yawVel = 0;
      stateRef.current.pitchVel = 0;
      start();
    };

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') {
        const dx = e.clientX - stateRef.current.lastX;
        const dy = e.clientY - stateRef.current.lastY;
        if (Math.abs(dx) > Math.abs(dy) + 4) {
          stateRef.current.yaw -= dx * 0.005;
          stateRef.current.lastX = e.clientX;
          stateRef.current.lastY = e.clientY;
          start();
        }
        return;
      }
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.lastX;
      const dy = e.clientY - stateRef.current.lastY;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;

      const sens = 0.005;
      stateRef.current.yaw -= dx * sens;
      stateRef.current.pitch += dy * sens;
      stateRef.current.yawVel = -dx * sens * 30;
      stateRef.current.pitchVel = dy * sens * 30;
    };

    const onPointerUp = () => {
      stateRef.current.isDragging = false;
    };

    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) > 0) {
        stateRef.current.dist = Math.max(18.0, Math.min(44.0, stateRef.current.dist + e.deltaY * 0.015));
        start();
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
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
      canvas.removeEventListener('wheel', onWheel);
      if (posBuf) gl.deleteBuffer(posBuf);
      if (noiseTex) gl.deleteTexture(noiseTex);
      if (prog) gl.deleteProgram(prog);
    };
  }, []);

  return (
    <figure className="relative m-0 w-full h-full overflow-hidden select-none touch-pan-y">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-pan-y"
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
