"use client";

import * as React from "react";
import { useTheme } from "next-themes";

type SeedFn = () => number;

function makeSimplex(seedFn: SeedFn = Math.random) {
  const grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const n = Math.floor(seedFn() * (i + 1));
    const tmp = p[i];
    p[i] = p[n];
    p[n] = tmp;
  }

  const perm = new Uint8Array(512);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gradP: any[] = new Array(512);
  for (let i = 0; i < 512; i += 1) {
    perm[i] = p[i & 255];
    gradP[i] = grad3[perm[i] % 12];
  }

  const F3 = 1 / 3;
  const G3 = 1 / 6;

  const dot3 = (g: number[], x: number, y: number, z: number) =>
    g[0] * x + g[1] * y + g[2] * z;

  return function noise3D(xin: number, yin: number, zin: number) {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    let n3 = 0;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1: number;
    let j1: number;
    let k1: number;
    let i2: number;
    let j2: number;
    let k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * dot3(gradP[ii + perm[jj + perm[kk]]], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 =
        t1 *
        t1 *
        dot3(gradP[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 =
        t2 *
        t2 *
        dot3(gradP[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 =
        t3 * t3 * dot3(gradP[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  };
}

// Types for both effects
type Dot = {
  x: number;
  y: number;
  opacity: number;
};

type BranchState = {
  depth: number;
};

type BranchTask = {
  x: number;
  y: number;
  angle: number;
  state: BranchState;
};

const NOISE_SCALE = 200;
const MOVE_RADIUS = 4;
const SPACING = 15;
const DOT_RADIUS = 1.1;
const MAX_ALPHA = 0.19;
const HOVER_RADIUS = 220;

// Art Plum (recursive branch / "palm tree") constants
const PI = Math.PI;
const HALF_PI = Math.PI / 2;
const SPREAD = Math.PI / 12; // ~15 degrees of branch spread
const MAX_LEN = 6; // max length of each line segment
const DEPTH_CUTOFF = 30; // branching probability drops after this many segments
const FRAME_INTERVAL_MS = 24; // slowed down from 8ms for smoother, relaxed growth

function colorFor(isDark: boolean, alpha: number) {
  if (isDark) {
    const a = Math.min(alpha, 1).toFixed(3);
    return `rgba(200, 200, 200, ${a})`;
  }
  const a = Math.min(alpha, 1).toFixed(3);
  return `rgba(100, 100, 100, ${a})`;
}

export function CanvasBackground() {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number>(0);
  const themeRef = React.useRef<"light" | "dark">("light");
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    themeRef.current = resolvedTheme === "dark" ? "dark" : "light";
  }, [resolvedTheme]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const noise = makeSimplex(Math.random);

    let width = wrapper.clientWidth;
    let height = wrapper.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];

    // Mode handling: alternate between "dots" and "plum" on refresh using localStorage
    let currentMode: "dots" | "plum" = "dots";
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("canvas-bg-mode");
      if (savedMode === "dots") {
        currentMode = "plum";
      } else {
        currentMode = "dots";
      }
      localStorage.setItem("canvas-bg-mode", currentMode);
    }

    const pointer = { x: -1000, y: -1000, active: false };

    const onPointer = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };
    wrapper.addEventListener("pointermove", onPointer, { passive: true });
    wrapper.addEventListener("pointerleave", onPointerLeave);

    // --- DOTS MODE CODE ---
    const angleField = (x: number, y: number, t: number) =>
      (noise(x / NOISE_SCALE, y / NOISE_SCALE, t) - 0.5) * 2 * Math.PI;
    const distField = (x: number, y: number, t: number) =>
      (noise(x / NOISE_SCALE, y / NOISE_SCALE, t * 2) + 0.5) * MOVE_RADIUS;

    const buildGrid = () => {
      dots = [];
      for (let x = -SPACING / 2; x < width + SPACING; x += SPACING) {
        for (let y = -SPACING / 2; y < height + SPACING; y += SPACING) {
          dots.push({
            x,
            y,
            opacity: Math.random() * 0.5 + 0.5,
          });
        }
      }
    };

    // --- PLUM MODE CODE (Direct match to user's animation logic) ---
    let queue: (() => void)[] = [];
    let nextQueue: (() => void)[] = [];
    let lastFrameTime = performance.now();
    let frameTickCount = 0;

    function polarOffset(x: number, y: number, distance: number, angle: number) {
      return [
        x + distance * Math.cos(angle),
        y + distance * Math.sin(angle),
      ];
    }

    function growBranch(x: number, y: number, angle: number, state = { depth: 0 }) {
      const len = Math.random() * MAX_LEN;
      state.depth += 1;

      const [x2, y2] = polarOffset(x, y, len, angle);

      const isDark = themeRef.current === "dark";
      ctx!.strokeStyle = isDark ? "rgba(200, 200, 200, 0.08)" : "rgba(100, 100, 100, 0.05)";

      ctx!.beginPath();
      ctx!.moveTo(x, y);
      ctx!.lineTo(x2, y2);
      ctx!.stroke();

      if (x2 < -100 || x2 > width + 100 || y2 < -100 || y2 > height + 100) {
        return;
      }

      const angleLeft = angle + Math.random() * SPREAD;
      const angleRight = angle - Math.random() * SPREAD;
      const branchChance = state.depth <= DEPTH_CUTOFF ? 0.8 : 0.5;

      if (Math.random() < branchChance) {
        nextQueue.push(() => growBranch(x2, y2, angleLeft, state));
      }
      if (Math.random() < branchChance) {
        nextQueue.push(() => growBranch(x2, y2, angleRight, state));
      }
    }

    function startPlum() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;
      const isDark = themeRef.current === "dark";
      ctx!.strokeStyle = isDark ? "rgba(136, 136, 136, 0.38)" : "rgba(100, 100, 100, 0.28)";

      queue = [];
      nextQueue = [];
      frameTickCount = 0;
      const randomEdgeOffset = () => Math.random() * 0.6 + 0.2;

      nextQueue = [
        () => growBranch(randomEdgeOffset() * width, -5, HALF_PI),
        () => growBranch(randomEdgeOffset() * width, height + 5, -HALF_PI),
        () => growBranch(-5, randomEdgeOffset() * height, 0),
        () => growBranch(width + 5, randomEdgeOffset() * height, PI),
      ];

      if (width < 500) {
        nextQueue = nextQueue.slice(0, 2);
      }

      const seeds = nextQueue;
      nextQueue = [];
      seeds.forEach((fn) => fn());
    }

    const resize = () => {
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (currentMode === "dots") {
        buildGrid();
      } else {
        startPlum();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    window.addEventListener("resize", resize);

    const startTime = Date.now();
    const frame = (now: number) => {
      const isDark = themeRef.current === "dark";

      if (currentMode === "dots") {
        const t = (Date.now() - startTime) / 10000;
        ctx!.clearRect(0, 0, width, height);

        for (let i = 0; i < dots.length; i += 1) {
          const d = dots[i];
          const angle = angleField(d.x, d.y, t);
          const dist = distField(d.x, d.y, t);
          let cx = d.x + Math.cos(angle) * dist;
          let cy = d.y + Math.sin(angle) * dist;

          let alphaBoost = 0;
          if (pointer.active) {
            const dx = pointer.x - cx;
            const dy = pointer.y - cy;
            const d2 = dx * dx + dy * dy;
            if (d2 < HOVER_RADIUS * HOVER_RADIUS) {
              const dd = Math.sqrt(d2);
              const intensity = 1 - dd / HOVER_RADIUS;
              alphaBoost = intensity * intensity * 0.55;
              const pull = intensity * intensity * 2.2;
              cx += (dx / Math.max(1, dd)) * pull;
              cy += (dy / Math.max(1, dd)) * pull;
            }
          }

          const base =
            (Math.abs(Math.cos(angle)) * 0.5 + 0.5) * d.opacity * MAX_ALPHA;
          const alpha = Math.max(0, Math.min(1, base + alphaBoost));

          ctx!.beginPath();
          ctx!.arc(cx, cy, DOT_RADIUS, 0, Math.PI * 2);
          ctx!.fillStyle = colorFor(isDark, alpha);
          ctx!.fill();
        }
      } else {
        // PLUM MODE: exact timing throttling and queuing
        if (now - lastFrameTime >= FRAME_INTERVAL_MS) {
          lastFrameTime = now;

          queue = nextQueue;
          nextQueue = [];
          frameTickCount++;

          if (queue.length > 0) {
            queue.forEach((fn) => {
              if (Math.random() < 0.5) {
                nextQueue.push(fn);
              } else {
                fn();
              }
            });
          }
        }
      }

      if (!isReducedMotion) {
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    if (isReducedMotion) {
      if (currentMode === "dots") {
        frame(performance.now());
      } else {
        startPlum();
      }
    } else {
      rafRef.current = window.requestAnimationFrame(frame);
    }

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      wrapper.removeEventListener("pointermove", onPointer);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 left-0 right-0 top-0 bottom-0 -z-[15] h-screen w-screen bg-[var(--c-bg)]"
      />
      <div
        ref={wrapperRef}
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 left-0 right-0 top-0 bottom-0 -z-[10] h-screen w-screen overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ touchAction: "none", cursor: "inherit" }}
        />
      </div>
    </>
  );
}

