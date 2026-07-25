"use client";

import * as React from "react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type LogoProps = ComponentPropsWithoutRef<"div">;

const FORWARD_MS = 2200;
const SLOW_FORWARD_MS = 4000;
const REVERSE_MS = 2200;
const PAUSE_MS = 2000;
const START_DELAY_MS = 300;

export function Logo({ className, ...props }: LogoProps) {
  const pathRef = React.useRef<SVGPathElement | null>(null);

  React.useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    void path.getBoundingClientRect();

    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const setOffset = (value: number, duration: number) => {
      path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.55,0,0.4,1) 0ms`;
      requestAnimationFrame(() => {
        path.style.strokeDashoffset = String(value);
      });
    };

    const forward = (duration: number) => setOffset(0, duration);
    const reverse = () => setOffset(length, REVERSE_MS);

    const runLoop = () => {
      reverse();
      after(() => {
        forward(SLOW_FORWARD_MS);
        after(runLoop, SLOW_FORWARD_MS + PAUSE_MS);
      }, REVERSE_MS + PAUSE_MS);
    };

    after(() => {
      forward(FORWARD_MS);
      after(runLoop, FORWARD_MS + PAUSE_MS);
    }, START_DELAY_MS);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={className} {...props}>
      <Link
        href="/"
        aria-label="Home"
        className="absolute top-3 left-4 flex h-9 w-9 items-center justify-center select-none outline-none z-40 transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-md sm:left-6 sm:w-16 xl:fixed xl:top-2 xl:left-10 xl:w-14 xl:h-auto"
      >
        <svg
          viewBox="0 0 220 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-auto w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Muhammad Haris</title>
          <g>
            <path
              ref={pathRef}
              d="M 22 130 C 25 95, 30 60, 40 45
                 C 34 45, 30 62, 32 92 C 34 118, 36 136, 38 150
                 C 40 135, 45 108, 55 105 C 65 102, 70 130, 72 150
                 C 85 150, 90 120, 100 105
                 C 106 96, 130 135, 95 145
                 C 78 150, 120 150, 160 145"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-600 dark:text-zinc-400"
            />
          </g>
        </svg>
      </Link>
    </div>
  );
}
