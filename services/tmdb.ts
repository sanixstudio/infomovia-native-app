import { TMDB_CONFIG, TMDB_DEFAULT_PARAMS, TMDB_ENDPOINTS, TMDB_RATE_LIMITS } from '../config/tmdb';
import {
    DiscoverParams,
    MediaType,
    Movie,
    MovieDetails,
    Person,
    PersonDetails,
    TimeWindow,
    TMDBResponse,
    TVShow,
    TVShowDetails
} from '../types/tmdb';

// Rate limiting helper
class RateLimiter { // This class is used to limit the number of requests to the TMDB API
  private requests: number[] = [];
  private dailyRequests = 0;
  private lastReset = Date.now();

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Reset daily counter if it's a new day
    if (now - this.lastReset > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      this.dailyRequests = 0;
      this.lastReset = now;
    }

    // Check daily limit
    if (this.dailyRequests >= TMDB_RATE_LIMITS.REQUESTS_PER_DAY) {
      return false;
    }

    // Remove requests older than 10 seconds
    this.requests = this.requests.filter(time => now - time < 10000);

    // Check 10-second limit
    if (this.requests.length >= TMDB_RATE_LIMITS.REQUESTS_PER_10_SECONDS) {
      return false;
    }

    return true;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
    this.dailyRequests++;
  }
}

const rateLimiter = new RateLimiter();

// Base API request function with rate limiting and error handling
const apiRequest = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
  // Check rate limiting
  if (!rateLimiter.canMakeRequest()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Validate API key
  if (!TMDB_CONFIG.apiKey) {
    throw new Error('TMDB API key is not configured. Please set EXPO_PUBLIC_TMDB_API_KEY in your environment variables.');
  }

  const url = new URL(`${TMDB_CONFIG.baseUrl}${endpoint}`);
  
  // Add API key
  url.searchParams.append('api_key', TMDB_CONFIG.apiKey);
  
  // Add default parameters
  Object.entries(TMDB_DEFAULT_PARAMS).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  // Add custom parameters (override defaults if provided)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });

  try {
    console.log('Making TMDB API request to:', url.toString());
    const response = await fetch(url.toString());
    
    // Record the request for rate limiting
    rateLimiter.recordRequest();
    
    console.log('TMDB API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('TMDB API Error:', response.status, response.statusText, errorData);
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText} - ${errorData.status_message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('TMDB API response data length:', data.results?.length || 0);
    return data;
  } catch (error) {
    console.error('TMDB API request failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred while fetching data from TMDB API');
  }
};

// Movies API
export const moviesApi = {
  // Get popular movies
  getPopular: (page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.POPULAR, { page }),
  
  // Get top rated movies
  getTopRated: (page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.TOP_RATED, { page }),
  
  // Get now playing movies
  getNowPlaying: (page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.NOW_PLAYING, { page }),
  
  // Get upcoming movies
  getUpcoming: (page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.UPCOMING, { page }),
  
  // Discover movies
  discover: (params: DiscoverParams = {}) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.DISCOVER, params),
  
  // Get movie details
  getDetails: (id: number) => 
    apiRequest<MovieDetails>(TMDB_ENDPOINTS.MOVIES.DETAILS(id)),
  
  // Get movie credits
  getCredits: (id: number) => 
    apiRequest<any>(TMDB_ENDPOINTS.MOVIES.CREDITS(id)),
  
  // Get similar movies
  getSimilar: (id: number, page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.SIMILAR(id), { page }),
  
  // Get movie recommendations
  getRecommendations: (id: number, page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.MOVIES.RECOMMENDATIONS(id), { page }),
};

// TV Shows API
export const tvApi = {
  // Get popular TV shows
  getPopular: (page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.POPULAR, { page }),
  
  // Get top rated TV shows
  getTopRated: (page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.TOP_RATED, { page }),
  
  // Get on the air TV shows
  getOnTheAir: (page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.ON_THE_AIR, { page }),
  
  // Get airing today TV shows
  getAiringToday: (page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.AIRING_TODAY, { page }),
  
  // Discover TV shows
  discover: (params: DiscoverParams = {}) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.DISCOVER, params),
  
  // Get TV show details
  getDetails: (id: number) => 
    apiRequest<TVShowDetails>(TMDB_ENDPOINTS.TV.DETAILS(id)),
  
  // Get TV show credits
  getCredits: (id: number) => 
    apiRequest<any>(TMDB_ENDPOINTS.TV.CREDITS(id)),
  
  // Get similar TV shows
  getSimilar: (id: number, page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.SIMILAR(id), { page }),
  
  // Get TV show recommendations
  getRecommendations: (id: number, page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.TV.RECOMMENDATIONS(id), { page }),
};

