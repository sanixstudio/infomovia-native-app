import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
    configurationApi,
    moviesApi,
    peopleApi,
    searchApi,
    trendingApi,
    tvApi
} from '../services/tmdb';
import { useMovieStore } from '../stores/movieStore';
import { Movie, Person, TVShow } from '../types/tmdb';

// Custom hook for fetching and managing TMDB data
export const useTMDBData = () => {
  const {
    // State
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    popularTvShows,
    topRatedTvShows,
    onTheAirTvShows,
    airingTodayTvShows,
    popularPeople,
    trendingMovies,
    trendingTvShows,
    trendingPeople,
    isLoading,
    error,
    // Actions
    setPopularMovies,
    setTopRatedMovies,
    setNowPlayingMovies,
    setUpcomingMovies,
    setPopularTvShows,
    setTopRatedTvShows,
    setOnTheAirTvShows,
    setAiringTodayTvShows,
    setPopularPeople,
    setTrendingMovies,
    setTrendingTvShows,
    setTrendingPeople,
    setLoading,
    setError,
    clearError,
  } = useMovieStore();

  // Configuration query
  const configurationQuery = useQuery({
    queryKey: ['tmdb', 'configuration'],
    queryFn: configurationApi.getConfiguration,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (renamed from cacheTime in v5)
  });

  // Movies queries
  const popularMoviesQuery = useQuery({
    queryKey: ['tmdb', 'movies', 'popular'],
    queryFn: () => moviesApi.getPopular(1),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const topRatedMoviesQuery = useQuery({
    queryKey: ['tmdb', 'movies', 'top-rated'],
    queryFn: () => moviesApi.getTopRated(1),
    staleTime: 30 * 60 * 1000,
  });

  const nowPlayingMoviesQuery = useQuery({
    queryKey: ['tmdb', 'movies', 'now-playing'],
    queryFn: () => moviesApi.getNowPlaying(1),
    staleTime: 30 * 60 * 1000,
  });

  const upcomingMoviesQuery = useQuery({
    queryKey: ['tmdb', 'movies', 'upcoming'],
    queryFn: () => moviesApi.getUpcoming(1),
    staleTime: 30 * 60 * 1000,
  });

  // TV Shows queries
  const popularTvShowsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'popular'],
    queryFn: () => tvApi.getPopular(1),
    staleTime: 30 * 60 * 1000,
  });

  const topRatedTvShowsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'top-rated'],
    queryFn: () => tvApi.getTopRated(1),
    staleTime: 30 * 60 * 1000,
  });

  const onTheAirTvShowsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'on-the-air'],
    queryFn: () => tvApi.getOnTheAir(1),
    staleTime: 30 * 60 * 1000,
  });

  const airingTodayTvShowsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'airing-today'],
    queryFn: () => tvApi.getAiringToday(1),
    staleTime: 30 * 60 * 1000,
  });

  // People queries
  const popularPeopleQuery = useQuery({
    queryKey: ['tmdb', 'people', 'popular'],
    queryFn: () => peopleApi.getPopular(1),
    staleTime: 30 * 60 * 1000,
  });

  // Trending queries
  const trendingMoviesQuery = useQuery({
    queryKey: ['tmdb', 'trending', 'movies'],
    queryFn: () => trendingApi.getTrending('movie', 'week', 1),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const trendingTvShowsQuery = useQuery({
    queryKey: ['tmdb', 'trending', 'tv'],
    queryFn: () => trendingApi.getTrending('tv', 'week', 1),
    staleTime: 60 * 60 * 1000,
  });

  const trendingPeopleQuery = useQuery({
    queryKey: ['tmdb', 'trending', 'people'],
    queryFn: () => trendingApi.getTrending('person', 'week', 1),
    staleTime: 60 * 60 * 1000,
  });

  // Check if any query is loading
  const isQueriesLoading = [
    popularMoviesQuery.isLoading,
    topRatedMoviesQuery.isLoading,
    nowPlayingMoviesQuery.isLoading,
    upcomingMoviesQuery.isLoading,
    popularTvShowsQuery.isLoading,
    topRatedTvShowsQuery.isLoading,
    onTheAirTvShowsQuery.isLoading,
    airingTodayTvShowsQuery.isLoading,
    popularPeopleQuery.isLoading,
    trendingMoviesQuery.isLoading,
    trendingTvShowsQuery.isLoading,
    trendingPeopleQuery.isLoading,
  ].some(Boolean);

  // Handle data updates with useEffect
  useEffect(() => {
    if (popularMoviesQuery.data?.results) {
      console.log('Setting popular movies:', popularMoviesQuery.data.results.length);
      setPopularMovies(popularMoviesQuery.data.results);
    }
  }, [popularMoviesQuery.data, setPopularMovies]);

  useEffect(() => {
    if (topRatedMoviesQuery.data?.results) {
      setTopRatedMovies(topRatedMoviesQuery.data.results);
    }
  }, [topRatedMoviesQuery.data, setTopRatedMovies]);

  useEffect(() => {
    if (nowPlayingMoviesQuery.data?.results) {
      setNowPlayingMovies(nowPlayingMoviesQuery.data.results);
    }
  }, [nowPlayingMoviesQuery.data, setNowPlayingMovies]);

  useEffect(() => {
    if (upcomingMoviesQuery.data?.results) {
      setUpcomingMovies(upcomingMoviesQuery.data.results);
    }
  }, [upcomingMoviesQuery.data, setUpcomingMovies]);

  useEffect(() => {
    if (popularTvShowsQuery.data?.results) {
      setPopularTvShows(popularTvShowsQuery.data.results);
    }
  }, [popularTvShowsQuery.data, setPopularTvShows]);

  useEffect(() => {
    if (topRatedTvShowsQuery.data?.results) {
      setTopRatedTvShows(topRatedTvShowsQuery.data.results);
    }
  }, [topRatedTvShowsQuery.data, setTopRatedTvShows]);

  useEffect(() => {
    if (onTheAirTvShowsQuery.data?.results) {
      setOnTheAirTvShows(onTheAirTvShowsQuery.data.results);
    }
  }, [onTheAirTvShowsQuery.data, setOnTheAirTvShows]);

  useEffect(() => {
    if (airingTodayTvShowsQuery.data?.results) {
      setAiringTodayTvShows(airingTodayTvShowsQuery.data.results);
    }
  }, [airingTodayTvShowsQuery.data, setAiringTodayTvShows]);

  useEffect(() => {
    if (popularPeopleQuery.data?.results) {
      setPopularPeople(popularPeopleQuery.data.results);
    }
  }, [popularPeopleQuery.data, setPopularPeople]);

  useEffect(() => {
    if (trendingMoviesQuery.data?.results) {
      setTrendingMovies(trendingMoviesQuery.data.results as Movie[]);
    }
  }, [trendingMoviesQuery.data, setTrendingMovies]);

  useEffect(() => {
    if (trendingTvShowsQuery.data?.results) {
      setTrendingTvShows(trendingTvShowsQuery.data.results as TVShow[]);
    }
  }, [trendingTvShowsQuery.data, setTrendingTvShows]);

  useEffect(() => {
    if (trendingPeopleQuery.data?.results) {
      setTrendingPeople(trendingPeopleQuery.data.results as Person[]);
    }
  }, [trendingPeopleQuery.data, setTrendingPeople]);

  // Handle errors
  useEffect(() => {
    const error = popularMoviesQuery.error || 
                 topRatedMoviesQuery.error || 
                 nowPlayingMoviesQuery.error || 
                 upcomingMoviesQuery.error ||
                 popularTvShowsQuery.error ||
                 topRatedTvShowsQuery.error ||
                 onTheAirTvShowsQuery.error ||
                 airingTodayTvShowsQuery.error ||
                 popularPeopleQuery.error ||
                 trendingMoviesQuery.error ||
                 trendingTvShowsQuery.error ||
                 trendingPeopleQuery.error;
    
    if (error) {
      setError(error.message);
    }
  }, [
    popularMoviesQuery.error,
    topRatedMoviesQuery.error,
    nowPlayingMoviesQuery.error,
    upcomingMoviesQuery.error,
    popularTvShowsQuery.error,
    topRatedTvShowsQuery.error,
    onTheAirTvShowsQuery.error,
    airingTodayTvShowsQuery.error,
    popularPeopleQuery.error,
    trendingMoviesQuery.error,
    trendingTvShowsQuery.error,
    trendingPeopleQuery.error,
    setError
  ]);

  // Update loading state
  useEffect(() => {
    setLoading(isQueriesLoading);
  }, [isQueriesLoading, setLoading]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return {
    // Configuration
    configuration: configurationQuery.data,
    
    // Movies - using store data
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    
    // TV Shows - using store data
    popularTvShows,
    topRatedTvShows,
    onTheAirTvShows,
    airingTodayTvShows,
    
    // People - using store data
    popularPeople,
    
    // Trending - using store data
    trendingMovies,
    trendingTvShows,
    trendingPeople,
    
    // Loading states
    isLoading,
    isConfigurationLoading: configurationQuery.isLoading,
    
    // Error states
    error: error || popularMoviesQuery.error || 
           topRatedMoviesQuery.error || 
           nowPlayingMoviesQuery.error || 
           upcomingMoviesQuery.error ||
           popularTvShowsQuery.error ||
           topRatedTvShowsQuery.error ||
           onTheAirTvShowsQuery.error ||
           airingTodayTvShowsQuery.error ||
           popularPeopleQuery.error ||
           trendingMoviesQuery.error ||
           trendingTvShowsQuery.error ||
           trendingPeopleQuery.error,
    
    // Refetch functions
    refetchAll: () => {
      popularMoviesQuery.refetch();
      topRatedMoviesQuery.refetch();
      nowPlayingMoviesQuery.refetch();
      upcomingMoviesQuery.refetch();
      popularTvShowsQuery.refetch();
      topRatedTvShowsQuery.refetch();
      onTheAirTvShowsQuery.refetch();
      airingTodayTvShowsQuery.refetch();
      popularPeopleQuery.refetch();
      trendingMoviesQuery.refetch();
      trendingTvShowsQuery.refetch();
      trendingPeopleQuery.refetch();
    },
  };
};

// Search hook
export const useTMDBSearch = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['tmdb', 'search', query],
    queryFn: () => searchApi.multi(query, 1),
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
