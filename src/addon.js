import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  id,
  logo,
  name,
  version,
  description,
  nodeEnv,
  serverUrl,
} from './config.js';
import createStreams from './createStreams.js';
import isFromIran from './utils/isFromIran.js';

const addon = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

addon.set('view engine', 'pug');
addon.set('views', path.join(__dirname, 'views'));

addon.use(express.static(path.join(__dirname, '../public')));

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
  id,
  version,
  logo,
  catalogs: [],
  resources: ['stream'],
  types: ['movie', 'series'],
  name,
  description,
  idPrefixes: ['tt'],
};

const respond = function (res, data) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
};

addon.get('/', function (req, res) {
  res
    .status(200)
    .render('index', { logo, name, version, description, serverUrl });
});

addon.get('/manifest.json', function (req, res) {
  respond(res, manifest);
});

addon.param('type', function (req, res, next, val) {
  if (manifest.types.includes(val)) {
    next();
  } else {
    next('Unsupported type ' + val);
  }
});

addon.param('id', function (req, res, next, val) {
  if (req.params.id.startsWith(manifest.idPrefixes[0])) {
    next();
  } else {
    next('Unsupported type ' + val);
  }
});

nodeEnv === 'production' &&
  addon.use(async (req, res, next) => {
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress;
    req.isFromIran = await isFromIran(clientIp);
    next();
  });

addon.get('/stream/:type/:id.json', async function (req, res, next) {
  const { type, id } = req.params;
  const streams = await createStreams(type, id, req.isFromIran);
  nodeEnv === 'development' && console.log('...response ended');
  if (streams.err)
    return respond(res, {
      streams: [
        {
          title: '❌ There was an error in getting streams. please try again.',
          url: 'https://example.com/streams.mkv',
        },
      ],
    });

  respond(res, { streams });
});

export default addon;
