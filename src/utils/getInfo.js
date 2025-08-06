import { getInfoBaseUrl } from '../config.js';

async function getInfo(id, type) {
  const [imdbId, season, episode] = id.split(':');
  if (season === '0') throw new Error('invalid season number');
  if (episode === '0') throw new Error('invalid episode number');
  const isSeries = type === 'series';
  try {
    const url = `${getInfoBaseUrl}/${type}/${imdbId}.json`;
    const {
      meta: { name, year, videos, country },
    } = await fetch(url).then((res) => res.json());
    const seasonsYear = videos?.length
      ? videos
          .map(({ season, episode, number, released, firstAired }) => ({
            season,
            number,
            episode,
            released: new Date(released)?.getFullYear(),
            firstAired: new Date(firstAired)?.getFullYear(),
          }))
          .filter(({ season }) => season > 0)
      : undefined;
    if (isSeries && !seasonsYear) throw new Error(`SeasonsYear is undefined`);
    else if (isSeries && !seasonsYear.length)
      throw new Error(`SeasonsYear is empty`);
    const episodesYears = {};
    if (isSeries)
      seasonsYear.forEach(
        ({ season, episode, number, releasedYear, firstAired }) => {
          episodesYears[`${imdbId}:${season}:${episode || number}`] =
            releasedYear || firstAired;
        },
      );
    if (isSeries && !Object.keys(episodesYears).length)
      throw new Error(`episodesYears is empty`);
    const releasedYear = isSeries ? episodesYears[id] : undefined;
    return {
      name,
      type,
      year: type === 'movie' ? year : releasedYear,
      imdbId,
      season,
      episode,
      countries: country?.split(', ') || [],
      episodesYears: type === 'movie' ? undefined : episodesYears,
    };
  } catch (err) {
    console.error(`Failed to get info of ${type} ${id}: ${err.message}`);
    return { err, type, imdbId, season, episode };
  }
}

export default getInfo;
