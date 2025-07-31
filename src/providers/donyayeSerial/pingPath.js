import fetch from 'node-fetch';

export default async function pingPath(path) {
  const res = await fetch(path, { method: 'HEAD' });
  return res.ok;
}
