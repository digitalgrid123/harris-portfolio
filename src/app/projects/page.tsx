import type { Metadata } from "next";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/prismicio";
import { getRecentReleases } from "@/lib/github-releases";

export const metadata: Metadata = {
  title: "Projects · Muhammad Haris",
  description: "Projects that I created and projects I'm maintaining.",
};

async function getProjects() {
  const client = createClient();
  try {
    const projects = await client.getAllByType("project", {
      orderings: {
        field: "document.first_publication_date",
        direction: "desc",
      },
    });
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects from Prismic:", error);
    return [];
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

interface Project {
  uid: string;
  data: {
    title: string;
    excerpt?: string;
    featured_image?: any;
    status?: string;
    tech_stack?: string;
    category?: string;
    type?: string;
  };
}

type ProjectType = 
  | "Web Development"
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "Mobile"
  | "Desktop"
  | "CLI Tool"
  | "Library/Framework"
  | "Design System"
  | "Open Source"
  | "Learning Project"
  | "Experiment";

function getProjectIcon(projectType?: ProjectType) {
  const iconMap: Record<ProjectType, { icon: string; color: string }> = {
    "Web Development": { icon: "ri-earth-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Frontend": { icon: "ri-layout-grid-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Backend": { icon: "ri-server-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Full Stack": { icon: "ri-stack-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Mobile": { icon: "ri-smartphone-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Desktop": { icon: "ri-computer-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "CLI Tool": { icon: "ri-terminal-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Library/Framework": { icon: "ri-box-3-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Design System": { icon: "ri-palette-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Open Source": { icon: "ri-git-repository-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Learning Project": { icon: "ri-lightbulb-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
    "Experiment": { icon: "ri-flask-line", color: "bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400" },
  };

  return iconMap[projectType || "Web Development"] || iconMap["Web Development"];
}

function groupProjectsByCategory(projects: Project[]) {
  const grouped: { [key: string]: Project[] } = {};
  
  projects.forEach((project) => {
    const category = project.data.category || "Other Projects";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(project);
  });

  return grouped;
}

function ProjectCard({ project, idx, recentRelease }: { project: Project; idx: number; recentRelease?: any }) {
  const { title, excerpt, status, tech_stack, type } = project.data;
  const uid = project.uid;
  const { icon, color } = getProjectIcon(type as ProjectType);

  return (
    <Link
      href={`/projects/${uid}`}
      className="group flex flex-col items-start gap-3 py-6 px-5 rounded-lg border border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300/80 dark:hover:border-gray-700/80 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all duration-300 no-underline"
      style={
        {
          "--enter-stage": idx + 1,
          "--enter-step": "60ms",
        } as React.CSSProperties
      }
    >
      {/* Icon based on project type - Larger */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ${color}`}>
        <i className={`${icon} text-xl`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {excerpt}
          </p>
        )}
        {tech_stack && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tech_stack
              .split(",")
              .slice(0, 3)
              .map((tech, i) => (
                <span
                  key={i}
                  className="inline-block text-xs bg-gray-200/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-center"
                >
                  {tech.trim()}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Arrow indicator - subtle */}
      <div className="flex-shrink-0 text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
        <i className="ri-arrow-right-line text-lg" />
      </div>
    </Link>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const home = await getHome();
  const grouped = groupProjectsByCategory(projects);
  const categories = Object.keys(grouped).sort();
  
  // Fetch recent releases if GitHub link is available
  const recentRelease = home?.data?.github_url 
    ? await getRecentReleases(home.data.github_url) 
    : null;

  return (
    <main className="px-7 py-10 of-x-hidden relative z-10 flex-1">
      {/* Header */}
      <div className="mb-12 relative z-20 bg-[var(--background)] py-4">
        <h1 className="page-title slide-enter-50 text-center">Projects</h1>
        <p className="page-subtitle slide-enter-50 text-center">
          Projects that I created and projects I'm maintaining.
        </p>
      </div>

      {/* GitHub & Recent Releases Buttons */}
      {(home?.data?.github_url || recentRelease) && (
        <div className="m-auto pb-6 mx-auto mt-10 text-center relative z-20">
          <div className="flex gap-3 justify-center flex-wrap items-center">
            {home?.data?.github_url && (
              <a
                href={home.data.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <i className="ri-github-line" />
                GitHub
              </a>
            )}
            {recentRelease && (
              <a
                href={recentRelease.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <i className="ri-rocket-2-line" />
                Recent Releases
              </a>
            )}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mt-8" />
        </div>
      )}

      {/* Projects by Category */}
      <div className="relative z-20 max-w-4xl mx-auto">
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/20 rounded-lg border border-gray-200/50 dark:border-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">
              No projects yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category, categoryIdx) => (
              <section
                key={category}
                className="slide-enter"
                style={
                  {
                    "--enter-stage": categoryIdx + 1,
                    "--enter-step": "120ms",
                  } as React.CSSProperties
                }
              >
                {/* Category Title - Large, styled */}
                {category !== "Other Projects" && (
                  <div className="mb-6 relative">
                    <div className="absolute -left-8 -top-2 text-7xl font-black opacity-[0.08] pointer-events-none select-none text-gray-400 dark:text-gray-600 -z-10 tracking-tighter">
                      {category.split(" ")[0]}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                      {category}
                    </h2>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-gray-400 to-transparent dark:from-gray-600 mt-3" />
                  </div>
                )}

                {/* Projects Grid for this Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {grouped[category].map((project, idx) => (
                    <ProjectCard key={project.uid} project={project} idx={idx} recentRelease={recentRelease} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="prose m-auto mt-16 mb-8 slide-enter print:hidden">
          <span className="font-mono op50">&gt; </span>
          <Link href="/" className="font-mono op50 hover:op75">
            cd ..
          </Link>
        </div>
      </div>
    </main>
  );
}
