import type { Metadata } from "next";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { siteConfig } from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await queryAbout();

  const title = aboutPage?.data?.title || "About";
  const meta_title = aboutPage?.data?.meta_title || `${title} · ${siteConfig.author}`;
  const meta_description =
    aboutPage?.data?.meta_description ||
    "The story behind the craft — experience, education, and everything in between.";

  return {
    title: meta_title,
    description: meta_description,
    openGraph: {
      title: meta_title,
      description: meta_description,
      type: "website",
      url: `${siteConfig.url}/about`,
    },
  };
}

const queryAbout = async () => {
  const client = createClient();
  try {
    return await client.getSingle("about");
  } catch (error) {
    console.error("Failed to fetch about content from Prismic:", error);
    return null;
  }
};

export default async function AboutPage() {
  const aboutPage = await queryAbout();

  // Fallback values
  const pageTitle = aboutPage?.data?.title || "About";
  const pageSubtitle =
    aboutPage?.data?.subtitle ||
    "The story behind the craft — experience, education, and everything in between.";
  const introContent = aboutPage?.data?.intro_content;
  const experienceYears = aboutPage?.data?.experience_years || "4 years";
  const skills = aboutPage?.data?.skills || [];
  const education = aboutPage?.data?.education || [];
  const achievements = aboutPage?.data?.achievements || [];

  const emailHref = siteConfig.links.email ?? "mailto:dev.me.harris@gmail.com";
  const emailPlain = emailHref.startsWith("mailto:")
    ? emailHref.slice(7)
    : emailHref;
  const location = siteConfig.location ?? "Lahore, Pakistan";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-10">
      <section className="w-full slide-enter-50">
        <h1 className="section-heading">{pageTitle}</h1>
        <p className="section-subtitle">{pageSubtitle}</p>

        <div className="prose mt-6 max-w-none">
          {introContent ? (
            <PrismicRichText field={introContent} />
          ) : (
            <p>
              I&apos;m a passionate full-stack developer with over 5 years of
              experience creating digital solutions. I specialize in React,
              Node.js, and modern web technologies. My journey began with a
              curiosity for how things work, and now I build applications that
              make people&apos;s lives easier. I love tackling complex problems
              and turning ideas into reality through clean, efficient code.
            </p>
          )}
        </div>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-item-label">
              <i className="ri-map-pin-2-line" aria-hidden="true" />
              Location
            </div>
            <div className="info-item-value">{location}</div>
          </div>
          <div className="info-item">
            <div className="info-item-label">
              <i className="ri-mail-line" aria-hidden="true" />
              Email
            </div>
            <div className="info-item-value">
              <a href={emailHref}>{emailPlain}</a>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-label">
              <i className="ri-time-line" aria-hidden="true" />
              Experience
            </div>
            <div className="info-item-value">{experienceYears}</div>
          </div>
        </div>
      </section>

      <section className="w-full slide-enter-content">
        <h2 className="section-heading mt-8 text-[1.15rem]">Skills</h2>
        <div className="skills-grid">
          {Array.isArray(skills) &&
            skills.length > 0 &&
            skills.map((skill: any, idx: number) => (
              <div className="skill-tile" key={`skill-${idx}`}>
                {skill.skill_name || skill}
              </div>
            ))}
        </div>

        <h2
          className="section-heading"
          style={{ fontSize: "1.15rem", marginTop: "2.25rem" }}
        >
          Education
        </h2>
        <div className="cards-list">
          {Array.isArray(education) && education.length > 0 ? (
            education.map((edu: any, idx: number) => (
              <article className="card-item" key={`edu-${idx}`}>
                <div className="card-head">
                  <div className="card-title">{edu.edu_title}</div>
                  <div className="card-meta">{edu.edu_year}</div>
                </div>
                <div className="card-subtitle">{edu.edu_place}</div>
              </article>
            ))
          ) : (
            <article className="card-item">
              <div className="card-head">
                <div className="card-title">
                  Full Stack Web Development Bootcamp
                </div>
                <div className="card-meta">2024</div>
              </div>
              <div className="card-subtitle">Online Course</div>
            </article>
          )}
        </div>

        <h2
          className="section-heading"
          style={{ fontSize: "1.15rem", marginTop: "2.25rem" }}
        >
          Achievements
        </h2>
        <div className="cards-list">
          {Array.isArray(achievements) && achievements.length > 0 ? (
            achievements.map((achievement: any, idx: number) => (
              <article className="card-item" key={`achievement-${idx}`}>
                <div className="card-head">
                  <div className="card-title">
                    {achievement.achievement_title}
                  </div>
                  <div className="card-meta">{achievement.achievement_year}</div>
                </div>
                {achievement.achievement_description && (
                  <div className="card-description">
                    <PrismicRichText
                      field={achievement.achievement_description}
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            <>
              <article className="card-item">
                <div className="card-head">
                  <div className="card-title">Top Rated Freelancer on Upwork</div>
                  <div className="card-meta">2024</div>
                </div>
                <p className="card-description">
                  Earned consistent 5-star reviews across multiple full-stack
                  projects for global clients on Upwork.
                </p>
              </article>
              <article className="card-item">
                <div className="card-head">
                  <div className="card-title">Key Contributor – Sinecure Technologies</div>
                  <div className="card-meta">2023</div>
                </div>
                <p className="card-description">
                  Played a major role in delivering scalable features for
                  enterprise applications; recognized internally for engineering
                  excellence.
                </p>
              </article>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
