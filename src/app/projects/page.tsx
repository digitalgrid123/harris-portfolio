import type { Metadata } from "next";
import Link from "next/link";
import projectsData from "@/config/projects-data.json";

export const metadata: Metadata = {
  title: "Projects · Muhammad Haris",
  description: "Projects that I created or maintaining.",
};

export default function ProjectsPage() {
  const visibleProjects = projectsData
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const haystack =
          `${item.title} ${item.desc ?? ""} ${item.href}`.toLowerCase();
        return !haystack.includes("antfu");
      }),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <main className="px-7 py-10 of-x-hidden relative z-10 flex-1">
      <div className="prose m-auto mb-8 text-center">
        <h1 className="page-title slide-enter-50">Projects</h1>
        <p className="page-subtitle slide-enter-50">
          Projects that I created or maintaining.
        </p>
      </div>

      <div className="prose m-auto">
        <div className="prose pb-5 mx-auto mt-6 text-center slide-enter-50">
          <div className="mx-auto flex justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-md border border-zinc-200/50 bg-zinc-100 px-4 py-2 transition-colors hover:bg-zinc-200/50 dark:border-zinc-800/50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80"
            >
              <i className="ri-github-fill group-hover:text-blue-500 transition-colors" />
              GitHub
            </a>
          </div>
          <hr className="my-8 border-t border-zinc-200/30 dark:border-zinc-800/30" />
        </div>

        {visibleProjects.map((category, catIdx) => (
          <div
            key={category.id}
            className="mb-16 slide-enter"
            style={{ "--enter-stage": catIdx + 1 } as React.CSSProperties}
          >
            {/* Category Header */}
            <div className="page-section-title">
              <span>{category.title}</span>
            </div>

            {/* Grid of Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 project-grid">
              {category.items.map((item, itemIdx) => (
                <a
                  key={itemIdx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card item relative flex items-start p-4 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-all duration-300 group border border-transparent hover:border-zinc-200/20 dark:hover:border-zinc-800/20"
                  style={{ textDecoration: "none" }}
                  title={item.title}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mr-4 text-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    {item.svgContent ? (
                      <div
                        className="w-8 h-8 flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7 [&>svg]:fill-current [&>svg]:text-zinc-700 dark:[&>svg]:text-zinc-300"
                        dangerouslySetInnerHTML={{ __html: item.svgContent }}
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                        {item.iconClass.includes("github") ? (
                          <i className="ri-github-line" />
                        ) : item.iconClass.includes("vue") ? (
                          <i className="ri-vuejs-line" />
                        ) : item.iconClass.includes("react") ? (
                          <i className="ri-reactjs-line" />
                        ) : item.iconClass.includes("eslint") ? (
                          <i className="ri-code-line" />
                        ) : item.iconClass.includes("vscode") ||
                          item.iconClass.includes("code") ? (
                          <i className="ri-code-box-line" />
                        ) : (
                          <i className="ri-folder-open-line" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-auto min-w-0">
                    <div className="font-medium text-[1.05rem] text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200 truncate">
                      {item.title}
                    </div>
                    {item.desc && (
                      <div className="desc text-xs text-zinc-500 dark:text-zinc-400 mt-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200 leading-normal font-normal">
                        {item.desc}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Back button at end of list */}
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
