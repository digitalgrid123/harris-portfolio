/**
 * Fetch recent releases from a GitHub repository
 * Filters to releases from the last 4 months
 */
export async function getRecentReleases(githubUrl: string) {
  if (!githubUrl) return null;

  try {
    // Extract owner and repo from GitHub URL
    // Supports formats like:
    // - https://github.com/username/repo
    // - https://github.com/username/repo/
    // - https://github.com/username (profile URL - will try to find repo)
    // - git@github.com:username/repo.git
    const match = githubUrl.match(
      /github\.com[:/]([^/]+)(?:\/([^/]+?))?(?:\.git)?$/
    );

    if (!match) {
      console.error("Invalid GitHub URL format:", githubUrl);
      return null;
    }

    const owner = match[1];
    let repo = match[2];

    // If no repo provided (profile URL), return null as we can't fetch releases
    if (!repo) {
      console.warn(`GitHub URL is a profile, not a repository: ${githubUrl}`);
      return null;
    }

    // Fetch releases from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add authorization if GITHUB_TOKEN is available (increases rate limit)
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: {
          // Cache for 1 hour
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch releases for ${owner}/${repo}:`,
        response.statusText
      );
      return null;
    }

    const releases = await response.json();

    // Filter to releases from the last 4 months
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const recentReleases = releases
      .filter((release: any) => {
        // Skip pre-releases and drafts
        if (release.prerelease || release.draft) {
          return false;
        }

        const releaseDate = new Date(release.published_at);
        return releaseDate >= fourMonthsAgo;
      })
      .slice(0, 1); // Get only the latest one

    if (recentReleases.length === 0) {
      return null;
    }

    return {
      url: recentReleases[0].html_url,
      version: recentReleases[0].tag_name,
      date: new Date(recentReleases[0].published_at),
    };
  } catch (error) {
    console.error("Error fetching GitHub releases:", error);
    return null;
  }
}
