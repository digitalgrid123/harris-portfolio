import { siteConfig, ABOUT_SKILLS, EDUCATION, ACHIEVEMENTS } from "@/config";

export const metadata = {
  title: "About",
  description:
    "The story behind the craft — experience, education, and everything in between.",
};

export default function AboutPage() {
  const emailHref = siteConfig.links.email ?? "mailto:dev.me.harris@gmail.com";
  const emailPlain = emailHref.startsWith("mailto:")
    ? emailHref.slice(7)
    : emailHref;
  const location = siteConfig.location ?? "Lahore, Pakistan";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-10">
      <section className="w-full slide-enter-50">
        <h1 className="section-heading">About</h1>
        <p className="section-subtitle">
          The story behind the craft — experience, education, and everything in
          between.
        </p>

        <div className="prose mt-6 max-w-none">
          <p>
            I&apos;m a passionate full-stack developer with over 5 years of
            experience creating digital solutions. I specialize in React,
            Node.js, and modern web technologies. My journey began with a
            curiosity for how things work, and now I build applications that
            make people&apos;s lives easier. I love tackling complex problems
            and turning ideas into reality through clean, efficient code.
          </p>
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
            <div className="info-item-value">4 years </div>
          </div>
        </div>
      </section>

      <section className="w-full slide-enter-content">
        <h2 className="section-heading mt-8 text-[1.15rem]">Skills</h2>
        <div className="skills-grid">
          {ABOUT_SKILLS.map((s) => (
            <div className="skill-tile" key={s}>
              {s}
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
          {EDUCATION.map((ed) => (
            <article className="card-item" key={`${ed.title}-${ed.year}`}>
              <div className="card-head">
                <div className="card-title">{ed.title}</div>
                <div className="card-meta">{ed.year}</div>
              </div>
              <div className="card-subtitle">{ed.place}</div>
            </article>
          ))}
        </div>

        <h2
          className="section-heading"
          style={{ fontSize: "1.15rem", marginTop: "2.25rem" }}
        >
          Achievements
        </h2>
        <div className="cards-list">
          {ACHIEVEMENTS.map((a) => (
            <article className="card-item" key={`${a.title}-${a.year}`}>
              <div className="card-head">
                <div className="card-title">{a.title}</div>
                <div className="card-meta">{a.year}</div>
              </div>
              <p className="card-description">{a.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
