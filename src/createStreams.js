import iranProvider from './providers/iranProvider/iranProvider.js';
import setTitle from './utils/setTitle.js';
import getMeta from './utils/getMeta.js';
import sortStreams from './utils/sortStreams.js';
import film2media from './providers/film2media/film2media.js';
import { nodeEnv } from './config.js';

export default async function createStreams(
  type,
  id,
  reqFromIran = false,
  appRunInIran = true,
) {
  const [imdbId, season, episode] = id.split(':');
  const {
    meta: { name, year },
  } = (await getMeta(imdbId, type)) || { meta: {} };
  const info = {
    name,
    type,
    year,
    imdbId,
    season,
    episode,
  };
  let mkvLinks = [];
  if (nodeEnv === 'development') {
    console.log(info);
    mkvLinks = await film2media.getAllMkvLinks(info);
  } else {
    mkvLinks = await (reqFromIran
      ? film2media.getAllMkvLinks(info)
      : iranProvider.getAllMkvLinks(info));
  }

  const streams = setTitle(mkvLinks, info).sort(sortStreams);
  return streams;
}
