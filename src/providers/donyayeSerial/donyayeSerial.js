import { donyayeSerialBaseUrl } from '../../config.js';
import getAllMkvLinks from './getAllMkvLinks.js';
import getStreamFromIran from './getStreamFromIran.js';
import getStreamsFromAbroad from './getStreamsFromAbroad.js';
import formatTitleForLinks from './formatTitleForLinks.js';
import getMkvsFromAbroad from './getMkvsFromAbroad.js';
import mkvFinder from './mkvFinder.js';
import pingPath from './pingPath.js';
import Provider from '../Provider.js';
import { DonyayeSerial } from '../../models/providersModels.js';

const methods = {
  getAllMkvLinks,
  getStreamFromIran,
  getStreamsFromAbroad,
  formatTitleForLinks,
  getMkvsFromAbroad,
  pingPath,
  mkvFinder,
};

const donyayeSeryal = new Provider(
  'Donyaye-serial',
  'iranAccess',
  DonyayeSerial,
  donyayeSerialBaseUrl,
  methods,
);

export default donyayeSeryal;
