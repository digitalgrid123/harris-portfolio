import { siteConfig } from "@/config";

const START_YEAR = 2024;

export function Footer() {
  const year = new Date().getFullYear();
  const range = year === START_YEAR ? `${year}` : `${START_YEAR}-${year}`;

  return (
    <footer className="w-full border-t border-black/5 py-6 text-sm text-zinc-500 dark:border-white/5 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 sm:px-10">
        <span className="op75">
          {range} © {siteConfig.author}. All rights reserved.
        </span>
        <div className="flex-auto" />
      </div>
    </footer>
  );
}
