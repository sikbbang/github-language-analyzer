import fs from 'fs';
import express from 'express';

const logStream = fs.createWriteStream('./server.log', {flags: 'a'});
console.log = function(message) {
  logStream.write(message + '\n');
  process.stdout.write(message + '\n');
};
console.error = function(message) {
  logStream.write(message + '\n');
  process.stderr.write(message + '\n');
};
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
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Database setup
let db;
(async () => {
    try {
        console.log('Initializing database...');
        db = await open({
            filename: './popular_repos.db',
            driver: sqlite3.Database
        });
        console.log('Database initialized.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS popular_repos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL UNIQUE,
                fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS last_fetch (
                id INTEGER PRIMARY KEY,
                fetched_at DATETIME NOT NULL
            );
        `);
        console.log('Tables created/ensured.');

        const count = await db.get('SELECT COUNT(*) as count FROM last_fetch');
        if (count.count === 0) {
            await db.run('INSERT INTO last_fetch (id, fetched_at) VALUES (1, ?)', new Date(0).toISOString());
            console.log('Initialized last_fetch table.');
        }

        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize database or start server:', error);
        process.exit(1);
    }
})();

/**
 * API endpoint to fetch a list of popular GitHub repositories.
 * Fetches the top 100 repositories sorted by stars, with caching.
 */
app.get('/api/popular-repos', async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'GitHub token not found in environment variables (GITHUB_TOKEN).' });
    }

    try {
        const lastFetch = await db.get('SELECT fetched_at FROM last_fetch WHERE id = 1');
        const cacheAge = Date.now() - new Date(lastFetch.fetched_at).getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (cacheAge < oneDay) {
            const repos = await db.all('SELECT full_name FROM popular_repos ORDER BY id');
            if (repos.length > 0) {
                console.log('Serving popular repos from cache.');
                return res.json(repos.map(r => r.full_name));
            }
        }

        console.log('Fetching popular repos from GitHub API.');
        const response = await axios.get('https://api.github.com/search/repositories', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            params: {
                q: 'stars:>1000',
                sort: 'stars',
                order: 'desc',
                per_page: 100
            }
        });

        const popularRepos = response.data.items.map(item => item.full_name);

        await db.exec('DELETE FROM popular_repos');
        const stmt = await db.prepare('INSERT INTO popular_repos (full_name) VALUES (?)');
        for (const repo of popularRepos) {
            await stmt.run(repo);
        }
        await stmt.finalize();

        await db.run('UPDATE last_fetch SET fetched_at = ? WHERE id = 1', new Date().toISOString());

        res.json(popularRepos);

    } catch (error) {
        console.error('Error in /api/popular-repos:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch or process popular repositories.' });
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
