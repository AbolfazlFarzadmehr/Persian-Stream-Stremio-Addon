import { nodeEnv } from '../../config.js';

export default async function getAllMkvLinks({
  name,
  type,
  year,
  imdbId,
  season,
  episode,
}) {
  try {
    const stremioId =
      type === 'series' ? `${imdbId}:${season}:${episode}` : imdbId;
    const info = { name, type, year, stremioId, imdbId };
    let mkvLinks = [];
    let costumId = await this.getCustomId(info, 'avamovie');
    costumId && (mkvLinks = await this.getMkvLinks(type, costumId));
    const isDubbed = mkvLinks.some((link) =>
      link.url.toLowerCase().includes('dubbed'),
    );
    if (!isDubbed) {
      costumId = await this.getCustomId(info, 'peepboxtv');
      costumId &&
        (mkvLinks = [...mkvLinks, ...(await this.getMkvLinks(type, costumId))]);
    }
    // const costumIds = [
    //   await this.getCustomId(info, 'avamovie'),
    //   await this.getCustomId(info, 'peepboxtv'),
    // ].filter((id) => id);
    // console.log({ costumIds });
    // const streamsArrays = await Promise.all(
    //   costumIds.map((id) => this.getMkvLinks(type, id)),
    // );
    // const mkvLinks = streamsArrays.flat();
    return { mkvLinks, provider: this.name };
  } catch (err) {
    console.error(`Failed to create mkvLinks in iranProvider: ${err.message}`);
    return { mkvLinks: [], provider: this.name };
  }
}
