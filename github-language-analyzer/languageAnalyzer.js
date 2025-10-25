/**
 * Analyzes multiple GitHub repository language data objects to calculate the overall percentage of each language.
 *
 * @param {Array<object>} languageObjects An array of language data objects, where each object is { languageName: byteCount }.
 * @returns {object} An object containing the total bytes and percentage for each language, sorted by percentage.
 *                   Example: { "JavaScript": { "bytes": 300, "percentage": "70.00" }, ... }
 */
function analyzeLanguages(languageObjects) {
  if (!languageObjects || languageObjects.length === 0) {
    return {};
  }

  const totalBytesPerLanguage = {};
  let totalAllBytes = 0;

  // Aggregate bytes for each language from all objects
  for (const langObject of languageObjects) {
    for (const [language, bytes] of Object.entries(langObject)) {
      if (typeof bytes !== 'number') continue; // Skip if bytes is not a number
      totalBytesPerLanguage[language] = (totalBytesPerLanguage[language] || 0) + bytes;
      totalAllBytes += bytes;
    }
  }

  if (totalAllBytes === 0) {
    return {};
  }

  // Calculate percentage for each language
  const languagePercentages = {};
  for (const [language, bytes] of Object.entries(totalBytesPerLanguage)) {
    languagePercentages[language] = {
      bytes: bytes,
      percentage: parseFloat(((bytes / totalAllBytes) * 100).toFixed(2))
    };
  }

  // Sort by percentage in descending order
  const sortedLanguages = Object.entries(languagePercentages)
    .sort(([, a], [, b]) => b.bytes - a.bytes)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  return sortedLanguages;
}

export { analyzeLanguages };

/*
// Example Usage:
const repo1Langs = {
  "JavaScript": 15000,
  "HTML": 5000,
  "CSS": 3000
};

const repo2Langs = {
  "JavaScript": 25000,
  "TypeScript": 10000,
  "CSS": 2000
};

const repo3Langs = {
    "Python": 30000,
    "JavaScript": 5000
};

const allRepoLangs = [repo1Langs, repo2Langs, repo3Langs];
const analysisResult = analyzeLanguages(allRepoLangs);

console.log(JSON.stringify(analysisResult, null, 2));

// Expected output might look like this (percentages are approximate):
// {
//   "JavaScript": {
//     "bytes": 45000,
//     "percentage": 50
//   },
//   "Python": {
//     "bytes": 30000,
//     "percentage": 33.33
//   },
//   "TypeScript": {
//     "bytes": 10000,
//     "percentage": 11.11
//   },
//   "HTML": {
//     "bytes": 5000,
//     "percentage": 5.56
//   },
//   "CSS": {
//     "bytes": 5000,
//     "percentage": 5.56
//   }
// }
*/
