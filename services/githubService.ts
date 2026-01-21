
export interface RepoInfo {
  stars: number;
  url: string;
  name: string;
}

export const githubService = {
  getRepoInfo: async (owner: string, repo: string): Promise<RepoInfo> => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!response.ok) throw new Error('GitHub API error');
      const data = await response.json();
      return {
        stars: data.stargazers_count,
        url: data.html_url,
        name: data.name
      };
    } catch (error) {
      console.error("Error fetching GitHub info:", error);
      return {
        stars: 0,
        url: `https://github.com/${owner}/${repo}`,
        name: repo
      };
    }
  }
};
