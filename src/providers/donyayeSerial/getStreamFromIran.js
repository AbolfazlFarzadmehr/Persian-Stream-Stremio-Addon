import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';
import { mirrors, domain } from '../../config.js';
import formatTitleForFilename from '../../utils/formatTitleForFilename.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = `${__dirname}/../../data/firstLevelDirectories.json`;
export default async function getStreamFromIran({
  name,
  type,
  year,
  imdbId,
  season,
  episode,
}) {
  try {
    const fileData = await readFile(filePath, 'utf-8');
    const directories = JSON.parse(fileData);
    const formattedTitle = formatTitleForFilename(name);
    let condidatePaths = mirrors.flatMap((mirror) =>
      directories[mirror][type].flatMap((firstDir) => {
        const generalUrl = `https://${mirror}.${domain}/${firstDir}${type === 'movie' ? `/${year}` : ''}`;
        if (type === 'movie') {
          if (firstDir === type) return `${generalUrl}/${formattedTitle}/`;
          return `${generalUrl}/${imdbId}/`;
        }
        if (firstDir === type)
          return [
            `${generalUrl}/${formattedTitle}/Soft.Sub/S${season.padStart(2, 0)}/`,
            `${generalUrl}/${formattedTitle}/Dubbed/S${season.padStart(2, 0)}/`,
          ];
        return [
          `${generalUrl}/${imdbId}/SoftSub/S${season.padStart(2, 0)}/`,
          `${generalUrl}/${imdbId}/Dubbed/S${season.padStart(2, 0)}/`,
        ];
      }),
    );
    if (type === 'series') {
      const pingResault = await Promise.all(
        condidatePaths.map(async (path) => {
          const status = await this.pingPath(path);
          return { status, path };
        }),
      );
      condidatePaths = pingResault
        .filter(({ status }) => status)
        .map(({ path }) => path);
    }
    const mkvLinksUnflat = await Promise.all(
      condidatePaths.map((path) => this.mkvFinder(path, type, season, episode)),
    );
    const mkvLinks = mkvLinksUnflat.flat(2);
    return mkvLinks;
  } catch (err) {
    console.error(`Failed to get Streams in iranAccess: ${err.message}`);
    return { err };
  }
}
