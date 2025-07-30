import { film2mediaBaseUrl } from '../../config.js';
import getAllMkvLinks from './getAllMkvLinks.js';
import getMkvLinks from './getMkvLinks.js';
import getPageAddress from './getPageAddress.js';

const film2media = {
  name: 'film2media',
  BASE_URL: film2mediaBaseUrl,
  getAllMkvLinks,
  getPageAddress,
  getMkvLinks,
};

export default film2media;
