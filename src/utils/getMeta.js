import { getMetaBaseUrl } from '../config.js';

async function getMeta(imdbId, type) {
  try {
    const url = `${getMetaBaseUrl}/${type}/${imdbId}.json`;
    const metadata = await fetch(url).then((res) => res.json());
    return metadata;
  } catch (err) {
    console.error(`Failed to get Meta data: ${err.message}`);
    return { meta: {}, err };
  }
}

export default getMeta;
