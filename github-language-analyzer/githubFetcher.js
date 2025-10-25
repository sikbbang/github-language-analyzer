import axios from 'axios';
import 'dotenv/config';

/**
 * Fetches the top 10 most starred GitHub repositories.
 * @returns {Promise<string[]>} A promise that resolves to an array of repository full names (e.g., 'owner/repo').
 */
async function getPopularRepos() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Promise.reject('GitHub token not found in environment variables (GITHUB_TOKEN)');
  }

  const url = 'https://api.github.com/search/repositories';
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      params: {
        q: 'stars:>1',
        sort: 'stars',
        order: 'desc',
        per_page: 10
      }
    });
    return response.data.items.map(item => item.full_name);
  } catch (error) {
    console.error('Error fetching popular repos from GitHub:', error.message);
    throw error;
  }
}

/**
 * Fetches the language byte counts for a specific GitHub repository.
 *
 * @param {string} owner The owner of the repository (e.g., 'facebook').
 * @param {string} repo The name of the repository (e.g., 'react').
 * @returns {Promise<object>} A promise that resolves to an object where keys are language names
 *                           and values are the bytes of code for that language.
 */
async function getRepoLanguages(owner, repo) {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${owner}/${repo}/languages`;

  if (!token) {
    // It's better to throw an error or reject the promise if the token is missing.
    return Promise.reject('GitHub token not found in environment variables (GITHUB_TOKEN)');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28' // Good practice to specify API version
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching languages for ${owner}/${repo}:`, error.message);
    // Depending on the use case, you might want to return null, an empty object, or re-throw the error.
    // Here, we re-throw to let the caller handle it.
    throw error;
  }
}

export { getRepoLanguages, getPopularRepos };

/*
// Example usage:
// Make sure to have a .env file with your GITHUB_TOKEN
// You also need to install axios and dotenv: npm install axios dotenv

import { getRepoLanguages } from './githubFetcher.js';

(async () => {
  try {
    const languages = await getRepoLanguages('google', 'gemini-api-go');
    console.log('Languages:', languages);
  } catch (error) {
    console.error('Failed to fetch repository languages.');
  }
})();
*/