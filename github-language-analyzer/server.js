import express from 'express';
import cors from 'cors';
import { getRepoLanguages, getPopularRepos } from './githubFetcher.js';
import { analyzeLanguages } from './languageAnalyzer.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup and initial seeding
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
        `);
        console.log("Table 'popular_repos' created/ensured.");

        // Check if the database is empty and seed it if necessary
        const repoCount = await db.get('SELECT COUNT(*) as count FROM popular_repos');
        if (repoCount.count === 0) {
            console.log('No popular repos found in DB, seeding now...');
            const popularRepos = await getPopularRepos();
            const stmt = await db.prepare('INSERT INTO popular_repos (full_name) VALUES (?)');
            for (const repo of popularRepos) {
                await stmt.run(repo);
            }
            await stmt.finalize();
            console.log('Database seeded with popular repositories.');
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
 * API endpoint to fetch the list of all cached GitHub repositories.
 */
app.get('/api/popular-repos', async (req, res) => {
    try {
        const repos = await db.all('SELECT full_name FROM popular_repos ORDER BY id');
        console.log('Serving all cached repos from database.');
        res.json(repos.map(r => r.full_name));
    } catch (error) {
        console.error('Error in /api/popular-repos:', error.message);
        res.status(500).json({ error: 'Failed to fetch repositories from database.' });
    }
});

/**
 * API endpoint to compare language usage across multiple GitHub repositories.
 */
app.get('/api/compare', async (req, res) => {
  const reposParam = req.query.repos;
  if (!reposParam) {
    return res.status(400).json({ error: 'Missing "repos" query parameter.' });
  }

  const repoStrings = reposParam.split(',');
  const repoPromises = repoStrings.map(repoString => {
    const [owner, repo] = repoString.split('/');
    if (!owner || !repo) {
      return Promise.resolve(null);
    }
    return getRepoLanguages(owner.trim(), repo.trim());
  });

  try {
    const results = await Promise.allSettled(repoPromises);
    const languageDataArray = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    if (languageDataArray.length === 0) {
      return res.status(400).json({ error: 'No valid repositories could be fetched.' });
    }

    const analysisResult = analyzeLanguages(languageDataArray);
    res.json(analysisResult);
  } catch (error) {
    console.error('Server error in /api/compare:', error);
    res.status(500).json({ error: 'Failed to fetch or analyze repository data.' });
  }
});


