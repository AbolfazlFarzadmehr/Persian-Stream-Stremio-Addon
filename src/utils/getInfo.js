import { getInfoBaseUrl } from '../config.js';

async function getInfo(id, type) {
  const [imdbId, season, episode] = id.split(':');
  const isSeries = type === 'series';
  try {
    const url = `${getInfoBaseUrl}/${type}/${imdbId}.json`;
    const {
      meta: { name, year, videos },
    } = await fetch(url).then((res) => res.json());

    const seasonsYear = videos.length
      ? Object.groupBy(
          videos
            .map(({ season, episode, released, firstAired }) => ({
              season,
              episode,
              released: new Date(released).getFullYear(),
              firstAired: new Date(firstAired).getFullYear(),
            }))
            .filter(({ released, season }) => released && season > 0),
          ({ season }) => season,
        )
      : undefined;

    if (isSeries && !seasonsYear) throw new Error(`SeasonsYear is undefined`);
    const episodeYearObj = isSeries
      ? seasonsYear[season][episode - 1] || seasonsYear[season][1]
      : undefined;
    if (isSeries && !episodeYearObj)
      throw new Error(`episodeYearObj is undefined`);
    const releasedYear = isSeries
      ? episodeYearObj.released || episodeYearObj.firstAired
      : undefined;
    return {
      name,
      type,
      year: type === 'movie' ? year : releasedYear,
      imdbId,
      season,
      episode,
    };
  } catch (err) {
    console.error(`Failed to get ${type} info: ${err.message}`);
    return { meta: {}, err };
  }
}

export default getInfo;
