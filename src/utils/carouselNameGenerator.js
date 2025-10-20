// Generate random circus-themed carousel names
const circusWords = [
  'Magnificent',
  'Mystical',
  'Whimsical',
  'Spectacular',
  'Enchanted',
  'Grand',
  'Curious',
  'Marvelous',
  'Wondrous',
  'Dazzling',
  'Splendid',
  'Fantastic',
  'Amazing',
  'Glorious',
  'Incredible',
  'Extraordinary',
  'Remarkable',
  'Astonishing',
];

const circusNouns = [
  'Carousel',
  'Circus',
  'Spectacle',
  'Pageant',
  'Gala',
  'Festival',
  'Extravaganza',
  'Performance',
  'Show',
  'Display',
  'Exhibition',
  'Parade',
  'Jamboree',
  'Revelry',
  'Celebration',
  'Fiesta',
];

export function generateCarouselName() {
  const word1 = circusWords[Math.floor(Math.random() * circusWords.length)];
  const word2 = circusNouns[Math.floor(Math.random() * circusNouns.length)];

  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  return `${word1} ${word2} ${month} ${year}`;
}
