import type { Metadata } from "next";
import Link from "next/link";
import { POSTS, siteConfig } from "@/config";
import { BackLink } from "@/components";
import { buildBodyHtml, findItem, formatDate } from "@/lib";

export const dynamic = "force-static";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findItem(POSTS, slug);
  const title = `${post.title} · ${siteConfig.author}`;
  const description = `${formatDate(post.date)} · ${post.minutes} min read. ${post.title}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      url: `/posts/${slug}`,
      authors: [siteConfig.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = findItem(POSTS, slug);
  const bodyHtml = buildBodyHtml(post, "post");

  const postUrl = `${siteConfig.url}/posts/${slug}`;
  const shareText = encodeURIComponent(
    `Reading ${siteConfig.author}'s post "${post.title}" ${postUrl}\n\nI think...`,
  );

  return (
    <main className="px-7 py-10 of-x-hidden">
      <div className="post-header prose m-auto mb-8" lang="en">
        <h1 className="mb-0 slide-enter-50">{post.title}</h1>
        <p className="opacity-50 mt-2 slide-enter-50">
          {formatDate(post.date)} <span>· {post.minutes}min</span>
          {post.external ? (
            <>
              {" "}
              <span>
                ·{" "}
                <Link
                  href={post.external}
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
          {post.tag ? (
            <>
              {" "}
              <span>
                · <span className="ws-nowrap">{post.tag}</span>
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
      <BackLink href="/posts" />
    </main>
  );
}
