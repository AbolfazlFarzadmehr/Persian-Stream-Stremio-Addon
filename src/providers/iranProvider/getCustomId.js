import fetch from 'node-fetch';
import { nodeEnv } from '../../config.js';

export default async function getCustomId(
  { name, type, year, stremioId, imdbId },
  provider,
) {
  const isPeep = provider === 'peepboxtv';
  const url = `${this.BASE_URL}/catalog/${type}/${provider}/search=${isPeep ? encodeURIComponent(name) : imdbId}.json`;
  try {
    if (isPeep && !name) throw new Error('name and year are not defined.');
    const res = await fetch(url);
    nodeEnv === 'development' && console.log(`getting from ${url}`);
    const data = await res.json();
    nodeEnv === 'development' && console.log({ searchResaults: data.metas });
    const providerMovieId = isPeep
      ? data.metas.find((meta) => {
          const peepboxName = meta.name.split('/')[1]?.trim() || meta.name;
          nodeEnv === 'development' &&
            console.log({
              metaName: meta.name,
              peepName: peepboxName,
              myName: `${name}${isPeep ? ` ${year}` : ``}`,
            });
          return peepboxName === name || peepboxName === `${name} ${year}`;
        })?.id
      : data.metas[0]?.id;
    nodeEnv === 'development' && console.log({ costumId: providerMovieId });
    return providerMovieId ? `${providerMovieId}___${stremioId}` : undefined;
  } catch (err) {
    console.error(`Failed to fetch from  ${url}: ${err.message}`);
    return { err };
  }
}
