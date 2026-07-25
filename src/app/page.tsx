import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { siteConfig } from "@/config";
import { sinecureLogo, m2logixLogo } from "@/assets";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

type StaticImage = string | StaticImport;
type ImageObject = {
  url: string;
  dimensions?: { width: number; height: number };
  alt?: string;
} | null;

function MagicLink({
  href,
  label,
  image,
  external = true,
}: {
  href: string;
  label: string;
  image: StaticImage | ImageObject;
  external?: boolean;
}) {
  const extra = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  // Check if image is valid
  const isValidImage =
    (typeof image === "string" && image.trim() !== "") ||
    (image &&
      typeof image === "object" &&
      "url" in image &&
      (image as any).url) ||
    (image && typeof image === "object" && "src" in image);

  return (
    <a href={href} className="markdown-magic-link" {...extra}>
      {isValidImage && (
        <span className="markdown-magic-link-image">
          <Image
            src={
              typeof image === "object" && image && "url" in image
                ? (image as any).url
                : (image as StaticImage)
            }
            alt={
              typeof image === "object" && image && "alt" in image
                ? (image as any).alt || `${label} logo`
                : `${label} logo`
            }
            sizes="32px"
            width={32}
            height={32}
            className="h-full w-auto object-contain"
          />
        </span>
      )}
      {label}
    </a>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 transition-opacity duration-200 opacity-90 hover:opacity-100"
    >
      <span className="op75 inline-flex">
        <i className={`${icon} text-base`} aria-hidden="true" />
      </span>{" "}
      {label}
    </a>
  );
}

