import { getMetaBaseUrl } from '../config.js';

async function getMeta(imdbId, type) {
  try {
    const url = `${getMetaBaseUrl}/${type}/${imdbId}.json`;
    const meta = await fetch(url).then((res) => res.json());
    return meta;
  } catch (err) {
    console.error(`Failed to get Meta data: ${err.message}`);
    return {};
  }
}

export default getMeta;
