import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function getMkvsFromAbroad({ titleParam, type, imdbId }) {
  try {
    const res = await fetch(`${this.BASE_URL}/${titleParam}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const links = [];
    $('.download_box .--notif a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href === '../' || href === '/') return;
      if (href.toLowerCase().endsWith('.mkv')) links.push(href);
      else if (
        href.endsWith('/') &&
        type === 'series' &&
        !href.toString().includes('donyayeserial')
      )
        links.push(href);
    });
    // if (type === 'movie') return links;
    // links.forEach(async (link) => {
    //   const res = await fetch(link, { method: 'HEAD' });
    // });
    return links;
  } catch (err) {
    console.error(
      `Failed to fetch mkvs from ${this.BASE_URL}/${titleParam}: ${err.message}`,
    );
  }
}
