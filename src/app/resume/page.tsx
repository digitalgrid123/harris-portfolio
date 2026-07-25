import Link from "next/link";
import { siteConfig, STATS, EXPERIENCE } from "@/config";

export const metadata = {
  title: "Resume",
  description:
    "Professional journey, technical craft, and the work that matters.",
};

export default function ResumePage() {
  const emailHref = siteConfig.links.email ?? "mailto:dev.me.harris@gmail.com";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-10">
      <section className="w-full slide-enter-50">
        <h1 className="section-heading">Resume</h1>
        <p className="section-subtitle">
          Professional journey, technical craft, and the work that matters.
        </p>

        <div className="cta-row">
          <Link href="/projects" className="btn btn-primary">
            <i className="ri-briefcase-4-line" aria-hidden="true" />
            View My Work
          </Link>
          <a href={emailHref} className="btn btn-ghost">
            <i className="ri-mail-line" aria-hidden="true" />
            Get in Touch
          </a>
        </div>

        <div className="stats-grid" aria-label="Career stats">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full slide-enter-content">
        <h2 className="section-heading mt-10 text-[1.25rem]">Experience</h2>
        <div className="timeline">
          {EXPERIENCE.map((item) => (
            <article
              className="timeline-entry"
              key={`${item.role}-${item.period}`}
            >
              <div className="timeline-top">
                <div className="timeline-role">{item.role}</div>
                <div className="timeline-period">{item.period}</div>
              </div>
              <div className="timeline-company">{item.company}</div>
              <p className="timeline-description">{item.description}</p>
              <ul className="timeline-bullets">
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="skill-chips">
                {item.skills.map((sk) => (
                  <span className="skill-chip" key={sk}>
                    {sk}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
