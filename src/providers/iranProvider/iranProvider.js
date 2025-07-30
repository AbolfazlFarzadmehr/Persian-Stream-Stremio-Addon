import { iranProviderBaseUrl } from '../../config.js';
import getAllMkvLinks from './getAllMkvLinks.js';
import getCustomId from './getCustomId.js';
import getMkvLinks from './getMkvLinks.js';

const iranProvider = {
  name: 'Iran-provider',
  BASE_URL: iranProviderBaseUrl,
  getAllMkvLinks,
  getCustomId,
  getMkvLinks,
};

export default iranProvider;
