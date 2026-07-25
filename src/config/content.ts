export const STATS = [
  { value: "4+", label: "Years" },
  { value: "50", label: "Projects" },
  { value: "15", label: "Clients" },
  { value: "0", label: "Awards" },
] as const;

export type PostItem = {
  title: string;
  slug: string;
  date: string;
  minutes: number;
  external?: string;
  tag?: string;
  hasVideo?: boolean;
};

export const POSTS: PostItem[] = [
  {
    title: "Mastering Client-Server Components in Next.js 16",
    slug: "nextjs-rsc-patterns",
    date: "2025-06-18",
    minutes: 10,
  },
  {
    title: "Building Type-Safe Forms with Zod and React Hook Form",
    slug: "zod-forms",
    date: "2025-05-02",
    minutes: 8,
  },
  {
    title: "From Tailwind v3 to v4 — What Actually Changes",
    slug: "tailwind-v4-migration",
    date: "2025-03-22",
    minutes: 7,
  },
  {
    title: "Why I Keep Coming Back to Server Actions",
    slug: "server-actions-adoption",
    date: "2025-02-14",
    minutes: 6,
  },
  {
    title: "A Pragmatic Guide to Monorepo Tooling in 2025",
    slug: "monorepo-tooling-2025",
    date: "2025-01-09",
    minutes: 12,
  },
  {
    title: "Designing Portfolio Interfaces That Feel Alive",
    slug: "portfolio-ui-motion",
    date: "2024-11-28",
    minutes: 9,
  },
  {
    title: "Introducing: Design Systems for SaaS Startups",
    slug: "saas-design-systems",
    date: "2024-10-15",
    minutes: 14,
    external: "https://medium.com",
    tag: "Medium",
  },
  {
    title: "Shiki v1 — Syntax Highlighting Reimagined",
    slug: "shiki-v1-deep-dive",
    date: "2024-08-30",
    minutes: 11,
  },
  {
    title: "How I Structure a Production Next.js Repo",
    slug: "production-nextjs-structure",
    date: "2024-06-12",
    minutes: 13,
  },
  {
    title: "Simplex Noise for UI — Building Dotted Backgrounds",
    slug: "noise-dot-backgrounds",
    date: "2024-04-20",
    minutes: 7,
  },
  {
    title: "Nuxt Icon v1 — A New Era for SVG Icons",
    slug: "nuxt-icon-v1",
    date: "2024-02-05",
    minutes: 8,
    external: "https://nuxt.com/blog/nuxt-icon-v1-0",
  },
  {
    title: "Shipping My First Open Source Utility",
    slug: "first-oss-utility",
    date: "2023-11-19",
    minutes: 6,
  },
  {
    title: "Sliding Enter Animation — Pure CSS Elegance",
    slug: "sliding-enter-animation",
    date: "2023-08-14",
    minutes: 4,
    hasVideo: true,
    tag: "Frontend Summit 2023",
  },
  {
    title: "Stable Diffusion QR Code Experiments",
    slug: "ai-qrcode-101",
    date: "2023-05-29",
    minutes: 15,
  },
  {
    title: "How I Manage GitHub Notifications at Scale",
    slug: "manage-github-notifications",
    date: "2022-12-02",
    minutes: 9,
  },
] as const;

export type NoteItem = {
  title: string;
  slug: string;
  date: string;
  minutes: number;
  external?: string;
  tag?: string;
  hasVideo?: boolean;
};

