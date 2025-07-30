import fetch from 'node-fetch';
import { nodeEnv } from '../../config.js';

export default async function getMkvLinks(type, customId) {
  try {
    const res = await fetch(`${this.BASE_URL}/stream/${type}/${customId}.json`);
    const data = await res.json();
    nodeEnv === 'development' && console.log({ data });
    return data.streams;
  } catch (err) {
    console.error(`Failed to get mkvLinks: ${err.message}`);
    return [];
  }
}
