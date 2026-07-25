import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/prismicio";
import { BackLink } from "@/components";
import { siteConfig } from "@/config";
import { highlightCode } from "@/lib/syntax-highlight";

type Params = Promise<{ slug: string }>;

async function getPost(uid: string) {
  const client = createClient();
  try {
    return await client.getByUID("post", uid);
  } catch (error) {
    console.error(`Failed to fetch post ${uid}:`, error);
    return null;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = `${post.data.title} · ${siteConfig.author}`;
  const description = post.data.excerpt || post.data.title;

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
      publishedTime: post.first_publication_date,
      url: `/posts/${slug}`,
      authors: [siteConfig.author],
      images: post.data.featured_image?.url
        ? [
            {
              url: post.data.featured_image.url,
              width: post.data.featured_image.dimensions?.width,
              height: post.data.featured_image.dimensions?.height,
              alt: post.data.image_alt || post.data.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.data.featured_image?.url ? [post.data.featured_image.url] : [],
    },
  };
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\*\*(.*?)\*\*|`([^`]+)`|_(.*?)_|\*(.*?)\*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
    } else if (match[2]) {
      parts.push(
        <code key={`c-${match.index}`} className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
          {match[2]}
        </code>
      );
    } else if (match[3]) {
      parts.push(
        <em key={`i-${match.index}`} className="italic">
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      parts.push(
        <em key={`i2-${match.index}`} className="italic">
          {match[4]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

async function parseContentBlock(text: string) {
  // Skip empty or whitespace-only blocks early
  if (!text || text.trim().length === 0) {
    return [];
  }

  const parts: React.ReactNode[] = [];
  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";
  let listItems: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        const highlightedHtml = await highlightCode(codeContent.trimEnd(), codeLanguage);
        if (highlightedHtml) {
          parts.push(
            <div
              key={`code-${parts.length}`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          );
        }
        codeContent = "";
        inCodeBlock = false;
        codeLanguage = "";
      } else {
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Flush list items if we hit non-list content
    if (listItems.length > 0 && !trimmed.startsWith("-")) {
      parts.push(
        <ul key={`list-${parts.length}`} className="list-disc list-inside mb-4 space-y-2 pl-2">
          {listItems.map((item, i) => (
            <li key={`li-${i}`} className="text-base">
              {parseInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }

    // Headers - strip bold markers
    if (trimmed.startsWith("### ")) {
      const headerText = trimmed.slice(4).replace(/\*\*([^*]+)\*\*/g, '$1');
      parts.push(
        <h3 key={`h3-${parts.length}`} className="text-lg font-bold mt-6 mb-3">
          {headerText}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      const headerText = trimmed.slice(3).replace(/\*\*([^*]+)\*\*/g, '$1');
      parts.push(
        <h2 key={`h2-${parts.length}`} className="text-2xl font-bold mt-8 mb-4">
          {headerText}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      const headerText = trimmed.slice(2).replace(/\*\*([^*]+)\*\*/g, '$1');
      parts.push(
        <h1 key={`h1-${parts.length}`} className="text-3xl font-bold mt-8 mb-4">
          {headerText}
        </h1>
      );
      continue;
    }

    // Lists
    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Empty lines - skip to avoid extra spacing
    if (trimmed === "") {
      continue;
    }

    // Regular paragraphs
    if (trimmed.length > 0) {
      parts.push(
        <p key={`p-${parts.length}`} className="mb-4 leading-relaxed text-base">
          {parseInlineFormatting(trimmed)}
        </p>
      );
    }
  }

  // IMPORTANT: If code block is still open at the end, close it!
  if (inCodeBlock) {
    const highlightedHtml = await highlightCode(codeContent.trimEnd(), codeLanguage);
    if (highlightedHtml) {
      parts.push(
        <div
          key={`code-${parts.length}`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      );
    }
  }

  // Flush remaining list items
  if (listItems.length > 0) {
    parts.push(
      <ul key={`list-${parts.length}`} className="list-disc list-inside mb-4 space-y-2 pl-2">
        {listItems.map((item, i) => (
          <li key={`li-${i}`} className="text-base">
            {parseInlineFormatting(item)}
          </li>
        ))}
      </ul>
    );
  }

  return parts;
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="px-7 py-10 flex-1">
        <div className="prose m-auto">
          <h1>Post Not Found</h1>
          <p>Sorry, we couldn't find this post.</p>
          <BackLink href="/posts" />
        </div>
      </main>
    );
  }

  const { title, excerpt, content, featured_image, image_alt, image_caption } =
    post.data;

  // Reconstruct multi-line blocks from Prismic's per-line blocks
  const reconstructedBlocks = Array.isArray(content)
    ? reconstructContent(content)
    : [{ type: "paragraph", text: content }];

  return (
    <main className="px-7 py-10 of-x-hidden">
      <div className="post-header prose m-auto mb-8" lang="en">
        <h1 className="mb-0 slide-enter-50">{title}</h1>
        <p className="opacity-50 mt-2 slide-enter-50">
          {formatDate(post.first_publication_date)}
        </p>
      </div>

      {/* Featured Image */}
      {featured_image?.url && (
        <div className="mb-8 slide-enter">
          <div className="relative w-full max-w-3xl mx-auto">
            <Image
              src={featured_image.url}
              alt={image_alt || title}
              width={featured_image.dimensions?.width || 1200}
              height={featured_image.dimensions?.height || 630}
              className="rounded-lg shadow-md w-full h-auto"
              priority
            />
            {image_caption && (
              <p className="text-sm opacity-60 text-center mt-2 italic">
                {image_caption}
              </p>
            )}
          </div>
        </div>
      )}

      <article lang="en" className="post-body">
        <div className="prose m-auto slide-enter-content max-w-3xl">
          <div className="space-y-4">
            {await Promise.all(
              reconstructedBlocks.map(async (block: any, idx: number) => {
                console.log(`[RENDER] Block ${idx}: ${block.type}`);
                const parsedContent = await parseContentBlock(block.text || "");
                return (
                  <div key={idx} className="leading-relaxed">
                    {parsedContent}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </article>

      <BackLink href="/posts" />
    </main>
  );
}

// Reconstruct Prismic's per-line blocks into proper multi-line blocks
function reconstructContent(
  blocks: any[]
): Array<{ type: string; text: string }> {
  const result: Array<{ type: string; text: string }> = [];
  let currentBlockLines: string[] = [];
  let inCodeBlock = false;

  for (const block of blocks) {
    const text = block.text || "";
    const trimmed = text.trim();

    // Detect code fence markers
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Closing fence - add line and flush block
        currentBlockLines.push(text);
        result.push({
          type: "paragraph",
          text: currentBlockLines.join("\n"),
        });
        currentBlockLines = [];
        inCodeBlock = false;
      } else {
        // Opening fence - flush previous block if any, start new one
        if (currentBlockLines.length > 0) {
          result.push({
            type: "paragraph",
            text: currentBlockLines.join("\n"),
          });
          currentBlockLines = [];
        }
        currentBlockLines.push(text);
        inCodeBlock = true;
      }
    } else if (inCodeBlock) {
      // Inside code block - accumulate lines
      // IMPORTANT: If a single Prismic block contains multiple lines (soft breaks),
      // they come as one .text string with embedded newlines. Split and preserve them.
      const lines = text.split("\n");
      currentBlockLines.push(...lines);
    } else {
      // Regular content
      if (trimmed === "") {
        // Empty line - flush block if any
        if (currentBlockLines.length > 0) {
          result.push({
            type: "paragraph",
            text: currentBlockLines.join("\n"),
          });
          currentBlockLines = [];
        }
      } else {
        // Non-empty line - accumulate
        currentBlockLines.push(text);
      }
    }
  }

  // IMPORTANT: If code block is still open at the end, close it!
  if (currentBlockLines.length > 0) {
    result.push({
      type: "paragraph",
      text: currentBlockLines.join("\n"),
    });
  }

  return result;
}
