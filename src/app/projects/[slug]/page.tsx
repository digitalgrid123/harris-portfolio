import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/prismicio";
import { BackLink } from "@/components";
import { siteConfig } from "@/config";
import { highlightCode } from "@/lib/syntax-highlight";
import { getRecentReleases } from "@/lib/github-releases";

type Params = Promise<{ slug: string }>;

async function getProject(uid: string) {
  const client = createClient();
  try {
    return await client.getByUID("project", uid);
  } catch (error) {
    console.error(`Failed to fetch project ${uid}:`, error);
    return null;
  }
}

async function getHome() {
  const client = createClient();
  try {
    return await client.getSingle("home");
  } catch (error) {
    console.error("Failed to fetch home from Prismic:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = `${project.data.title} · ${siteConfig.author}`;
  const description = project.data.excerpt || project.data.title;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/projects/${slug}`,
      images: project.data.featured_image?.url
        ? [
            {
              url: project.data.featured_image.url,
              width: project.data.featured_image.dimensions?.width,
              height: project.data.featured_image.dimensions?.height,
              alt: project.data.image_alt || project.data.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.data.featured_image?.url
        ? [project.data.featured_image.url]
        : [],
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
        <code
          key={`c-${match.index}`}
          className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm"
        >
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
        const highlightedHtml = await highlightCode(
          codeContent.trimEnd(),
          codeLanguage
        );
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
        <ul
          key={`list-${parts.length}`}
          className="list-disc list-inside mb-4 space-y-2 pl-2"
        >
          {listItems.map((item, i) => (
            <li key={`li-${i}`} className="text-base">
              {parseInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      const headerText = trimmed.slice(4).replace(/\*\*([^*]+)\*\*/g, "$1");
      parts.push(
        <h3 key={`h3-${parts.length}`} className="text-lg font-bold mt-6 mb-3">
          {headerText}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      const headerText = trimmed.slice(3).replace(/\*\*([^*]+)\*\*/g, "$1");
      parts.push(
        <h2 key={`h2-${parts.length}`} className="text-2xl font-bold mt-8 mb-4">
          {headerText}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      const headerText = trimmed.slice(2).replace(/\*\*([^*]+)\*\*/g, "$1");
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

    // Empty lines
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

  // Close code block if still open
  if (inCodeBlock) {
    const highlightedHtml = await highlightCode(
      codeContent.trimEnd(),
      codeLanguage
    );
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
      <ul
        key={`list-${parts.length}`}
        className="list-disc list-inside mb-4 space-y-2 pl-2"
      >
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

function reconstructContent(
  blocks: any[]
): Array<{ type: string; text: string }> {
  const result: Array<{ type: string; text: string }> = [];
  let currentBlockLines: string[] = [];
  let inCodeBlock = false;

  for (const block of blocks) {
    const text = block.text || "";
    const trimmed = text.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        currentBlockLines.push(text);
        result.push({
          type: "paragraph",
          text: currentBlockLines.join("\n"),
        });
        currentBlockLines = [];
        inCodeBlock = false;
      } else {
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
      const lines = text.split("\n");
      currentBlockLines.push(...lines);
    } else {
      if (trimmed === "") {
        if (currentBlockLines.length > 0) {
          result.push({
            type: "paragraph",
            text: currentBlockLines.join("\n"),
          });
          currentBlockLines = [];
        }
      } else {
        currentBlockLines.push(text);
      }
    }
  }

  if (currentBlockLines.length > 0) {
    result.push({
      type: "paragraph",
      text: currentBlockLines.join("\n"),
    });
  }

  return result;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  const home = await getHome();

  if (!project) {
    return (
      <main className="px-7 py-10">
        <div className="prose m-auto text-center">
          <h1 className="text-2xl font-bold">Project Not Found</h1>
          <p className="text-zinc-500 mt-4">
            The project you're looking for doesn't exist.
          </p>
          <BackLink href="/projects" />
        </div>
      </main>
    );
  }

  const {
    title,
    description,
    featured_image,
    image_alt,
    gallery,
    tech_stack,
    status,
    live_url,
    demo_url,
    github_link,
  } = project.data;

  // Use GitHub link from home data if project doesn't have specific one
  const projectGithubLink = github_link || home?.data?.github_url;

  // Fetch recent releases from GitHub if link is provided
  const recentRelease = projectGithubLink ? await getRecentReleases(projectGithubLink) : null;

  const content = description;
  const reconstructedBlocks = Array.isArray(content)
    ? reconstructContent(content)
    : [{ type: "paragraph", text: content }];

  return (
    <main className="px-7 py-10 of-x-hidden">
      <div className="project-header prose m-auto mb-8" lang="en">
        <h1 className="mb-0 slide-enter-50">{title}</h1>
        {status && (
          <p className="opacity-50 mt-2 slide-enter-50">
            <span className="inline-block px-2.5 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {status}
            </span>
          </p>
        )}
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
          </div>
        </div>
      )}

      {/* Project Links - GitHub and Recent Releases */}
      {(projectGithubLink || recentRelease) && (
        <div className="prose m-auto pb-5 mx-auto mt-10 text-center">
          <div className="flex gap-2 justify-center flex-wrap">
            {projectGithubLink && (
              <a
                href={projectGithubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <i className="ri-github-line group-hover:scale-110 transition-transform" />
                GitHub
              </a>
            )}
            {recentRelease && (
              <a
                href={recentRelease.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <i className="ri-rocket-2-line group-hover:scale-110 transition-transform" />
                Recent Releases
              </a>
            )}
          </div>
          <hr className="mt-6" />
        </div>
      )}

      {/* Tech Stack */}
      {tech_stack && (
        <div className="mb-8 slide-enter max-w-3xl mx-auto">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {tech_stack.split(",").map((tech, i) => (
              <span
                key={i}
                className="inline-block text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-full font-medium"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <article lang="en" className="project-body">
        <div className="prose m-auto slide-enter-content max-w-3xl">
          <div className="space-y-4">
            {await Promise.all(
              reconstructedBlocks.map(async (block: any, idx: number) => {
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

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gallery.map((item: any, idx: number) => (
              <div key={idx} className="rounded-lg overflow-hidden shadow-md">
                {item.image?.url && (
                  <>
                    <Image
                      src={item.image.url}
                      alt={item.image_alt || `Gallery image ${idx + 1}`}
                      width={item.image.dimensions?.width || 600}
                      height={item.image.dimensions?.height || 400}
                      className="w-full h-auto"
                    />
                    {item.caption && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 p-3 bg-zinc-50 dark:bg-zinc-900">
                        {item.caption}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <BackLink href="/projects" />
    </main>
  );
}
