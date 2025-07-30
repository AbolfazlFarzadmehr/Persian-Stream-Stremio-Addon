export default function formatTitleForFilename(title) {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove all special characters (except spaces)
    .trim()
    .replace(/\s+/g, '.'); // Replace spaces with dots
}
