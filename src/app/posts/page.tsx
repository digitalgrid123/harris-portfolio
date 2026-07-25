import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/prismicio";

export const metadata = {
  title: "Blog",
  description: "Essays, notes, and experiments on building for the web.",
};

const POST_SUBNAV = [
  { label: "Blog", href: "/posts", active: true as const },
  { label: "Notes", href: "/notes" },
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

async function getPosts() {
  const client = createClient();
  try {
    const posts = await client.getAllByType("post", {
      orderings: {
        field: "document.first_publication_date",
        direction: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts from Prismic:", error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();
  console.log("🚀 ~ PostsPage ~ posts:", posts);
  const groups = groupByYear(posts);

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

    for (const post of items) {
      const { title, excerpt } = post.data;
      const uid = post.uid;
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
              {formatDateShort(post.first_publication_date)}
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
          <Link href={`/posts/${uid}`} className="blog-item">
            {content}
          </Link>
        </div>
      );

      children.push(row);
    }
  }

  return (
    <main className="px-7 py-10 of-x-hidden relative z-10 flex-1">
      <article>
        <div className="prose m-auto slide-enter-content">
          <div className="prose m-auto mb-8 select-none">
            <div className="blog-subnav-row">
              {POST_SUBNAV.map((item) => (
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
            <p className="blog-page-intro">
              Essays, notes, and experiments from the web.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center opacity-50">
              <p>No posts yet. Check back soon!</p>
            </div>
          ) : (
            <ul className="blog-list">{children}</ul>
          )}
        </div>
      </article>
    </main>
  );
}
