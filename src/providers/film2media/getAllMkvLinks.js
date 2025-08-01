export default async function getAllMkvLinks({
  type,
  imdbId,
  season,
  episode,
}) {
  try {
    const pageAddress = await this.getPageAddress(imdbId);
    if (pageAddress?.err) throw new Error(pageAddress.err.message);
    const mkvLinks = await this.getMkvLinks(pageAddress, type, season, episode);
    return { mkvLinks, provider: this.name };
  } catch (err) {
    console.error(`Failed to create mkvLinks in film2media: ${err.message}`);
    return { mkvLinks: [], provider: this.name, err };
  }
}