// People API
export const peopleApi = {
  // Get popular people
  getPopular: (page: number = 1) => 
    apiRequest<TMDBResponse<Person>>(TMDB_ENDPOINTS.PEOPLE.POPULAR, { page }),
  
  // Get person details
  getDetails: (id: number) => 
    apiRequest<PersonDetails>(TMDB_ENDPOINTS.PEOPLE.DETAILS(id)),
  
  // Get person movie credits
  getMovieCredits: (id: number) => 
    apiRequest<any>(TMDB_ENDPOINTS.PEOPLE.CREDITS(id)),
  
  // Get person TV credits
  getTvCredits: (id: number) => 
    apiRequest<any>(TMDB_ENDPOINTS.PEOPLE.TV_CREDITS(id)),
};

// Trending API
export const trendingApi = {
  // Get trending content
  getTrending: (mediaType: MediaType, timeWindow: TimeWindow = 'week', page: number = 1) => 
    apiRequest<TMDBResponse<Movie | TVShow | Person>>(
      TMDB_ENDPOINTS.TRENDING(mediaType, timeWindow), 
      { page }
    ),
};

// Search API
export const searchApi = {
  // Multi search
  multi: (query: string, page: number = 1) => 
    apiRequest<TMDBResponse<Movie | TVShow | Person>>(TMDB_ENDPOINTS.SEARCH.MULTI, { query, page }),
  
  // Search movies
  movies: (query: string, page: number = 1) => 
    apiRequest<TMDBResponse<Movie>>(TMDB_ENDPOINTS.SEARCH.MOVIE, { query, page }),
  
  // Search TV shows
  tv: (query: string, page: number = 1) => 
    apiRequest<TMDBResponse<TVShow>>(TMDB_ENDPOINTS.SEARCH.TV, { query, page }),
  
  // Search people
  people: (query: string, page: number = 1) => 
    apiRequest<TMDBResponse<Person>>(TMDB_ENDPOINTS.SEARCH.PERSON, { query, page }),
};

// Genres API
export const genresApi = {
  // Get movie genres
  getMovieGenres: () => 
    apiRequest<{ genres: { id: number; name: string }[] }>(TMDB_ENDPOINTS.GENRES.MOVIE),
  
  // Get TV genres
  getTvGenres: () => 
    apiRequest<{ genres: { id: number; name: string }[] }>(TMDB_ENDPOINTS.GENRES.TV),
};

// Configuration API - Essential for image URLs and other static data
export const configurationApi = {
  // Get API configuration (image base URLs, sizes, etc.)
  getConfiguration: () => 
    apiRequest<{
      images: {
        base_url: string;
        secure_base_url: string;
        backdrop_sizes: string[];
        logo_sizes: string[];
        poster_sizes: string[];
        profile_sizes: string[];
        still_sizes: string[];
      };
      change_keys: string[];
    }>(TMDB_ENDPOINTS.CONFIGURATION),
  
  // Get countries
  getCountries: () => 
    apiRequest<{ iso_3166_1: string; english_name: string; native_name: string }[]>(TMDB_ENDPOINTS.COUNTRIES),
  
  // Get languages
  getLanguages: () => 
    apiRequest<{ iso_639_1: string; english_name: string; name: string }[]>(TMDB_ENDPOINTS.LANGUAGES),
  
  // Get primary translations
  getPrimaryTranslations: () => 
    apiRequest<string[]>(TMDB_ENDPOINTS.PRIMARY_TRANSLATIONS),
  
  // Get timezones
  getTimezones: () => 
    apiRequest<{ [key: string]: string[] }>(TMDB_ENDPOINTS.TIMEZONES),
  
  // Get jobs
  getJobs: () => 
    apiRequest<{ department: string; jobs: string[] }[]>(TMDB_ENDPOINTS.JOBS),
};

// Watch Providers API
export const watchProvidersApi = {
  // Get available regions
  getRegions: () => 
    apiRequest<{ iso_3166_1: string; english_name: string; native_name: string }[]>(TMDB_ENDPOINTS.WATCH_PROVIDERS.REGIONS),
  
  // Get movie providers
  getMovieProviders: (watch_region?: string) => 
    apiRequest<any>(TMDB_ENDPOINTS.WATCH_PROVIDERS.MOVIE_PROVIDERS, { watch_region }),
  
  // Get TV providers
  getTvProviders: (watch_region?: string) => 
    apiRequest<any>(TMDB_ENDPOINTS.WATCH_PROVIDERS.TV_PROVIDERS, { watch_region }),
};
