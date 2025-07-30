import { donyayeSerialBaseUrl } from '../../config.js';
import getAllMkvLinks from './getAllMkvLinks.js';
import getStreamFromIranAccess from './getStreamFromIranAccess.js';
import getStreamsFromAbroad from './getStreamsFromAbroad.js';
import formatTitleForLinks from './formatTitleForLinks.js';
import getMkvsFromAbroad from './getMkvsFromAbroad.js';
import mkvFinder from './mkvFinder.js';
import pingPath from './pingPath.js';

const donyayeSeryal = {
  name: 'Donyaye-serial',
  BASE_URL: donyayeSerialBaseUrl,
  getAllMkvLinks,
  getStreamFromIranAccess,
  getStreamsFromAbroad,
  formatTitleForLinks,
  getMkvsFromAbroad,
  pingPath,
  mkvFinder,
};

export default donyayeSeryal;
