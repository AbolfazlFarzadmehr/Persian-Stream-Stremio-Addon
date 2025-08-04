import fetch from 'node-fetch';
import {
  proxyBaseUrl,
  film2mediaProxyPath,
  proxySecret,
} from '../../config.js';
import getSizeOfArrLinks from '../../utils/getFileSize.js';

export default async function getAllMkvLinks({
  type,
  imdbId,
  season,
  episode,
}) {
  try {
    const info =
      type === 'movie'
        ? `${type}:${imdbId}`
        : `${type}:${imdbId}:${season}:${episode}`;
    const res = await fetch(`${proxyBaseUrl}/${film2mediaProxyPath}/${info}`, {
      headers: {
        'x-proxy-auth': proxySecret,
      },
    });
    const data = await res.json();
    const sizeAdded = await getSizeOfArrLinks(data.mkvLinks);
    return { mkvLinks: sizeAdded, provider: this.name };
  } catch (err) {
    console.error(`Failed to get mkvLinks from proxy server: ${err.message}`);
    return { mkvLinks: [], provider: this.name, err };
  }
}