export const NOTES: NoteItem[] = [
  {
    title: "Tip: Next.js 16 generateStaticParams with Param Union Types",
    slug: "nextjs-static-params-union",
    date: "2025-07-02",
    minutes: 2,
  },
  {
    title: "VS Code: Split Terminal Groups with a Single Keybind",
    slug: "vscode-split-terminal-keybind",
    date: "2025-06-14",
    minutes: 1,
  },
  {
    title: "TIL: `noEmit: true` still needs `outDir` when using allowJs",
    slug: "noemit-allowjs-outdir",
    date: "2025-05-19",
    minutes: 1,
  },
  {
    title: "Bun test is now faster than vitest in my monorepo",
    slug: "bun-vs-vitest-2025",
    date: "2025-03-28",
    minutes: 3,
  },
  {
    title: "On Writing Smaller Commits",
    slug: "smaller-commits",
    date: "2025-01-21",
    minutes: 4,
  },
  {
    title: "Preconnect hints for Google Fonts with next/font",
    slug: "preconnect-next-font",
    date: "2024-11-08",
    minutes: 2,
  },
  {
    title: "Shortcut: `pnpm dlx` instead of `npx`",
    slug: "pnpm-dlx-instead-of-npx",
    date: "2024-10-02",
    minutes: 1,
  },
  {
    title: "Remix Icon vs Lucide vs Heroicons: My 2024 Pick",
    slug: "icon-libraries-2024",
    date: "2024-08-19",
    minutes: 5,
  },
  {
    title: "GitHub Branch Protection Rules I Always Enable",
    slug: "github-branch-protection-defaults",
    date: "2024-06-04",
    minutes: 3,
  },
  {
    title: "Shrinking SVG Files Using Only Text Editors",
    slug: "shrink-svg-manually",
    date: "2024-04-27",
    minutes: 4,
  },
  {
    title: "A Single-line TS TypeGuard for Non-Null Arrays",
    slug: "non-null-array-typeguard",
    date: "2024-02-13",
    minutes: 1,
  },
  {
    title: "I Set `tsconfig: { module: preserve }` on Every New Project",
    slug: "tsconfig-module-preserve",
    date: "2023-12-15",
    minutes: 3,
    tag: "Configuration",
  },
  {
    title: "Use `git worktree` for Concurrent PR Review",
    slug: "git-worktree-review",
    date: "2023-09-06",
    minutes: 4,
  },
  {
    title: "Why I Always Disable Telemetry Upfront",
    slug: "disable-telemetry-upfront",
    date: "2023-05-20",
    minutes: 2,
  },
] as const;

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
  bullets: string[];
  skills: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    period: "2024 - Present",
    role: "Senior Frontend Developer",
    company: "M2Logix",
    description:
      "Led frontend development using React, TypeScript, and modern frameworks. Managed multiple projects efficiently, ensured timely milestone updates, and consistently delivered ahead of deadlines.",
    bullets: [
      "Maintained on-time milestone updates throughout development.",
      "Improved frontend workflow, reducing development time by 25%.",
      "Recognized by clients for clear communication and reliable delivery.",
    ],
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind",
      "Vue.js",
      "Git",
      "AWS",
    ],
  },
  {
    period: "2022 - 2024",
    role: "Junior Frontend Developer",
    company: "Sinecure Cooperation",
    description:
      "Worked on multiple SaaS applications from Figma design to full deployment. Delivered high-quality, production-ready frontend solutions with React and modern frameworks, ensuring on-time delivery and client satisfaction.",
    bullets: [
      "Translated Figma designs into responsive, user-friendly SaaS interfaces.",
      "Developed and deployed complete web applications with efficient turnaround.",
      "Contributed to a diverse portfolio, enhancing the firm's design-to-dev pipeline.",
      "Delivered all projects on or before deadlines with strong client feedback.",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "SCSS", "Redux"],
  },
  {
    period: "2022 - 2023",
    role: "Business Developer",
    company: "Sinecure Cooperation",
    description:
      "Began my journey by identifying client needs and project scopes to better understand business requirements in web development. Focused on building strong client relationships, aligning expectations, and ensuring smooth communication between clients and technical teams.",
    bullets: [
      "Successfully converted prospects into long-term clients with clear, targeted proposals.",
      "Gained deep insight into client workflows, helping bridge communication between business and development.",
      "Laid the foundation for transitioning into hands-on development with a strong client-first mindset.",
    ],
    skills: [
      "Communication",
      "Proposal Writing",
      "Basic Understanding of Technologies",
    ],
  },
];

export const ABOUT_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Node",
  "Figma",
  "Python",
  "Digital Ocean",
  "Docker",
  "Git",
  "Vue.js",
] as const;

export type EducationItem = {
  title: string;
  place: string;
  year: string;
};

export const EDUCATION: EducationItem[] = [
  {
    title: "Full Stack Web Development Bootcamp",
    place: "Online Course",
    year: "2024",
  },
  {
    title: "Bachelor Business of Information Technology",
    place: "University of Punjab, Lahore",
    year: "2023",
  },
];

export type AchievementItem = {
  title: string;
  year: string;
  description: string;
};

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    title: "Top Rated Freelancer on Upwork",
    year: "2024",
    description:
      "Earned consistent 5-star reviews across multiple full-stack projects for global clients on Upwork.",
  },
  {
    title: "Key Contributor – Sinecure Technologies",
    year: "2023",
    description:
      "Played a major role in delivering scalable features for enterprise applications; recognized internally for engineering excellence.",
  },
  {
    title: "Open Source Initiative",
    year: "2020",
    description:
      "Maintained and contributed to utility libraries and starter templates with helpful documentation for other developers.",
  },
];
