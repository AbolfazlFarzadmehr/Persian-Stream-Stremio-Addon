import setTitle from './utils/setTitle.js';
import getMeta from './utils/getMeta.js';
import sortStreams from './utils/sortStreams.js';
import { nodeEnv } from './config.js';
import createDocForMovie from './utils/createDocForMovie.js';
import providers from './providers/groupByTypeProviders.js';

const [publicProviders, iranAccessProviders, iranBlockProviders] = providers;

export default async function createStreams(
  type,
  id,
  reqFromIran = false,
  appRunInIran = true,
) {
  try {
    //checking database
    const geoProviders =
      nodeEnv === 'production'
        ? reqFromIran?.err
          ? []
          : reqFromIran
            ? iranAccessProviders
            : iranBlockProviders
        : iranAccessProviders;
    const getDocCallback = async (provider) => ({
      provider,
      doc: await provider.mongoModel.findOne({ stremioId: id }),
    });
    const resault = await Promise.all(
      [geoProviders.map(getDocCallback), publicProviders.map(getDocCallback)]
        .filter((promise) => promise)
        .flat(),
    );
    const groupedByResault = Object.groupBy(resault, ({ doc }) =>
      doc ? 'complite' : 'scrape',
    );
    let streams =
      groupedByResault.complite
        ?.flatMap(({ doc }) => doc.streams)
        .sort(sortStreams) || [];
    nodeEnv === 'development' && console.log(groupedByResault);
    if (!groupedByResault.scrape) return streams;

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

    const provider = groupedByResault.scrape[0].provider;

    nodeEnv === 'development' &&
      console.log(`getting streams from ${provider.name}...`);
    const mkvLinks = await provider.getAllMkvLinks(info);
    if (mkvLinks.err) throw new Error(mkvLinks.err.message);
    const scrapeResault = setTitle(mkvLinks, info).sort(sortStreams);
    // nodeEnv === 'development' && console.log({ scrapeResault });
    if (type === 'movie')
      createDocForMovie(provider.mongoModel, scrapeResault, info);
    streams = [...streams, ...scrapeResault];

    nodeEnv === 'development' && console.log({ finalStreams: streams });
    return streams.sort(sortStreams);
  } catch (err) {
    return { err };
  }
}
