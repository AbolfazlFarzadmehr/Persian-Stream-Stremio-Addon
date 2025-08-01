import fetch from 'node-fetch';

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) throw new Error('Failed to fetch header');
    const size = parseInt(res.headers.get('content-length'));
    if (typeof size !== 'number') return undefined;
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
    arrLink.map(async (strObj) => {
      const size = await getFileSize(strObj.url);
      if (!size || size?.err) return strObj;
      return {
        ...strObj,
        size,
      };
    }),
  );
}
