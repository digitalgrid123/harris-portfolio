import Link from "next/link";

type BackLinkProps = {
  href: string;
  label?: string;
  className?: string;
  linkClassName?: string;
};

export function BackLink({
  href,
  label = "cd ..",
  className = "",
  linkClassName = "",
}: BackLinkProps) {
  return (
    <div
      className={[
        "prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-mono op50">&gt; </span>
      <Link
        href={href}
        className={["font-mono op50 hover:op75", linkClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </Link>
    </div>
  );
}
