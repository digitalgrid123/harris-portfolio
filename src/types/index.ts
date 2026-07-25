export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  url: string;
  ogImage: string;
  location?: string;
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
    rss?: string;
  };
};

export type Theme = "light" | "dark" | "system";

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  external?: boolean;
  hideLabelOnMobile?: boolean;
  hideLabelOnDesktop?: boolean;
  hideOnMobile?: boolean;
};
