
export async function fetchGithubData(username: string): Promise<string> {
  if (!username) return "No GitHub provided.";
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    if (response.ok) {
      const repos = await response.json();
      if (repos.length === 0) return "No public repositories found.";
      return repos.map((r: any) => (
        `${r.name} (${r.language || 'Unknown'}) - Stars: ${r.stargazers_count}, Forks: ${r.forks_count}: ${r.description || 'No description'}`
      )).join('\n');
    }
    return "GitHub user not found.";
  } catch (error) {
    return "Connection error while fetching GitHub data.";
  }
}
