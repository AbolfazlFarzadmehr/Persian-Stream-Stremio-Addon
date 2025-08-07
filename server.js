#!/usr/bin/env node

// import addonSdk from 'stremio-addon-sdk';
import { port, serverUrl, dataBase, dataBasePassword } from './src/config.js';
import mongoose from 'mongoose';
import addon from './src/addon.js';
import './src/providers/donyayeSerial/getFirstLevelDir.js';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! SHUTING DOWN...');
  process.exit(1);
});

// const { publishToCentral } = addonSdk;

const db = dataBase.replace('<DB_PASSWORD>', dataBasePassword);

const server = addon.listen(port, () =>
  console.log(
    `HTTP addon accessible at: http://127.0.0.1:${port}/manifest.json`,
  ),
);

// publishToCentral(serverUrl)
//   .then(console.log('publish to central was successfull.'))
//   .catch((err) => {
//     console.error('Failed to publish to central:', err);
//   });

(async () => {
  try {
    await mongoose.connect(db, {});
    console.log('DB connection successfull!');
  } catch (err) {
    console.log(`there was an error connecting to database:\n${err}`);
    server.close(() => process.exit(1));
  }
})();

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDELD REJECTION! SHUTING DOWN...');
  server.close(() => process.exit(1));
});
