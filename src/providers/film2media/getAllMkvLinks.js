import { nodeEnv } from '../../config.js';

export default async function getAllMkvLinks({
  type,
  imdbId,
  season,
  episode,
}) {
  try {
    const pageAddress = await this.getPageAddress(imdbId);
    if (!pageAddress) return { mkvLinks: [], provider: this.name };
    const mkvLinks = await this.getMkvLinks(pageAddress, type, season, episode);
    nodeEnv === 'development' && console.log({ mkvLinks });
    return { mkvLinks, provider: this.name };
  } catch (err) {
    console.error(`Failed to create mkvLinks in film2media: ${err.message}`);
    return { mkvLinks: [], provider: this.name };
  }
}
