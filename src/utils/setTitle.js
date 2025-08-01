import { nodeEnv } from '../config.js';
import formatTitleForFilename from './formatTitleForFilename.js';

export default function setTitle(
  mkvProviderLinks,
  { name, year, season, episode },
) {
  nodeEnv === 'development' &&
    console.log({
      exampleLinkInSetTitle: mkvProviderLinks.mkvLinks[0],
      provider: mkvProviderLinks.provider,
    });
  const formattedTitle = name ? formatTitleForFilename(name) : '%$!';
  const sortKeywords = ['sub', 'dubbed'];
  const omitKeywords = [
    '.mkv',
    '.mp4',
    '.DonyayeSerial',
    '.Film2Media',
    formattedTitle,
    `.S${season?.padStart(2, 0)}E${episode?.padStart(2, 0)}`,
    `.${year || '%$!'}`,
    '.',
  ];
  let isTrailer = false;
  return mkvProviderLinks.mkvLinks.map((mkv) => {
    if (mkv.url.toLowerCase().includes('trailer')) isTrailer = 'Trailer';
    else if (mkv.url.toLowerCase().includes('teaser')) isTrailer = 'Teaser';
    if (isTrailer)
      return {
        title: `🎞️ ${isTrailer}`,
        url: mkv.url,
      };
    const words = mkv.url.split('?')[0].split('/');
    let validTitle = words
      .at(-1)
      .replace('Farsi.Sub', 'FarsiSub')
      .replace('Farsi.Dubbed', 'FarsiDubbed');
    omitKeywords.forEach(
      (keyword) => (validTitle = validTitle.replace(keyword, '')),
    );
    const title = validTitle
      .split('.')
      .sort((a, b) => {
        if (
          a.toLowerCase().trim().endsWith(sortKeywords[0]) ||
          a.toLowerCase().trim().endsWith(sortKeywords[1])
        )
          return -1;
        else if (
          b.toLowerCase().trim().endsWith(sortKeywords[0]) ||
          b.toLowerCase().trim().endsWith(sortKeywords[1])
        )
          return 1;
      })
      .map((info, i) => {
        const infoLower = info.toLowerCase();
        return !i && infoLower.includes('dubbed') ? `🔊 ${info}` : info;
      })
      .join('  ')
      .replace('  ', '  -  ')
      .replaceAll('%20', ' ')
      .concat(mkv.size ? ` - ${mkv.size}` : '')
      .concat(`  (${mkvProviderLinks.provider})`);
    return {
      title,
      url: mkv.url,
    };
  });
}
