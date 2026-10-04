export interface Moment { file: string; height: number; alt: string; note: string }

// The scrapbook on the about page and the photo row on the home page. Files are 720 wide WebP under public/me/m,
// served as they are (`unoptimized`): the Next image optimizer stalled on some of them.
export const MOMENTS: Moment[] = [
  { file: 'skyline', height: 683, alt: 'Adnan in a white shirt by the water with a city skyline at sunset behind', note: 'Skyline at sunset' },
  { file: 'conference', height: 870, alt: 'Adnan with a red lanyard on a conference floor', note: 'Conference floor' },
  { file: 'lake', height: 625, alt: 'Adnan in sunglasses and a navy polo in front of a lake and green hills', note: 'Lake day' },
  { file: 'hills', height: 660, alt: 'Adnan in a black jacket sitting on a rock with forested hills behind', note: 'Up in the hills' },
  { file: 'seminar', height: 916, alt: 'Adnan in a white shirt with an event badge, taking a mirror photo', note: 'Seminar day' },
  { file: 'coffee', height: 1029, alt: 'Adnan in a dark green sweater at a cafe table with a coffee cup', note: 'Coffee stop' },
  { file: 'drive', height: 597, alt: 'Adnan in sunglasses driving a car', note: 'On the road' },
  { file: 'lift', height: 838, alt: 'Adnan in a light blue shirt with an event badge, taking a mirror photo in a lift', note: 'Between sessions' },
  { file: 'water', height: 939, alt: 'Adnan in sunglasses and a dark polo by a lake', note: 'By the water' },
  { file: 'desk', height: 827, alt: 'Adnan in a blue shirt with a lanyard at an office desk with a laptop', note: 'Office day' },
  { file: 'dinner', height: 800, alt: 'Adnan in a green shirt at a restaurant table', note: 'Dinner out' },
  { file: 'laptop', height: 673, alt: 'Adnan in a grey sweater working on a laptop in a cafe', note: 'Working from a cafe' },
  { file: 'waistcoat', height: 790, alt: 'Adnan in a white kurta and black waistcoat, seated', note: 'Dressed for the occasion' },
  { file: 'polo', height: 837, alt: 'Adnan in a beige polo at a cafe table with a cup', note: 'Slow morning' },
  { file: 'coat', height: 657, alt: 'Adnan in a black coat and grey scarf, taking a mirror photo', note: 'Winter layers' },
  { file: 'tee', height: 985, alt: 'Adnan in a black t-shirt, taking a mirror photo', note: 'Off duty' },
];
