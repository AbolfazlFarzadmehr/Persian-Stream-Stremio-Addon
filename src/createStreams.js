import setTitle from './utils/setTitle.js';
import getMeta from './utils/getMeta.js';
import { nodeEnv } from './config.js';
import providers from './providers/groupByTypeProviders.js';
import createDocForMovie from './utils/createDocForMovie.js';
import sortStreams from './utils/sortStreams.js';
import getDocFromDB from './utils/getDocFromDB.js';

const [publicProviders, iranAccessProviders, iranBlockProviders] = providers;

export default async function createStreams(
  type,
  id,
  reqFromIran = false,
  appRunInIran = true,
) {
  try {
    //checking database
    const groupedByResault = await getDocFromDB(reqFromIran, id);
    let streams =
      groupedByResault.complite?.flatMap(({ doc }) => doc.streams) || [];
    nodeEnv === 'development' && console.log(groupedByResault);
    if (!groupedByResault.scrape) return streams.sort(sortStreams);

    //creating streams
    const [imdbId, season, episode] = id.split(':');
    const {
      meta: { name, year },
    } = await getMeta(imdbId, type);
    const info = {
      name,
      type,
      year,
      imdbId,
      season,
      episode,
    };
    nodeEnv === 'development' && console.log(info);

    let scrapeResault = [];
    for (const { provider } of groupedByResault.scrape) {
      nodeEnv === 'development' &&
        console.log(`getting streams from ${provider.name}...`);
      const mkvProviderLinks = await provider.getAllMkvLinks(info);
      nodeEnv === 'development' && console.log({ mkvProviderLinks });
      if (mkvProviderLinks.err) continue;
      scrapeResault = setTitle(mkvProviderLinks, info);
      nodeEnv === 'development' && console.log({ scrapeResault });
      if (!iranBlockProviders.includes(provider)) {
        const strObj1 = scrapeResault[0];
        const strObj2 = scrapeResault[1];
        nodeEnv === 'development' && console.log({ strObj1, strObj2 });
        if ((strObj2 && !strObj2.size) || (strObj1 && !strObj1.size)) continue;
      }
      if (type === 'movie')
        createDocForMovie(provider.mongoModel, scrapeResault, info);
      if (scrapeResault.length) break;
    }
    streams = [...streams, ...scrapeResault];
    nodeEnv === 'development' && console.log({ finalStreams: streams });
    return streams.sort(sortStreams);
  } catch (err) {
    return { err };
  }
}
