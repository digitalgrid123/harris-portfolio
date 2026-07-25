import type { NavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Muhammad Haris Portfolio",
  author: "Muhammad Haris",
  description: "A modern portfolio built with Next.js 16 and Tailwind CSS.",
  url: "https://www.linkedin.com/in/muhammad-haris-66a22b37a/",
  ogImage: "/og.png",
  location: "Lahore, Pakistan",
  links: {
    github: "https://github.com/digitalgrid123",
    linkedin: "https://www.linkedin.com/in/muhammad-haris-66a22b37a/",
    email: "mailto:dev.me.harris@gmail.com",
    rss: "/feed.xml",
  },
};

export const navigation: NavItem[] = [
  {
    title: "Blog",
    href: "/posts",
    icon: "ri-article-line",
    hideLabelOnDesktop: false,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: "ri-lightbulb-line",
    hideLabelOnDesktop: false,
  },
  // {
  //   title: "About",
  //   href: "/about",
  //   icon: "ri-user-3-line",
  //   hideLabelOnDesktop: false,
  // },
  // {
  //   title: "Resume",
  //   href: "/resume",
  //   icon: "ri-file-list-3-line",
  //   hideLabelOnDesktop: false,
  // },
  {
    title: "Photos",
    href: "/photos",
    icon: "ri-camera-3-line",
    hideLabelOnDesktop: true,
  },

  {
    title: "GitHub",
    href: siteConfig.links.github!,
    icon: "ri-github-line",
    external: true,
    hideOnMobile: true,
    hideLabelOnDesktop: true,
  },
];
