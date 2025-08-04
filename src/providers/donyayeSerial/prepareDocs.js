import createDocForSeries from '../../utils/createDocForSeries.js';
import setTitle from '../../utils/setTitle.js';
import sortStreams from '../../utils/sortStreams.js';

export default async function prepareDocs(
  { name, type, year, imdbId, season },
  mkvObjs,
) {
  const streamPerId = Object.groupBy(
    mkvObjs,
    ({ url }) =>
      `${imdbId}:${url
        .split('.')
        .find((word) => word.startsWith('S') && word.includes('E'))
        .replace('S0', '')
        .replace('E0', ':')
        .replace('S', '')
        .replace('E', ':')}` || 'Unknown',
  );
  for (const id of Object.keys(streamPerId)) {
    const [_imdbId, _season, _episode] = id.split(':');
    const _info = {
      name,
      type,
      year,
      imdbId,
      season: _season,
      episode: _episode,
    };
    const streamWithTitles = setTitle(
      { mkvLinks: streamPerId[id], provider: this.name },
      _info,
    ).sort(sortStreams);
    streamPerId[id] = await createDocForSeries(
      this.mongoModel,
      streamWithTitles,
      _info,
    );
  }
  return streamPerId;
}
