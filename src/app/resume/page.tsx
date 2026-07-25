import type { Metadata } from "next";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { siteConfig } from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  const resumePage = await queryResume();

  const title = resumePage?.data?.title || "Resume";
  const meta_title = resumePage?.data?.meta_title || `${title} · ${siteConfig.author}`;
  const meta_description =
    resumePage?.data?.meta_description ||
    "Professional journey, technical craft, and the work that matters.";

  return {
    title: meta_title,
    description: meta_description,
    openGraph: {
      title: meta_title,
      description: meta_description,
      type: "website",
      url: `${siteConfig.url}/resume`,
    },
  };
}

const queryResume = async () => {
  const client = createClient();
  try {
    return await client.getSingle("resume");
  } catch (error) {
    console.error("Failed to fetch resume content from Prismic:", error);
    return null;
  }
};

export default async function ResumePage() {
  const resumePage = await queryResume();

  // Fallback values
  const pageTitle = resumePage?.data?.title || "Resume";
  const pageSubtitle =
    resumePage?.data?.subtitle ||
    "Professional journey, technical craft, and the work that matters.";
  
  const cta1Label = resumePage?.data?.cta1_label || "View My Work";
  const cta1Link = resumePage?.data?.cta1_link || "/projects";
  const cta1Icon = resumePage?.data?.cta1_icon || "ri-briefcase-4-line";
  
  const cta2Label = resumePage?.data?.cta2_label || "Get in Touch";
  const cta2Link = resumePage?.data?.cta2_link || siteConfig.links.email;
  const cta2Icon = resumePage?.data?.cta2_icon || "ri-mail-line";

  const stats = resumePage?.data?.stats || [];
  const experience = resumePage?.data?.experience || [];

  const emailHref = siteConfig.links.email ?? "mailto:dev.me.harris@gmail.com";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-10">
      <section className="w-full slide-enter-50">
        <h1 className="section-heading">{pageTitle}</h1>
        <p className="section-subtitle">{pageSubtitle}</p>

        <div className="cta-row">
          <Link href={cta1Link} className="btn btn-primary">
            <i className={cta1Icon} aria-hidden="true" />
            {cta1Label}
          </Link>
          <a href={cta2Link} className="btn btn-ghost">
            <i className={cta2Icon} aria-hidden="true" />
            {cta2Label}
          </a>
        </div>

        <div className="stats-grid" aria-label="Career stats">
          {Array.isArray(stats) &&
            stats.length > 0 &&
            stats.map((stat: any, idx: number) => (
              <div className="stat-card" key={`stat-${idx}`}>
                <div className="stat-value">{stat.stat_value || stat.value}</div>
                <div className="stat-label">{stat.stat_label || stat.label}</div>
              </div>
            ))}
        </div>
      </section>

      <section className="w-full slide-enter-content">
        <h2 className="section-heading mt-10 text-[1.25rem]">Experience</h2>
        <div className="timeline">
          {Array.isArray(experience) && experience.length > 0 ? (
            experience.map((item: any, idx: number) => (
              <article
                className="timeline-entry"
                key={`exp-${idx}`}
              >
                <div className="timeline-top">
                  <div className="timeline-role">{item.exp_role}</div>
                  <div className="timeline-period">{item.exp_period}</div>
                </div>
                <div className="timeline-company">{item.exp_company}</div>
                {item.exp_description && (
                  <div className="timeline-description">
                    <PrismicRichText field={item.exp_description} />
                  </div>
                )}
                {item.exp_bullets && Array.isArray(item.exp_bullets) && (
                  <ul className="timeline-bullets">
                    {item.exp_bullets.map((bullet: any, bulletIdx: number) => (
                      <li key={`bullet-${bulletIdx}`}>
                        {bullet.bullet_text}
                      </li>
                    ))}
                  </ul>
                )}
                {item.exp_skills && Array.isArray(item.exp_skills) && (
                  <div className="skill-chips">
                    {item.exp_skills.map((skill: any, skillIdx: number) => (
                      <span className="skill-chip" key={`skill-${skillIdx}`}>
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))
          ) : null}
        </div>
      </section>
    </main>
  );
}
