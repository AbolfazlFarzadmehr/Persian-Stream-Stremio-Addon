export default async function getStreamsFromAbroad({
  name,
  year,
  type,
  imdbId,
  season,
  episode,
}) {
  const title = this.formatTitleForLinks(name, year, type);
  const mkvLinks = await this.getMkvsFromAbroad({
    titleParam: title,
    type,
    imdbId,
    season,
    episode,
  });
  return mkvLinks;
}
