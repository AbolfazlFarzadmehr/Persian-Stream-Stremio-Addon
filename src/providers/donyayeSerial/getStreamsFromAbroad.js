export default async function getStreamsFromAbroad({
  name,
  year,
  type,
  imdbId,
  season,
  episode,
}) {
  try {
    if (!name) throw new Error('name and year are not defined');
    const title = this.formatTitleForLinks(name, year, type);
    const mkvLinks = await this.getMkvsFromAbroad({
      titleParam: title,
      type,
      imdbId,
      season,
      episode,
    });
    if (mkvLinks.err) throw new Error(mkvLinks.err.message);
    return mkvLinks;
  } catch (err) {
    console.error(err.message);
    return { err };
  }
}
