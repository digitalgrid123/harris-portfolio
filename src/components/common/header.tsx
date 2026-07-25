import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { ThemeToggleIcon } from "@/components/ui/theme-toggle-icon";
import { navigation } from "@/config";
import type { NavItem } from "@/types";

function NavLink({ item }: { item: NavItem }) {
  const labelClasses = [
    "transition-colors duration-200",
    item.hideLabelOnDesktop ? "md:hidden" : "",
    item.hideLabelOnMobile ? "hidden md:inline" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconClasses = [
    "flex items-center justify-center",
    item.hideLabelOnDesktop ? "" : "md:hidden",
  ]
    .filter(Boolean)
    .join(" ");

  const mobileHidden = item.hideOnMobile ? "hidden md:inline-flex" : "";

  const common = [
    "inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-md text-base font-medium select-none",
    "text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04] transition-colors",
    "dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-white/[0.06]",
    mobileHidden,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {item.icon ? (
        <span className={iconClasses}>
          <i className={`${item.icon} text-base`} aria-hidden="true" />
        </span>
      ) : null}
      <span className={labelClasses}>{item.title}</span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        title={item.title}
        className={common}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} title={item.title} className={common}>
      {content}
    </Link>
  );
}

export function Header() {
  return (
    <header className="header relative z-40 flex h-16 w-full items-center px-4 sm:px-6 xl:px-10">
      <Logo />
      <nav className="nav flex w-full items-center justify-end pl-16 sm:pl-20 xl:pl-24">
        <div className="spacer flex-1" />
        <div className="right flex items-center gap-1 print:opacity-0">
          {navigation.map((item) => (
            <NavLink key={item.title} item={item} />
          ))}
          <ThemeToggleIcon />
        </div>
      </nav>
    </header>
  );
}
