import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/prismicio";

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

function groupByYear(
  items: Array<{ first_publication_date: string; uid: string; data: any }>,
) {
  const groups = new Map<
    number,
    Array<{ first_publication_date: string; uid: string; data: any }>
  >();
  for (const item of items) {
    const year = getYear(item.first_publication_date);
    const list = groups.get(year) ?? [];
    list.push(item);
    groups.set(year, list);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b - a);
}

async function getNotes() {
  const client = createClient();
  try {
    const notes = await client.getAllByType("note", {
      orderings: {
        field: "document.first_publication_date",
        direction: "desc",
      },
    });
    return notes;
  } catch (error) {
    console.error("Failed to fetch notes from Prismic:", error);
    return [];
  }
}

export default async function NotesPage() {
  const notes = await getNotes();
  const groups = groupByYear(notes);

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
      const { title, excerpt } = note.data;
      const uid = note.uid;
      const itemStage = nextStage();
      const content = (
        <li className="li-row-gap2-md no-underline">
          <div className="blog-item-title-row">
            <span
              style={{
                verticalAlign: "middle",
                display: "inline-block",
              }}
            >
              {title}
            </span>
          </div>
          <div className="blog-item-meta-row">
            <span className="text-sm op50 ws-nowrap">
              {formatDateShort(note.first_publication_date)}
            </span>
          </div>
        </li>
      );

      const row = (
        <div
          key={uid}
          className="slide-enter"
          style={
            {
              ["--enter-stage" as any]: itemStage,
              ["--enter-step" as any]: "90ms",
            } as React.CSSProperties
          }
        >
          <Link href={`/notes/${uid}`} className="item block font-normal mb-6 mt-2">
            {content}
          </Link>
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

          {notes.length === 0 ? (
            <div className="text-center opacity-50">
              <p>No notes yet. Check back soon!</p>
            </div>
          ) : (
            <ul className="list-none m-0 p-0">{children}</ul>
          )}
        </div>
      </article>
    </main>
  );
}
