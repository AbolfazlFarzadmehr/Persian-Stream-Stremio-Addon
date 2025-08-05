import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { donyayeSerialProxyPath } from '../../config.js';

// export default async function getMkvsFromAbroad(info) {
//   try {
//     const { type, imdbId, season, episode } = info;
//     const res = await fetch(
//       `${proxyBaseUrl}/${donyayeSerialProxyPath}/${imdbId}`,
//       {
//         headers: {
//           'x-proxy-auth': proxySecret,
//         },
//       },
//     );
//     const data = await res.json();
//     nodeEnv === 'development' && console.log({ data });
//     if (data.err) throw new Error(data.err?.message || 'request failed');
//     if (type === 'movie') return mkvLinks;
//     const mkvLinksUnflat = await Promise.all(
//       condidatePaths.map((path) => this.mkvFinder(path, type)),
//     );
//     const docPerId = await prepareDocs(info, mkvLinks, this);
//     nodeEnv === 'development' && console.log({ docPerId });
//     await insertAllDocs(docPerId, this.mongoModel);
//     return {
//       readyToReturn: true,
//       streams: docPerId[`${imdbId}:${season}:${episode}`].streams,
//       provider: this.name,
//     };
//   } catch (err) {
//     console.error(`Failed to get mkvLinks from proxy server: ${err.message}`);
//     return { mkvLinks: [], provider: this.name, err };
//   }
// }

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
    if (type === 'movie') return links;
    // links.forEach(async (link) => {
    //   const res = await fetch(link, { method: 'HEAD' });
    // });
    return [];
  } catch (err) {
    console.error(
      `Failed to fetch mkvs from ${this.BASE_URL}/${titleParam}: ${err.message}`,
    );
    return { err };
  }
}
