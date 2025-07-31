import iranProvider from './iranProvider/iranProvider.js';
import donyayeSeryal from './donyayeSerial/donyayeSerial.js';
import film2media from './film2media/film2media.js';

const iranAccessProviders = [film2media, donyayeSeryal];
const publicProviders = [iranProvider];
const iranBlockProviders = [];
const providers = [publicProviders, iranAccessProviders, iranBlockProviders];
export default providers;
