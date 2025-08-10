import { ipApiUrl, ipApiFields, showCliIp } from '../config.js';

export default async function isFromIran(ip) {
  try {
    const geoRes = await fetch(`${ipApiUrl}/${ip}?fields=${ipApiFields}`);
    const data = await geoRes.json();
    showCliIp === 'true' && console.log(`Client ip: ${ip} (${data.country})`);
    return data.countryCode === 'IR';
  } catch (err) {
    console.error(`failed to detect the location of the ${ip}: ${err.message}`);
    return { err };
  }
}
