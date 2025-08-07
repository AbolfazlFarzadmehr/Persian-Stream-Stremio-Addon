import fetch from 'node-fetch';
import {
  proxyBaseUrl,
  film2mediaProxyPath,
  proxySecret,
  nodeEnv,
} from '../../config.js';
import getSizeOfArrLinks from '../../utils/getFileSize.js';
import prepareDocs from '../../utils/prepareDocs.js';
import insertAllDocs from '../../utils/insertAllDocs.js';

export default async function getAllMkvLinks(info) {
  try {
    const { type, imdbId, season, episode } = info;
    const res = await fetch(
      `${proxyBaseUrl}/${film2mediaProxyPath}/${imdbId}`,
      {
        headers: {
          'x-proxy-auth': proxySecret,
        },
      },
    );
    const data = await res.json();
    nodeEnv === 'development' && console.log({ data });
    if (data.err) throw new Error(data.err?.message || 'request failed');
    const sizeAdded = await getSizeOfArrLinks(data.mkvLinks);
    if (sizeAdded.err) throw new Error(sizeAdded.err.message);
    if (type === 'movie') return { mkvLinks: sizeAdded, provider: this.name };
    const docPerId = await prepareDocs(info, sizeAdded, this);
    nodeEnv === 'development' && console.log({ docPerId });
    await insertAllDocs(docPerId, this.mongoModel);
    return {
      readyToReturn: true,
      streams: docPerId[`${imdbId}:${season}:${episode}`].streams,
      provider: this.name,
    };
  } catch (err) {
    console.error(`Failed to get mkvLinks from proxy server: ${err.message}`);
    return { mkvLinks: [], provider: this.name, err };
  }
}
