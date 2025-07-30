export default function formatTitleForLinks(title, year, type) {
  const formattedTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove all special characters (except spaces)
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  return type === 'movie'
    ? `${formattedTitle}-${year}`
    : `series/${formattedTitle}`;
}
