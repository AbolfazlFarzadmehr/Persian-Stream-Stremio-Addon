const sortRanks = [
  'teaser',
  'trailer',
  'dubbed',
  'sub',
  'bluray',
  'webdl',
  'webrip',
  '2160p',
  '1080p',
  '720p',
  '480p',
  'full',
  '10bit',
  'x265',
  'rest',
];

export default function sortStreams(a, b) {
  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();
  let aHas, bHas;
  for (const keyword of sortRanks) {
    aHas = aTitle.includes(keyword);
    bHas = bTitle.includes(keyword);
    if (aHas && !bHas) return -1;
    else if (!aHas && bHas) return 1;
  }
  const aSize = Number.parseFloat(a.size || 0);
  const bSize = Number.parseFloat(b.size || 0);
  return bSize - aSize;
}
