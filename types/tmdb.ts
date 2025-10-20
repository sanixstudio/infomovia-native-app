// TMDB API Types
export interface TMDBConfig {
  baseUrl: string;
  apiKey: string;
  imageBaseUrl: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  popularity: number;
  origin_country: string[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  gender: number;
  known_for: (Movie | TVShow)[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  episode_run_time: number[];
  status: string;
  tagline: string;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
}

export interface PersonDetails extends Person {
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  biography: string;
  imdb_id: string | null;
  homepage: string | null;
}

// API Endpoints
export type MediaType = 'movie' | 'tv' | 'person';
export type TimeWindow = 'day' | 'week';

export interface DiscoverParams {
  page?: number;
  sort_by?: string;
  include_adult?: boolean;
  include_video?: boolean;
  language?: string;
  with_genres?: string;
  with_original_language?: string;
  year?: number;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  'release_date.gte'?: string;
  'release_date.lte'?: string;
}
