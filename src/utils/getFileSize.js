import fetch from 'node-fetch';
import { nodeEnv } from '../config.js';

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const size = parseInt(res.headers.get('content-length'), 10);
    if (typeof size !== 'number')
      throw new Error('content-length is not a number');
    const sizeInMB = size / (1024 * 1024);
    if (sizeInMB < 1000) return `${Math.round(sizeInMB)} MB`;
    return `${(sizeInMB / 1000).toFixed(2)} GB`;
  } catch (err) {
    console.error(`Faile to measure the size of the link: ${err.message}`);
    return { err };
  }
}

export default async function getSizeOfArrLinks(arrLink) {
  return Promise.all(
    arrLink.map(async (strObj, i, arr) => {
      if (i === arr.length - 1) {
        const urlToLower = strObj.url?.toLowerCase();
        nodeEnv === 'development' && console.log({ urlToLower });
        if (urlToLower?.includes('trailer') || urlToLower?.includes('teaser'))
          return strObj;
      }
      const size = await getFileSize(strObj.url);
      if (!size || size.err) return strObj;
      return {
        ...strObj,
        size,
      };
    }),
  );
}
