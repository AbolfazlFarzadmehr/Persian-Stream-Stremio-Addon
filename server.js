#!/usr/bin/env node

// import addonSdk from 'stremio-addon-sdk';
import { port, serverUrl } from './src/config.js';
import addon from './src/addon.js';
// import './src/providers/donyaye-serial/getFirstLevelDir.js';

// const { publishToCentral } = addonSdk;

addon.listen(port, () =>
  console.log(
    `HTTP addon accessible at: http://127.0.0.1:${port}/manifest.json`,
  ),
);

// publishToCentral(serverUrl)
//   .then(console.log('publish to central was successfull.'))
//   .catch((err) => {
//     console.error('Failed to publish to central:', err);
//   });
