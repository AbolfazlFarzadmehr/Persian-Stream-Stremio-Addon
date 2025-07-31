import { iranProviderBaseUrl } from '../../config.js';
import { IranProvider } from '../../models/providersModels.js';
import Provider from '../Provider.js';
import getAllMkvLinks from './getAllMkvLinks.js';
import getCustomId from './getCustomId.js';
import getMkvLinks from './getMkvLinks.js';

const methods = {
  getAllMkvLinks,
  getCustomId,
  getMkvLinks,
};

const iranProvider = new Provider(
  'Iran-provider',
  'public',
  IranProvider,
  iranProviderBaseUrl,
  methods,
);

export default iranProvider;
