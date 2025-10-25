import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { getRepoLanguages } from './githubFetcher.js';
import { analyzeLanguages } from './languageAnalyzer.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * API endpoint to fetch a list of popular GitHub repositories.
 * Fetches the top 100 repositories sorted by stars.
 */
app.get('/api/popular-repos', async (req, res) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not found in environment variables (GITHUB_TOKEN).' });
  }

  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      params: {
        q: 'stars:>1000', // A reasonable threshold for "popular"
        sort: 'stars',
        order: 'desc',
        per_page: 100
      }
    });

    const popularRepos = response.data.items.map(item => item.full_name);
    res.json(popularRepos);

  } catch (error) {
    console.error('Error fetching popular repositories:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch popular repositories.' });
  }
});

/**
 * API endpoint to compare language usage across multiple GitHub repositories.
 * Expects a 'repos' query parameter with comma-separated "owner/repo" strings.
 * Example: /api/compare?repos=facebook/react,vuejs/vue,angular/angular
 */
app.get('/api/compare', async (req, res) => {
  const reposParam = req.query.repos;
  if (!reposParam) {
    return res.status(400).json({ error: 'Missing "repos" query parameter. Please provide a comma-separated list of repositories (e.g., owner/repo,owner2/repo2).' });
  }

  const repoStrings = reposParam.split(',');
  const repoPromises = repoStrings.map(repoString => {
    const [owner, repo] = repoString.split('/');
    if (!owner || !repo) {
      // Silently ignore invalid entries, or you could return an error.
      return Promise.resolve(null);
    }
    return getRepoLanguages(owner.trim(), repo.trim());
  });

  try {
    // Use Promise.allSettled to handle individual fetch failures gracefully
    const results = await Promise.allSettled(repoPromises);
    
    const languageDataArray = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    if (languageDataArray.length === 0) {
      return res.status(400).json({ error: 'No valid repositories could be fetched or analyzed.' });
    }

    const analysisResult = analyzeLanguages(languageDataArray);
    res.json(analysisResult);
  } catch (error) {
    console.error('An unexpected error occurred on the server:', error);
    res.status(500).json({ error: 'Failed to fetch or analyze repository data. Check server logs for details.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
