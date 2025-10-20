import { TMDBConfig } from "../types/tmdb";

// TMDB API Configuration
export const TMDB_CONFIG: TMDBConfig = {
  baseUrl: "https://api.themoviedb.org/3",
  apiKey: process.env.EXPO_PUBLIC_TMDB_API_KEY || "", // You'll need to set this in your .env file
  imageBaseUrl: "https://image.tmdb.org/t/p",
};

// Image size types based on TMDB API documentation
export type PosterSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
export type BackdropSize = "w300" | "w780" | "w1280" | "original";
export type ProfileSize = "w45" | "w185" | "h632" | "original";
export type LogoSize = "w45" | "w92" | "w154" | "w185" | "w300" | "w500" | "original";
export type StillSize = "w92" | "w185" | "w300" | "original";

// Base image URL helper
export const getImageUrl = (
  path: string | null,
  size: PosterSize = "w500"
) => {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
};

// Poster URL helper
export const getPosterUrl = (
  path: string | null,
  size: PosterSize = "w500"
) => {
  return getImageUrl(path, size);
};

// Backdrop URL helper
export const getBackdropUrl = (
  path: string | null,
  size: BackdropSize = "w1280"
) => {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
};

// Profile URL helper
export const getProfileUrl = (
  path: string | null,
  size: ProfileSize = "w185"
) => {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
};

// Logo URL helper for production companies
export const getLogoUrl = (
  path: string | null,
  size: LogoSize = "w185"
) => {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
};

// Still URL helper for TV show stills
export const getStillUrl = (
  path: string | null,
  size: StillSize = "w300"
) => {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
};

// API Endpoints
export const TMDB_ENDPOINTS = {
  // Movies
  MOVIES: {
    POPULAR: "/movie/popular",
    TOP_RATED: "/movie/top_rated",
    NOW_PLAYING: "/movie/now_playing",
    UPCOMING: "/movie/upcoming",
    DISCOVER: "/discover/movie",
    DETAILS: (id: number) => `/movie/${id}`,
    CREDITS: (id: number) => `/movie/${id}/credits`,
    SIMILAR: (id: number) => `/movie/${id}/similar`,
    RECOMMENDATIONS: (id: number) => `/movie/${id}/recommendations`,
  },
  // TV Shows
  TV: {
    POPULAR: "/tv/popular",
    TOP_RATED: "/tv/top_rated",
    ON_THE_AIR: "/tv/on_the_air",
    AIRING_TODAY: "/tv/airing_today",
    DISCOVER: "/discover/tv",
    DETAILS: (id: number) => `/tv/${id}`,
    CREDITS: (id: number) => `/tv/${id}/credits`,
    SIMILAR: (id: number) => `/tv/${id}/similar`,
    RECOMMENDATIONS: (id: number) => `/tv/${id}/recommendations`,
  },
  // People
  PEOPLE: {
    POPULAR: "/person/popular",
    DETAILS: (id: number) => `/person/${id}`,
    CREDITS: (id: number) => `/person/${id}/movie_credits`,
    TV_CREDITS: (id: number) => `/person/${id}/tv_credits`,
  },
  // Trending
  TRENDING: (
    mediaType: "movie" | "tv" | "person",
    timeWindow: "day" | "week" = "week"
  ) => `/trending/${mediaType}/${timeWindow}`,
  // Search
  SEARCH: {
    MULTI: "/search/multi",
    MOVIE: "/search/movie",
    TV: "/search/tv",
    PERSON: "/search/person",
  },
  // Genres
  GENRES: {
    MOVIE: "/genre/movie/list",
    TV: "/genre/tv/list",
  },
  // Configuration
  CONFIGURATION: "/configuration",
  // Countries
  COUNTRIES: "/configuration/countries",
  // Languages
  LANGUAGES: "/configuration/languages",
  // Primary Translations
  PRIMARY_TRANSLATIONS: "/configuration/primary_translations",
  // Timezones
  TIMEZONES: "/configuration/timezones",
  // Jobs
  JOBS: "/configuration/jobs",
  // Keywords
  KEYWORDS: {
    DETAILS: (id: number) => `/keyword/${id}`,
    MOVIES: (id: number) => `/keyword/${id}/movies`,
  },
  // Collections
  COLLECTIONS: {
    DETAILS: (id: number) => `/collection/${id}`,
    IMAGES: (id: number) => `/collection/${id}/images`,
    TRANSLATIONS: (id: number) => `/collection/${id}/translations`,
  },
  // Companies
  COMPANIES: {
    DETAILS: (id: number) => `/company/${id}`,
    IMAGES: (id: number) => `/company/${id}/images`,
    ALTERNATIVE_NAMES: (id: number) => `/company/${id}/alternative_names`,
  },
  // Networks
  NETWORKS: {
    DETAILS: (id: number) => `/network/${id}`,
    IMAGES: (id: number) => `/network/${id}/images`,
    ALTERNATIVE_NAMES: (id: number) => `/network/${id}/alternative_names`,
  },
  // Reviews
  REVIEWS: {
    DETAILS: (id: string) => `/review/${id}`,
  },
  // Watch Providers
  WATCH_PROVIDERS: {
    REGIONS: "/watch/providers/regions",
    MOVIE_PROVIDERS: "/watch/providers/movie",
    TV_PROVIDERS: "/watch/providers/tv",
  },
} as const;

// Rate limiting constants based on TMDB documentation
export const TMDB_RATE_LIMITS = {
  // 40 requests per 10 seconds per IP
  REQUESTS_PER_10_SECONDS: 40,
  // 10,000 requests per day per API key
  REQUESTS_PER_DAY: 10000,
} as const;

// Default parameters for API requests
export const TMDB_DEFAULT_PARAMS = {
  language: "en-US",
  include_adult: false,
  include_video: false,
} as const;
