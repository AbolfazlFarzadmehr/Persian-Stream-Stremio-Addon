import { nodeEnv } from '../config.js';

const day = 24 * 60 * 60 * 60;
const qualityExpire = {
  bluray: undefined,
  webdl: 10 * day,
  webrip: 10 * day,
  hdts: 5 * day,
  hdcam: 5 * day,
};
export default async function createDocForMovie(
  Model,
  streams,
  { imdbId, year, name },
) {
  try {
    let doc = {};
    const currentYear = new Date().getFullYear();
    const releasedYear = year ? +year : currentYear + 1000;
    if (
      !streams.length ||
      (streams.length === 1 &&
        (streams[0].title.toLowerCase().includes('trailer') ||
          streams[0].title.toLowerCase().includes('teaser')))
    ) {
      const expireForEmptyStr =
        releasedYear < currentYear - 1 ? undefined : 5 * day;
      nodeEnv === 'development' &&
        expireForEmptyStr &&
        console.log({
          expireIn: `${expireForEmptyStr / day} days`,
        });
      doc = {
        stremioId: imdbId,
        name,
        streams,
        releasedYear,
        expireAt: expireForEmptyStr
          ? Date.now() + expireForEmptyStr
          : undefined,
      };
      nodeEnv === 'development' && console.log({ docToSave: doc });
      return await Model.create(doc);
    }
    const title1 = streams[0].title.toLowerCase().replace(/[^a-z]/g, '');
    const title2 = streams[1].title.toLowerCase().replace(/[^a-z]/g, '');
    let quality = undefined;
    for (let q of Object.keys(qualityExpire)) {
      if (title1?.includes(q) || title2.includes(q)) {
        quality = q;
        break;
      }
    }
    const expireIn =
      releasedYear < currentYear - 1
        ? undefined
        : quality
          ? qualityExpire[quality]
          : 5 * day;
    nodeEnv === 'development' &&
      expireIn &&
      console.log({
        expireIn: `${expireIn / day} days`,
      });
    doc = {
      stremioId: imdbId,
      name,
      streams,
      quality,
      releasedYear,
      expireAt: expireIn ? Date.now() + expireIn : undefined,
    };
    nodeEnv === 'development' && console.log({ docToSave: doc });
    await Model.create(doc);
  } catch (err) {
    console.error(`Failed to create document in mongoDB: ${err.message}`);
    return { err };
  }
}
