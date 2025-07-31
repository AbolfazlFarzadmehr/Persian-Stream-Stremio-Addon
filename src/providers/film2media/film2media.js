import { film2mediaBaseUrl } from '../../config.js';
import { Film2Media } from '../../models/providersModels.js';
import Provider from '../Provider.js';
import getAllMkvLinks from './getAllMkvLinks.js';
import getMkvLinks from './getMkvLinks.js';
import getPageAddress from './getPageAddress.js';

const methods = {
  getAllMkvLinks,
  getPageAddress,
  getMkvLinks,
};

const film2media = new Provider(
  'film2media',
  'iranAccess',
  Film2Media,
  film2mediaBaseUrl,
  methods,
);

export default film2media;
