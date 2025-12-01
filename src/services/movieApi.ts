import type { Content } from '../App';

// Mock TMDB API integration - In production, replace with real API key
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

// Since we can't use real API calls in this environment, we'll generate enriched mock data
// In production, uncomment the real API calls below

export async function fetchTrendingMovies(): Promise<Content[]> {
  // Real API call (uncomment in production):
  // const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
  // const data = await response.json();
  // return data.results.map(mapTMDBToContent);
  
  return generateMockTrendingMovies();
}

export async function fetchPopularMovies(): Promise<Content[]> {
  return generateMockPopularMovies();
}

export async function fetchPopularTVSeries(): Promise<Content[]> {
  return generateMockTVSeries();
}

export async function fetchKDramas(): Promise<Content[]> {
  return generateMockKDramas();
}

export async function fetchAnime(): Promise<Content[]> {
  return generateMockAnime();
}

// Helper function to map TMDB data to our Content type
function mapTMDBToContent(tmdbItem: any, type: Content['type']): Content {
  return {
    id: `tmdb-${tmdbItem.id}`,
    title: tmdbItem.title || tmdbItem.name,
    thumbnail: `${TMDB_IMAGE_BASE}${tmdbItem.poster_path}`,
    backdrop: `${TMDB_IMAGE_BASE}${tmdbItem.backdrop_path}`,
    description: tmdbItem.overview,
    duration: 7200, // Default 2 hours
    year: parseInt((tmdbItem.release_date || tmdbItem.first_air_date || '2024').split('-')[0]),
    rating: tmdbItem.adult ? 'R' : 'PG-13',
    genre: ['Action', 'Drama'], // Would map from genre_ids in real API
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type,
  };
}

// Enhanced mock data generators
function generateMockTrendingMovies(): Content[] {
  return [
    {
      id: 'trend-1',
      title: 'Quantum Paradox',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
      description: 'A physicist discovers a way to manipulate time, but each change creates deadly paradoxes that threaten reality itself.',
      duration: 8100,
      year: 2024,
      rating: 'PG-13',
      genre: ['Sci-Fi', 'Thriller', 'Action'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'movie',
    },
    {
      id: 'trend-2',
      title: 'Eclipse Protocol',
      thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop',
      description: 'When the sun mysteriously begins to die, a team of scientists must execute a dangerous mission to save humanity.',
      duration: 7800,
      year: 2024,
      rating: 'PG-13',
      genre: ['Sci-Fi', 'Drama', 'Adventure'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'movie',
    },
    {
      id: 'trend-3',
      title: 'Silent Assassin',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop',
      description: 'A mute hitman takes on one last job, but discovers he\'s been set up by his own organization.',
      duration: 6900,
      year: 2024,
      rating: 'R',
      genre: ['Action', 'Thriller', 'Crime'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'movie',
    },
    {
      id: 'trend-4',
      title: 'The Last Colony',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&h=1080&fit=crop',
      description: 'On a distant planet, colonists fight for survival against hostile alien life forms and their own desperation.',
      duration: 7500,
      year: 2024,
      rating: 'R',
      genre: ['Sci-Fi', 'Horror', 'Action'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      type: 'movie',
    },
    {
      id: 'trend-5',
      title: 'Neon Knights',
      thumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1920&h=1080&fit=crop',
      description: 'In a cyberpunk megacity, a group of hackers fights against a corrupt corporation controlling the population.',
      duration: 7200,
      year: 2024,
      rating: 'R',
      genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      type: 'movie',
    },
  ];
}

function generateMockPopularMovies(): Content[] {
  return [
    {
      id: 'pop-1',
      title: 'Velocity',
      thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1920&h=1080&fit=crop',
      description: 'A street racer is forced to work undercover for the FBI to take down an international crime syndicate.',
      duration: 6600,
      year: 2024,
      rating: 'PG-13',
      genre: ['Action', 'Thriller', 'Crime'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      type: 'movie',
    },
    {
      id: 'pop-2',
      title: 'Mystic Falls',
      thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop',
      description: 'A young woman discovers she has supernatural powers and must protect her town from dark forces.',
      duration: 6300,
      year: 2023,
      rating: 'PG-13',
      genre: ['Fantasy', 'Drama', 'Mystery'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      type: 'movie',
    },
    {
      id: 'pop-3',
      title: 'Deep Blue',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
      description: 'A submarine crew discovers an ancient underwater civilization and must escape before it\'s too late.',
      duration: 7200,
      year: 2024,
      rating: 'PG-13',
      genre: ['Adventure', 'Thriller', 'Sci-Fi'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      type: 'movie',
    },
    {
      id: 'pop-4',
      title: 'The Heist',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop',
      description: 'A master thief assembles a team for one last job: stealing from the most secure vault in the world.',
      duration: 7800,
      year: 2024,
      rating: 'PG-13',
      genre: ['Crime', 'Thriller', 'Action'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      type: 'movie',
    },
  ];
}

function generateMockTVSeries(): Content[] {
  return [
    {
      id: 'tv-auto-1',
      title: 'Shadow Protocol',
      thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop',
      description: 'Elite agents operate in the shadows to prevent global catastrophes.',
      duration: 3600,
      year: 2024,
      rating: 'TV-MA',
      genre: ['Action', 'Thriller', 'Spy'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      type: 'series',
    },
  ];
}

function generateMockKDramas(): Content[] {
  return [
    {
      id: 'kd-auto-1',
      title: 'Moonlight Romance',
      thumbnail: 'https://images.unsplash.com/photo-1529310399831-ed472b81d589?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1529310399831-ed472b81d589?w=1920&h=1080&fit=crop',
      description: 'A time-traveling prince meets a modern-day detective.',
      duration: 3900,
      year: 2024,
      rating: 'TV-14',
      genre: ['Romance', 'Fantasy', 'Comedy'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      type: 'kdrama',
    },
  ];
}

function generateMockAnime(): Content[] {
  return [
    {
      id: 'an-auto-1',
      title: 'Shadow Blade Chronicles',
      thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&h=1080&fit=crop',
      description: 'A young warrior discovers a legendary sword.',
      duration: 1440,
      year: 2024,
      rating: 'TV-14',
      genre: ['Action', 'Fantasy', 'Adventure'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'anime',
    },
  ];
}

// Function to automatically fetch and update content
export async function fetchAllContent(): Promise<Content[]> {
  try {
    const [trending, popular, tvSeries, kdramas, anime] = await Promise.all([
      fetchTrendingMovies(),
      fetchPopularMovies(),
      fetchPopularTVSeries(),
      fetchKDramas(),
      fetchAnime(),
    ]);

    return [...trending, ...popular, ...tvSeries, ...kdramas, ...anime];
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
}
