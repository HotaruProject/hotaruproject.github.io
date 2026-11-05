import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

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

uniform vec2 uRes;
uniform float uTime;
uniform float uYaw;
uniform float uPitch;
uniform float uDist;

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
  vec3 lookAt = vec3(0.0, 0.0, 0.0);
  vec3 camPos = lookAt + uDist * vec3(
    cos(uPitch) * sin(uYaw),
    sin(uPitch),
    -cos(uPitch) * cos(uYaw)
  );
  vec3 fwd = normalize(lookAt - camPos);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
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

  for (int i = 0; i < 280; i++) {
    vec3 prevPos = pos;
    float r = length(pos);
    minR = min(minR, r);

    float dt = clamp(r * 0.048, 0.006, 0.95);
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

    if (r > 38.0) {
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
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / minDim;
  vec3 col = traceScene(uv);
  col = col / (1.0 + col);
  col = pow(col, vec3(0.86));
  float vig = 1.0 - 0.20 * smoothstep(0.4, 1.4, length(uv));
  col *= vig;
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

export function QuasarScene() {
  const canvasRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const stateRef = useRef({
    yaw: 0.0,
    pitch: 0.18,
    dist: 24.0,
    autoRotate: true,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    yawVel: 0,
    pitchVel: 0
  });

  stateRef.current.autoRotate = autoRotate;

  const resetCamera = useCallback(() => {
    stateRef.current.yaw = 0.0;
    stateRef.current.pitch = 0.18;
    stateRef.current.dist = 24.0;
    stateRef.current.yawVel = 0;
    stateRef.current.pitchVel = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: false, depth: false, antialias: false });
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
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uYaw = gl.getUniformLocation(prog, 'uYaw');
    const uPitch = gl.getUniformLocation(prog, 'uPitch');
    const uDist = gl.getUniformLocation(prog, 'uDist');

    let animId;
    let t0 = performance.now();

    const render = (now) => {
      const dt = Math.min((now - t0) * 0.001, 0.1);
      t0 = now;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      const st = stateRef.current;
      if (st.autoRotate && !st.isDragging) {
        st.yaw += dt * 0.12;
      }

      if (!st.isDragging) {
        st.yaw += st.yawVel * dt;
        st.pitch += st.pitchVel * dt;
        st.yawVel *= 0.92;
        st.pitchVel *= 0.92;
      }

      st.pitch = Math.max(-0.65, Math.min(0.65, st.pitch));

      gl.useProgram(prog);
      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, now * 0.001);
      gl.uniform1f(uYaw, st.yaw);
      gl.uniform1f(uPitch, st.pitch);
      gl.uniform1f(uDist, st.dist);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onPointerDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      stateRef.current.yawVel = 0;
      stateRef.current.pitchVel = 0;
    };

    const onPointerMove = (e) => {
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
      e.preventDefault();
      stateRef.current.dist = Math.max(12.0, Math.min(42.0, stateRef.current.dist + e.deltaY * 0.02));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      if (posBuf) gl.deleteBuffer(posBuf);
      if (prog) gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#050508]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-20">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
          title={autoRotate ? "Pause rotation" : "Auto rotate"}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoRotate ? "Pause" : "Spin"}</span>
        </button>
        <span className="text-white/20">|</span>
        <button
          onClick={resetCamera}
          className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
      <div className="absolute bottom-6 left-6 hidden md:block text-[11px] text-white/40 tracking-wider font-mono z-20">
        DRAG TO ROTATE • SCROLL TO ZOOM
      </div>
    </div>
  );
}
