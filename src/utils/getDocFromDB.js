import setGeoProvider from './setGeoProviders.js';
import providers from '../providers/groupByTypeProviders.js';
import { nodeEnv } from '../config.js';

const day = 24 * 60 * 60 * 1000;
const [publicProviders] = providers;

async function findDoc(provider, stremioId) {
  return {
    provider,
    doc: await provider.mongoModel.findOne({ stremioId }),
  };
}

export default async function getDocFromDB(reqFromIran, stremioId) {
  try {
    const geoProviders = setGeoProvider(reqFromIran);
    const currentYear = new Date().getFullYear();
    const resault = await Promise.all(
      [
        geoProviders.map((p) => findDoc(p, stremioId)),
        publicProviders.map((p) => findDoc(p, stremioId)),
      ]
        .filter((promise) => promise)
        .flat(),
    );
    const groupedByResault = Object.groupBy(resault, ({ doc }) =>
      doc ? 'complite' : 'scrape',
    );
    if (groupedByResault.complite)
      for (const { doc, provider } of groupedByResault.complite) {
        if (
          !doc.streams.length &&
          (doc?.releasedYear !== currentYear - 1 ||
            doc?.releasedYear !== currentYear)
        )
          if (!stremioId.includes(':') || provider.name === 'Iran-provider') {
            await provider.mongoModel.updateOne(
              { _id: doc._id },
              { $set: { expireAt: new Date(Date.now() + 5 * day) } },
            );
            nodeEnv === 'development' &&
              console.log(
                `✅ add 5 days succesfully to ${doc.name} in ${provider.name} collection.`,
              );
          } else if (doc.emptySeason) {
            const id =
              provider.name === 'film2media'
                ? stremioId
                : doc.stremioId.replace(/:[^:]*$/, '');
            await provider.mongoModel.updateMany(
              {
                stremioId: {
                  $regex: new RegExp(`^${id}`),
                },
              },
              { $set: { expireAt: new Date(Date.now() + 5 * day) } },
            );
            nodeEnv === 'development' &&
              console.log(
                `✅ add 5 days succesfully to all of the docs with name of ${doc.name} in ${provider.name} collection.`,
              );
          }
      }

    return groupedByResault;
  } catch (err) {
    console.error(`Unexpected Error at getDocFromDB: ${err.message}`);
    return { err };
  }
}
