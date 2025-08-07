const allowedCountry = [
  'United States',
  'United Kingdom',
  'Spain',
  'Canada',
  'South Korea',
  'Japan',
  'Australia',
  'Germany',
  'France',
  'New Zealand',
  'Mexico',
  'Ireland',
  'Argentina',
  'Colombia',
  'Portugal',
  'Brazil',
  'Iran',
  'Chile',
  'Peru',
  'Austria',
  'Switzerland',
  'Belgium',
  'Switzerland',
];

export default function setAllowedToCreate(countries) {
  for (const country of countries) {
    if (allowedCountry.includes(country)) return true;
  }
  return false;
}
