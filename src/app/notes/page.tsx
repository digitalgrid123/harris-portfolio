import type { ReactNode } from "react";
import Link from "next/link";
import { NOTES } from "@/config";
import type { NoteItem } from "@/config";

export const metadata = {
  title: "Notes",
  description: "Quick notes, TILs, and short-form thoughts on engineering.",
};

const NOTES_SUBNAV = [
  { label: "Blog", href: "/posts" },
  { label: "Notes", href: "/notes", active: true as const },
];

function formatDateShort(iso: string) {
  const d = new Date(iso);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function getYear(iso: string) {
  return new Date(iso).getUTCFullYear();
}

function groupByYear(items: readonly NoteItem[]) {
  const groups = new Map<number, NoteItem[]>();
  for (const item of items) {
    const year = getYear(item.date);
    const list = groups.get(year) ?? [];
    list.push(item);
    groups.set(year, list);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b - a);
}

export default function NotesPage() {
  const itemsSorted = [...NOTES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const groups = groupByYear(itemsSorted);

  let stage = 0;
  const nextStage = () => stage++;

  const children: ReactNode[] = [];
  for (const [year, items] of groups) {
    const yearStage = Math.max(0, nextStage() - 2);
    children.push(
      <div
        key={`y-${year}`}
        className="year-divider slide-enter"
        style={
          {
            ["--enter-stage" as any]: yearStage,
            ["--enter-step" as any]: "90ms",
          } as React.CSSProperties
        }
      >
        <span
          className="text-stroke-2 text-stroke-hex-aaa op10"
          aria-hidden="true"
        >
          {year}
        </span>
      </div>,
    );

    for (const note of items) {
      const isExternal = !!note.external;
      const href = note.external ?? `/notes/${note.slug}`;
      const itemStage = nextStage();
      const tagDesktop = note.tag ? (
        <div className="blog-item-tag-desktop">{note.tag}</div>
      ) : null;
      const content = (
        <li className="li-row-gap2-md no-underline">
          <div className="blog-item-title-row">
            {note.hasVideo ? (
              <span className="video-link-icon" title="Provided in video">
                <i
                  className="ri-film-line"
                  style={{
                    display: "inline-block",
                    width: "1.2em",
                    height: "1.2em",
                    fontSize: "1.2em",
                    lineHeight: 1,
                    verticalAlign: "-0.15em",
                  }}
                  aria-hidden="true"
                />
              </span>
            ) : null}
            <span
              style={{
                verticalAlign: "middle",
                display: "inline-block",
              }}
            >
              {note.title}
            </span>
            {isExternal ? (
              <span className="external-link-icon" title="External">
                <i
                  className="ri-external-link-line"
                  style={{
                    display: "inline-block",
                    width: "1em",
                    height: "1em",
                    fontSize: "1em",
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                />
              </span>
            ) : null}
          </div>
          <div className="blog-item-meta-row">
            <span className="text-sm op50 ws-nowrap">
              {formatDateShort(note.date)}
            </span>
            <span className="text-sm op40 ws-nowrap">· {note.minutes}min</span>
            {note.tag ? (
              <span className="text-sm op40 ws-nowrap blog-item-tag-mobile">
                · {note.tag}
              </span>
            ) : null}
          </div>
        </li>
      );

      const row = (
        <div
          key={note.slug}
          className="slide-enter"
          style={
            {
              ["--enter-stage" as any]: itemStage,
              ["--enter-step" as any]: "90ms",
            } as React.CSSProperties
          }
        >
          {isExternal ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="item block font-normal mb-6 mt-2 no-underline"
            >
              {content}
              {tagDesktop}
            </a>
          ) : (
            <Link
              href={href}
              className="item block font-normal mb-6 mt-2 no-underline"
            >
              {content}
              {tagDesktop}
            </Link>
          )}
        </div>
      );

      children.push(row);
    }
  }

  return (
    <main className="px-7 py-10 of-x-hidden relative z-10 mx-auto w-full max-w-3xl flex-1">
      <article>
        <div className="prose m-auto slide-enter-content">
          <div className="prose m-auto mb-8 select-none">
            <button type="button" disabled className="blog-lang-indicator">
              <i
                className="ri-checkbox-circle-line"
                style={{
                  display: "inline-block",
                  width: "1.2em",
                  height: "1.2em",
                  fontSize: "1em",
                  lineHeight: 1,
                  verticalAlign: "-0.15em",
                }}
                aria-hidden="true"
              />
              <span className="text-sm"> English Only </span>
            </button>

            <div className="blog-subnav-row">
              {NOTES_SUBNAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={item.active ? "active" : ""}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <ul className="list-none m-0 p-0">{children}</ul>
        </div>
      </article>
    </main>
  );
}
