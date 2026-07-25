"use client";

import * as React from "react";

export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      title="Scroll to top"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={[
        "fixed right-3 bottom-3 w-10 h-10 rounded-full transition-all duration-300 z-[100] print:hidden",
        "border border-black/10 bg-white/80 backdrop-blur hover:bg-black/5 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15",
        visible
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none translate-y-2",
      ].join(" ")}
    >
      <i className="ri-arrow-up-line text-base text-foreground" aria-hidden="true" />
    </button>
  );
}
