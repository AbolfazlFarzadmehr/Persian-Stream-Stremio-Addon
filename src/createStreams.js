import setTitle from './utils/setTitle.js';
import getInfo from './utils/getInfo.js';
import { nodeEnv } from './config.js';
import providers from './providers/groupByTypeProviders.js';
import createDocForMovie from './utils/createDocForMovie.js';
import sortStreams from './utils/sortStreams.js';
import getDocFromDB from './utils/getDocFromDB.js';
import iranProvider from './providers/iranProvider/iranProvider.js';
import createDocForSeries from './utils/createDocForSeries.js';
import setAllowedToCreate from './utils/setAllowedToCreate.js';

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
    nodeEnv === 'development' && console.log(groupedByResault);
    if (groupedByResault.err) throw new Error(groupedByResault.err?.message);

    let streams =
      groupedByResault.complite?.flatMap(({ doc }) => doc.streams) || [];

    if (!groupedByResault.scrape) return streams.sort(sortStreams);

    //creating streams
    const info = await getInfo(id, type);
    nodeEnv === 'development' && console.log(info);

    const allowedToCreate = setAllowedToCreate(info.countries || []);

    if (!allowedToCreate) {
      console.error(
        `don't srape for ${info.name} with id of ${info.imdbId} ${info.type === 'series' ? `(${info.season}:${info.episode})` : ''} from ${info.countries?.join(', ')}`,
      );
      return streams.sort(sortStreams);
    }

    let scrapeResault = [];
    for (const { provider } of groupedByResault.scrape) {
      nodeEnv === 'development' &&
        console.log(`getting streams from ${provider.name}...`);

      const mkvProviderLinks = await provider.getAllMkvLinks(info);
      nodeEnv === 'development' && console.log({ mkvProviderLinks });
      if (mkvProviderLinks.err) continue;
      if (mkvProviderLinks.readyToReturn)
        return [...streams, ...mkvProviderLinks.streams].sort(sortStreams);

      scrapeResault = setTitle(mkvProviderLinks, info);
      nodeEnv === 'development' && console.log({ scrapeResault });

      // if (!iranBlockProviders.includes(provider)) {
      //   const strObj1 = scrapeResault[0];
      //   const strObj2 = scrapeResault[1];
      //   nodeEnv === 'development' && console.log({ strObj1, strObj2 });
      //   if ((strObj2 && !strObj2.size) || (strObj1 && !strObj1.size)) continue;
      // }

      if (type === 'movie')
        createDocForMovie(provider.mongoModel, scrapeResault, info);
      else if (provider === iranProvider)
        createDocForSeries(iranProvider.mongoModel, scrapeResault, info);

      if (scrapeResault.length) break;
    }

    streams = [...streams, ...scrapeResault];
    nodeEnv === 'development' && console.log({ finalStreams: streams });
    return streams.sort(sortStreams);
  } catch (err) {
    console.error(`Failed to create streams: ${err.message}`);
    return { err };
  }
}
