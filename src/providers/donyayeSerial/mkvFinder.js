import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function mkvFinder(url, type, season, episode, results = []) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const tasks = [];

    $('tbody a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href === '../' || href === '/') return;

      const fullUrl = new URL(href, url).href;

      if (href.endsWith('/')) {
        // Recurse into subdirectory
        tasks.push(mkvFinder(fullUrl, type, season, episode, results));
      } else if (href.toLowerCase().endsWith('.mkv')) {
        let shouldInclude = false;

        if (type === 'movie') {
          shouldInclude = true;
        } else if (
          href
            .toLowerCase()
            .includes(`s${season.padStart(2, '0')}e${episode.padStart(2, '0')}`)
        ) {
          shouldInclude = true;
        }

        if (shouldInclude) {
          const $tr = $(el).closest('tr'); // Go up to <tr>
          let size = $tr.find('td.s code').text().trim(); // Extract size from sibling td.s
          if (size.endsWith('M'))
            size = `${Math.round(Number.parseFloat(size))}M`;

          results.push({
            url: fullUrl,
            size: size || 'unknown',
          });
        }
      }
    });

    await Promise.all(tasks);
    return results;
  } catch (err) {
    console.error(`Failed to crawl ${url}: ${err.message}`);
    return [];
  }
}

export default mkvFinder;
