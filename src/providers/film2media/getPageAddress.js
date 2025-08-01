import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { nodeEnv } from '../../config.js';

export default async function getPageAddress(imdbId) {
  const url = `${this.BASE_URL}${imdbId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const pageAddress = $('a').first().attr('href');
    return pageAddress;
  } catch (err) {
    console.error(`Failed to get page address from ${url}: ${err.message}`);
    return { err };
  }
}
