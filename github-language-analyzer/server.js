import express from 'express';
import cors from 'cors';
import { getRepoLanguages } from './githubFetcher.js';
import { analyzeLanguages } from './languageAnalyzer.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
