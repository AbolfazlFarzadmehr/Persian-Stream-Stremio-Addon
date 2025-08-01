import fetch from 'node-fetch';
import { nodeEnv } from '../../config.js';
import getSizeOfArrLinks from '../../utils/getFileSize.js';

export default async function getMkvLinks(type, customId) {
  try {
    const res = await fetch(`${this.BASE_URL}/stream/${type}/${customId}.json`);
    const data = await res.json();
    nodeEnv === 'development' && console.log({ data });
    const mkvLinks = await getSizeOfArrLinks(data.streams);
    return mkvLinks;
  } catch (err) {
    console.error(`Failed to get mkvLinks: ${err.message}`);
    return { err };
  }
}