const queryHomepage = async () => {
  const client = createClient();
  try {
    return await client.getSingle("home");
  } catch (error) {
    console.error("Failed to fetch home content from Prismic:", error);
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await queryHomepage();

  if (!homepage) {
    return {
      title: siteConfig.author,
      description: siteConfig.description,
    };
  }

  const meta_title = homepage.data.meta_title || siteConfig.author;
  const meta_description =
    homepage.data.meta_description || siteConfig.description;

  return {
    title: meta_title,
    description: meta_description,
    openGraph: {
      title: meta_title,
      description: meta_description,
      type: "website",
      url: siteConfig.url,
    },
  };
}

export default async function Home() {
  const homepage = await queryHomepage();

  // Get data from Prismic or use config fallback
  const title = homepage?.data?.title || siteConfig.author;
  const subtitle = homepage?.data?.subtitle || "";
  const intro_text = homepage?.data?.intro_text;

  const company1_name = homepage?.data?.company1_name || "Sinecure";
  const company1_url =
    homepage?.data?.company1_url ||
    "https://pk.linkedin.com/company/sinecureofficial";
  const company1_logo = homepage?.data?.company1_logo || sinecureLogo;

  const company2_name = homepage?.data?.company2_name || "M2Logix";
  let company2_url = homepage?.data?.company2_url || "https://m2logix.com/";
  if (company2_url === "M2Logix" || !company2_url.startsWith("http")) {
    company2_url = "https://m2logix.com/";
  }
  const company2_logo = homepage?.data?.company2_logo || m2logixLogo;

  const contentSections = homepage?.data?.content_sections || [];

  const github_url = homepage?.data?.github_url || siteConfig.links.github;
  const linkedin_url =
    homepage?.data?.linkedin_url || siteConfig.links.linkedin;
  const email = homepage?.data?.email || siteConfig.links.email;

  const emailHref = email ?? "mailto:dev.me.harris@gmail.com";
  const emailPlain = emailHref.startsWith("mailto:")
    ? emailHref.slice(7)
    : emailHref;

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-10">
      {/* Title Section */}
      <div className="mb-16 slide-enter-50">
        <h1 className="home-title mb-0">{title}</h1>
        {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
      </div>

      <article className="w-full">
        <div className="prose m-auto w-full slide-enter-content">
          {/* Intro Paragraph */}
          <div className="mb-6">
            {intro_text ? (
              <PrismicRichText field={intro_text} />
            ) : (
              <p>
                Hey! I&apos;m {title}, a passionate full-stack developer who
                loves crafting polished, high-performance web experiences.
              </p>
            )}
          </div>

          {/* Working At Section */}
          <div className="mb-6">
            <p>
              Working at{" "}
              <MagicLink
                href={company1_url}
                label={company1_name}
                image={company1_logo}
              />{" "}
              /{" "}
              <MagicLink
                href={company2_url}
                label={company2_name}
                image={company2_logo}
              />
            </p>
          </div>

          {/* Content Sections or Fallback */}
          {contentSections && contentSections.length > 0 ? (
            <>
              {contentSections.map((section: any, idx: number) => {
                let sectionText = "";

                // Extract text from Prismic rich text field
                if (
                  section.section_text &&
                  Array.isArray(section.section_text)
                ) {
                  sectionText = section.section_text
                    .map((block: any) => block.text || "")
                    .join(" ");
                }

                // Parse and create links for specific phrases
                const phrases = [
                  { text: "full projects list here", href: "/projects" },
                  { text: "blog posts", href: "/posts" },
                  { text: "About", href: "/about" },
                  { text: "Resume", href: "/resume" },
                  { text: "photos on this page", href: "/photos" },
                ];

                let parsedContent: (string | ReactNode)[] = [sectionText];

                for (const phrase of phrases) {
                  const newContent: (string | ReactNode)[] = [];

                  for (const item of parsedContent) {
                    if (typeof item === "string") {
                      const parts = item.split(
                        new RegExp(
                          `(${phrase.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                          "g",
                        ),
                      );

                      parts.forEach((part, partIdx) => {
                        if (part === phrase.text) {
                          newContent.push(
                            <Link
                              key={`${phrase.text}-${idx}-${partIdx}`}
                              href={phrase.href}
                            >
                              {part}
                            </Link>,
                          );
                        } else if (part) {
                          newContent.push(part);
                        }
                      });
                    } else {
                      newContent.push(item);
                    }
                  }

                  parsedContent = newContent;
                }

                return (
                  <div key={idx} className="mb-6">
                    {section.section_title && <h3>{section.section_title}</h3>}
                    <p>{parsedContent}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="mb-6">
                <p>
                  Dreaming up cool ideas and making them come true is where my
                  passion lies. I am enthusiastic about building products and
                  tools that help myself and others to be more productive and
                  enjoy the process of crafting. You can find my{" "}
                  <Link href="/projects">full projects list here</Link>.
                </p>
              </div>
              <div className="mb-6">
                <p>
                  I write <Link href="/posts">blog posts</Link> about web
                  development, coding, open source, and how I approach product
                  work. From time to time, I make some generative-art,
                  interactivity and UI experiments. Dig deeper into my story on
                  the <Link href="/about">About</Link> page, or check out my{" "}
                  <Link href="/resume">Resume</Link> for the full experience
                  timeline.
                </p>
              </div>
              <div className="mb-6">
                <p>
                  Outside of programming, I enjoy doing photography and
                  traveling. I post{" "}
                  <Link href="/photos">photos on this page</Link>.
                </p>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="my-8">
            <hr />
          </div>

          {/* Social Section */}
          <div className="mb-6">
            <p className="mb-3">Find me on</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {github_url && (
                <SocialLink
                  href={github_url}
                  icon="ri-github-line"
                  label="GitHub"
                />
              )}
              {linkedin_url && (
                <SocialLink
                  href={linkedin_url}
                  icon="ri-linkedin-line"
                  label="LinkedIn"
                />
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <p>
              Or mail me at{" "}
              <span className="font-mono">
                {emailPlain.split("@")[0]}
                <i
                  className="ri-at-line align-[-2px] op75"
                  aria-hidden="true"
                />
                {emailPlain.split("@")[1]}
              </span>
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
