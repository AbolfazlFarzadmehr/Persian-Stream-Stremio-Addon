import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { mirrors, domain } from '../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, `../../data/firstLevelDirectories.json`);

async function getFirstLevelDirs(baseUrl, mirrorName, directories) {
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const dirs = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.endsWith('/') && href !== '../' && href !== '/') {
        const dirName = href.replace(/\/$/, '');
        dirs.push(dirName);
      }
    });
    // eslint-disable-next-line no-param-reassign
    directories[mirrorName] = { movie: [], series: [] };
    dirs.forEach((dirName) => {
      if (dirName.startsWith('movie'))
        directories[mirrorName].movie.push(dirName);
      else if (dirName.startsWith('series'))
        directories[mirrorName].series.push(dirName);
    });
  } catch (err) {
    console.error(
      `Failed to fetch directory list from ${mirrorName} mirror:`,
      err.message,
    );
  }
}

async function getAllDirs() {
  // Step 1: Load existing data (or create default if file doesn't exist)
  let directories = {};
  try {
    const fileData = await readFile(jsonPath, 'utf-8');
    directories = JSON.parse(fileData);
  } catch (err) {
    console.warn(
      'No existing JSON found or invalid format, creating new structure...',
    );
    directories = Object.fromEntries(
      mirrors.map((m) => [m, { movie: [], series: [] }]),
    );
  }

  // Step 2: Update the data
  await Promise.all(
    mirrors.map((mirror) =>
      getFirstLevelDirs(`https://${mirror}.${domain}`, mirror, directories),
    ),
  );
  directories.updatedAt = new Date().toISOString();
  // Step 3: Write updated data back to the JSON file
  try {
    await writeFile(jsonPath, JSON.stringify(directories, null, 2), 'utf-8');
    console.log('Updated directory structure saved to JSON.');
  } catch (err) {
    console.error('Failed to write updated data to JSON:', err.message);
  }
}

// Run every 5 days at midnight (00:00)
cron.schedule('0 0 */5 * *', () => {
  console.log('Running getAllDirs() - Scheduled every 5 days');
  getAllDirs();
});
