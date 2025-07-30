import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import getSizeOfArrLinks from '../../utils/getFileSize.js';

export default async function getMkvLinks(pageAddress, type, season, episode) {
  try {
    const res = await fetch(pageAddress);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const mkvLinks = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href?.endsWith('mkv') || href?.endsWith('mp4')) {
        if (type === 'movie') mkvLinks.push({ url: href });
        else if (
          href.includes(`S${season?.padStart(2, 0)}E${episode?.padStart(2, 0)}`)
        )
          mkvLinks.push({ url: href });
      }
    });
    const trailer = $('video').first().attr('src');
    const sizeAdded = await getSizeOfArrLinks(mkvLinks);
    trailer && sizeAdded.push({ url: trailer });
    return sizeAdded;
  } catch (err) {
    console.error(
      `Failed to get links from Page address in film2media: ${err.message}`,
    );
    return {};
  }
}
