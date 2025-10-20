import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Movie, Person, TVShow } from '../types/tmdb';

interface MovieState {
  // Movies
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  nowPlayingMovies: Movie[];
  upcomingMovies: Movie[];
  
  // TV Shows
  popularTvShows: TVShow[];
  topRatedTvShows: TVShow[];
  onTheAirTvShows: TVShow[];
  airingTodayTvShows: TVShow[];
  
  // People
  popularPeople: Person[];
  
  // Trending
  trendingMovies: Movie[];
  trendingTvShows: TVShow[];
  trendingPeople: Person[];
  
  // Favorites
  favoriteMovies: Movie[];
  favoriteTvShows: TVShow[];
  favoritePeople: Person[];
  
  // Watchlist
  watchlistMovies: Movie[];
  watchlistTvShows: TVShow[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPopularMovies: (movies: Movie[]) => void;
  setTopRatedMovies: (movies: Movie[]) => void;
  setNowPlayingMovies: (movies: Movie[]) => void;
  setUpcomingMovies: (movies: Movie[]) => void;
  
  setPopularTvShows: (shows: TVShow[]) => void;
  setTopRatedTvShows: (shows: TVShow[]) => void;
  setOnTheAirTvShows: (shows: TVShow[]) => void;
  setAiringTodayTvShows: (shows: TVShow[]) => void;
  
  setPopularPeople: (people: Person[]) => void;
  
  setTrendingMovies: (movies: Movie[]) => void;
  setTrendingTvShows: (shows: TVShow[]) => void;
  setTrendingPeople: (people: Person[]) => void;
  
  // Favorites actions
  addFavoriteMovie: (movie: Movie) => void;
  removeFavoriteMovie: (movieId: number) => void;
  addFavoriteTvShow: (show: TVShow) => void;
  removeFavoriteTvShow: (showId: number) => void;
  addFavoritePerson: (person: Person) => void;
  removeFavoritePerson: (personId: number) => void;
  
  // Watchlist actions
  addToWatchlistMovie: (movie: Movie) => void;
  removeFromWatchlistMovie: (movieId: number) => void;
  addToWatchlistTvShow: (show: TVShow) => void;
  removeFromWatchlistTvShow: (showId: number) => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Check if item is favorite
  isFavoriteMovie: (movieId: number) => boolean;
  isFavoriteTvShow: (showId: number) => boolean;
  isFavoritePerson: (personId: number) => boolean;
  
  // Check if item is in watchlist
  isInWatchlistMovie: (movieId: number) => boolean;
  isInWatchlistTvShow: (showId: number) => boolean;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      // Initial state
      popularMovies: [],
      topRatedMovies: [],
      nowPlayingMovies: [],
      upcomingMovies: [],
      
      popularTvShows: [],
      topRatedTvShows: [],
      onTheAirTvShows: [],
      airingTodayTvShows: [],
      
      popularPeople: [],
      
      trendingMovies: [],
      trendingTvShows: [],
      trendingPeople: [],
      
      favoriteMovies: [],
      favoriteTvShows: [],
      favoritePeople: [],
      
      watchlistMovies: [],
      watchlistTvShows: [],
      
      isLoading: false,
      error: null,
      
      // Movie actions
      setPopularMovies: (movies) => set({ popularMovies: movies }),
      setTopRatedMovies: (movies) => set({ topRatedMovies: movies }),
      setNowPlayingMovies: (movies) => set({ nowPlayingMovies: movies }),
      setUpcomingMovies: (movies) => set({ upcomingMovies: movies }),
      
      // TV Show actions
      setPopularTvShows: (shows) => set({ popularTvShows: shows }),
      setTopRatedTvShows: (shows) => set({ topRatedTvShows: shows }),
      setOnTheAirTvShows: (shows) => set({ onTheAirTvShows: shows }),
      setAiringTodayTvShows: (shows) => set({ airingTodayTvShows: shows }),
      
      // People actions
      setPopularPeople: (people) => set({ popularPeople: people }),
      
      // Trending actions
      setTrendingMovies: (movies) => set({ trendingMovies: movies }),
      setTrendingTvShows: (shows) => set({ trendingTvShows: shows }),
      setTrendingPeople: (people) => set({ trendingPeople: people }),
      
      // Favorites actions
      addFavoriteMovie: (movie) => set((state) => 
        state.favoriteMovies.some(fav => fav.id === movie.id) 
          ? state 
          : { favoriteMovies: [...state.favoriteMovies, movie] }
      ),
      removeFavoriteMovie: (movieId) => set((state) => ({
        favoriteMovies: state.favoriteMovies.filter(movie => movie.id !== movieId)
      })),
      addFavoriteTvShow: (show) => set((state) => 
        state.favoriteTvShows.some(fav => fav.id === show.id) 
          ? state 
          : { favoriteTvShows: [...state.favoriteTvShows, show] }
      ),
      removeFavoriteTvShow: (showId) => set((state) => ({
        favoriteTvShows: state.favoriteTvShows.filter(show => show.id !== showId)
      })),
      addFavoritePerson: (person) => set((state) => 
        state.favoritePeople.some(fav => fav.id === person.id) 
          ? state 
          : { favoritePeople: [...state.favoritePeople, person] }
      ),
      removeFavoritePerson: (personId) => set((state) => ({
        favoritePeople: state.favoritePeople.filter(person => person.id !== personId)
      })),
      
      // Watchlist actions
      addToWatchlistMovie: (movie) => set((state) => 
        state.watchlistMovies.some(watch => watch.id === movie.id) 
          ? state 
          : { watchlistMovies: [...state.watchlistMovies, movie] }
      ),
      removeFromWatchlistMovie: (movieId) => set((state) => ({
        watchlistMovies: state.watchlistMovies.filter(movie => movie.id !== movieId)
      })),
      addToWatchlistTvShow: (show) => set((state) => 
        state.watchlistTvShows.some(watch => watch.id === show.id) 
          ? state 
          : { watchlistTvShows: [...state.watchlistTvShows, show] }
      ),
      removeFromWatchlistTvShow: (showId) => set((state) => ({
        watchlistTvShows: state.watchlistTvShows.filter(show => show.id !== showId)
      })),
      
      // Utility actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Check functions
      isFavoriteMovie: (movieId) => 
        get().favoriteMovies.some(movie => movie.id === movieId),
      isFavoriteTvShow: (showId) => 
        get().favoriteTvShows.some(show => show.id === showId),
      isFavoritePerson: (personId) => 
        get().favoritePeople.some(person => person.id === personId),
      
      isInWatchlistMovie: (movieId) => 
        get().watchlistMovies.some(movie => movie.id === movieId),
      isInWatchlistTvShow: (showId) => 
        get().watchlistTvShows.some(show => show.id === showId),
    }),
    {
      name: 'movie-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteMovies: state.favoriteMovies,
        favoriteTvShows: state.favoriteTvShows,
        favoritePeople: state.favoritePeople,
        watchlistMovies: state.watchlistMovies,
        watchlistTvShows: state.watchlistTvShows,
      }),
    }
  )
);
