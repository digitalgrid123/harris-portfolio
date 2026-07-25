import type { Metadata } from "next";
import Link from "next/link";
import { NOTES, siteConfig } from "@/config";
import { BackLink } from "@/components";
import { buildBodyHtml, findItem, formatDate } from "@/lib";

export const dynamic = "force-static";

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = findItem(NOTES, slug);
  const title = `${note.title} · ${siteConfig.author}`;
  const description = `${formatDate(note.date)} · ${note.minutes} min read. ${note.title}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/notes/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: note.date,
      url: `/notes/${slug}`,
      authors: [siteConfig.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function NoteDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const note = findItem(NOTES, slug);
  const bodyHtml = buildBodyHtml(note, "note");

  const noteUrl = `${siteConfig.url}/notes/${slug}`;
  const shareText = encodeURIComponent(
    `Reading ${siteConfig.author}'s note "${note.title}" ${noteUrl}\n\nI think...`,
  );

  return (
    <main className="px-7 py-10 of-x-hidden">
      <div className="post-header prose m-auto mb-8" lang="en">
        <h1 className="mb-0 slide-enter-50">{note.title}</h1>
        <p className="opacity-50 mt-2 slide-enter-50">
          {formatDate(note.date)} <span>· {note.minutes}min</span>
          {note.external ? (
            <>
              {" "}
              <span>
                ·{" "}
                <Link
                  href={note.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  External{" "}
                  <i className="ri-external-link-line ml-0.5 text-[0.8em]" />
                </Link>
              </span>
            </>
          ) : null}
          {note.tag ? (
            <>
              {" "}
              <span>
                · <span className="ws-nowrap">{note.tag}</span>
              </span>
            </>
          ) : null}
        </p>
      </div>
      <article lang="en" className="post-body">
        <div
          className="prose m-auto slide-enter-content"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
      <BackLink href="/notes" />
    </main>
  );
}
