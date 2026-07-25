import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config";
import { sinecureLogo, m2logixLogo } from "@/assets";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

type StaticImage = string | StaticImport;

function MagicLink({
  href,
  label,
  image,
  external = true,
}: {
  href: string;
  label: string;
  image: StaticImage;
  external?: boolean;
}) {
  const extra = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a href={href} className="markdown-magic-link" {...extra}>
      <span className="markdown-magic-link-image">
        <Image
          src={image}
          alt={`${label} logo`}
          sizes="32px"
          className="h-full w-auto object-contain"
        />
      </span>
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

export default function Home() {
  const author = siteConfig.author;
  const emailHref = siteConfig.links.email ?? "mailto:dev.me.harris@gmail.com";
  const emailPlain = emailHref.startsWith("mailto:")
    ? emailHref.slice(7)
    : emailHref;
  const githubLink = siteConfig.links.github;
  const linkedinLink = siteConfig.links.linkedin;
  const youtubeLink: string | undefined = undefined;

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-10">
      <div className="prose m-auto mb-8 w-full">
        <h1 className="home-title mb-0 slide-enter-50">{author}</h1>
      </div>

      <article className="w-full">
        <div className="prose m-auto w-full slide-enter-content">
          <p>
            Hey! I&apos;m {author}, a passionate full-stack developer who loves
            crafting polished, high-performance web experiences.
          </p>
          <p>
            Working at{" "}
            <MagicLink
              href="https://pk.linkedin.com/company/sinecureofficial"
              label="Sinecure"
              image={sinecureLogo}
            />{" "}
            /{" "}
            <MagicLink
              href="https://m2logix.com/"
              label="M2Logix"
              image={m2logixLogo}
            />
          </p>
          <p>
            Dreaming up cool ideas and making them come true is where my passion
            lies. I am enthusiastic about building products and tools that help
            myself and others to be more productive and enjoy the process of
            crafting. You can find my{" "}
            <Link href="/projects">full projects list here</Link>.
          </p>
          <p>
            I write <Link href="/posts">blog posts</Link> about web development,
            coding, open source, and how I approach product work.
            {youtubeLink ? (
              <>
                {" "}
                Occasionally, I do live coding streams on{" "}
                <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
                .
              </>
            ) : null}{" "}
            From time to time, I make some generative-art, interactivity and UI
            experiments. Dig deeper into my story on the{" "}
            <Link href="/about">About</Link> page, or check out my{" "}
            <Link href="/resume">Resume</Link> for the full experience timeline.
          </p>
          <p>
            Outside of programming, I enjoy doing photography and traveling. I
            post <Link href="/photos">photos on this page</Link>.
          </p>

          <div className="flex-auto" />
          <hr />
          <p>Find me on</p>
          <p className="flex flex-wrap gap-x-5 gap-y-2 -mt-2">
            {githubLink && (
              <SocialLink
                href={githubLink}
                icon="ri-github-line"
                label="GitHub"
              />
            )}
            {linkedinLink && (
              <SocialLink
                href={linkedinLink}
                icon="ri-linkedin-line"
                label="LinkedIn"
              />
            )}
          </p>
          <p>
            Or mail me at{" "}
            <span className="font-mono">
              {emailPlain.split("@")[0]}
              <i className="ri-at-line align-[-2px] op75" aria-hidden="true" />
              {emailPlain.split("@")[1]}
            </span>
          </p>
        </div>
      </article>
    </main>
  );
}
