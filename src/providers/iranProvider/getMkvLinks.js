import fetch from 'node-fetch';
import { nodeEnv } from '../../config.js';
import getSizeOfArrLinks from '../../utils/getFileSize.js';

export default async function getMkvLinks(type, customId) {
  try {
    const res = await fetch(`${this.BASE_URL}/stream/${type}/${customId}.json`);
    const data = await res.json();
    nodeEnv === 'development' && console.log({ stremas: data.streams });
    if (!data.streams) throw new Error('data.streams is undefinded');
    const mkvLinks = await getSizeOfArrLinks(
      data.streams.filter((str) => str.url),
    );
    nodeEnv === 'development' &&
      console.log({ mkvLinksInGetMkvLinks: mkvLinks });
    if (mkvLinks.err) throw new Error(sizeAdded.err.message);
    return mkvLinks;
  } catch (err) {
    console.error(
      `Failed to get mkvLinks for ${customId} in iranProvider.getMkvlinks: ${err.message}`,
    );
    return { err };
  }
}
