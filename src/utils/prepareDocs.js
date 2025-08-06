import film2Media from '../providers/film2media/film2media.js';
import createDocForSeries from './createDocForSeries.js';
import getInfo from './getInfo.js';
import setTitle from './setTitle.js';
import sortStreams from './sortStreams.js';

export default async function prepareDocs(
  { name, type, imdbId, episodesYears },
  mkvObjs,
  provider,
) {
  const streamPerId = Object.groupBy(mkvObjs, ({ url }) => {
    const seasonTitleKey = url
      .split('.')
      .find((word) => word.startsWith('S') && word.includes('E'))
      ?.replace('S0', '')
      .replace('E0', ':')
      .replace('S', '')
      .replace('E', ':');
    const trailerTitleKey =
      url.toLowerCase().includes('trailer') ||
      url.toLowerCase().includes('teaser')
        ? 'Trailer'
        : undefined;
    return seasonTitleKey
      ? `${imdbId}:${seasonTitleKey}`
      : trailerTitleKey || 'Unknown';
  });
  Object.keys(episodesYears).forEach((id) => {
    if (!streamPerId[id]) streamPerId[id] = [];
  });
  for (const id of Object.keys(streamPerId)) {
    const [imdbId, season, episode] = id.split(':');
    const _info = {
      name,
      type,
      year: episodesYears[id],
      imdbId,
      season,
      episode,
    };

    const streamWithTitles = setTitle(
      { mkvLinks: streamPerId[id], provider: provider.name },
      _info,
    ).sort(sortStreams);
    streamPerId[id] = await createDocForSeries(
      provider.mongoModel,
      streamWithTitles,
      _info,
    );
  }
  if (streamPerId['Trailer']) {
    for (const id of Object.keys(streamPerId)) {
      if (id === 'Trailer') continue;
      streamPerId[id].streams = [
        ...streamPerId['Trailer'].streams,
        ...streamPerId[id].streams,
      ];
    }
    streamPerId['Trailer'] = undefined;
  }

  return streamPerId;
}
