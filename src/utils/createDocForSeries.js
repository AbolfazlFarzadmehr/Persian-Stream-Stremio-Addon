import { nodeEnv } from '../config.js';
import iranProvider from '../providers/iranProvider/iranProvider.js';

const day = 24 * 60 * 60 * 1000;
const qualityExpire = {
  bluray: undefined,
  webdl: 365 * day,
  webrip: 10 * day,
  hdts: 5 * day,
};

export default async function createDocForSeries(
  Model,
  streams,
  { imdbId, name, year, episode, season },
) {
  try {
    const detemineReturn = async (doc) =>
      Model === iranProvider.mongoModel ? await Model.create(doc) : doc;
    let doc = {};
    const stremioId = `${imdbId}:${season}:${episode}`;
    const currentYear = new Date().getFullYear();
    const releasedYear = year ? +year : currentYear + 1000;
    if (
      !streams.length ||
      (streams.length === 1 &&
        (streams[0].title.toLowerCase().includes('trailer') ||
          streams[0].title.toLowerCase().includes('teaser')))
    ) {
      const expireForEmptyStr =
        Model === iranProvider.mongoModel
          ? 5 * day
          : releasedYear < currentYear - 1
            ? undefined
            : 5 * day;
      nodeEnv === 'development' &&
        expireForEmptyStr &&
        console.log({
          expireIn: `${expireForEmptyStr / day} days`,
        });
      doc = {
        stremioId,
        name,
        streams,
        releasedYear,
        expireAt: expireForEmptyStr
          ? new Date(Date.now() + expireForEmptyStr)
          : undefined,
      };
      nodeEnv === 'development' && console.log({ docToSave: doc });
      return detemineReturn(doc);
    }
    const title1 = streams[0]?.title.toLowerCase().replace(/[^a-z]/g, '') || '';
    const title2 = streams[1]?.title.toLowerCase().replace(/[^a-z]/g, '') || '';
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
      stremioId,
      name,
      streams,
      quality,
      releasedYear,
      expireAt: expireIn ? new Date(Date.now() + expireIn) : undefined,
    };
    nodeEnv === 'development' && console.log({ docToSave: doc });
    return detemineReturn(doc);
  } catch (err) {
    console.error(
      `Failed to create series document in mongoDB: ${err.message}`,
    );
    return { err };
  }
}
