import { nodeEnv } from '../config.js';
import providers from '../providers/groupByTypeProviders.js';

const [publicProviders, iranAccessProviders, iranBlockProviders] = providers;
export default function setGeoProvider(reqFromIran) {
  return nodeEnv === 'production'
    ? reqFromIran?.err
      ? []
      : reqFromIran
        ? iranAccessProviders
        : iranBlockProviders
    : iranAccessProviders;
}
