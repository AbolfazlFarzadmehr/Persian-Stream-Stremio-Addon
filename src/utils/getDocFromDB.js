import setGeoProvider from './setGeoProviders.js';
import providers from '../providers/groupByTypeProviders.js';

const [publicProviders] = providers;

async function findDoc(provider, stremioId) {
  return {
    provider,
    doc: await provider.mongoModel.findOne({ stremioId }),
  };
}

export default async function getDocFromDB(reqFromIran, stremioId) {
  const geoProviders = setGeoProvider(reqFromIran);
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
  return groupedByResault;
}
