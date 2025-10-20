import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../services/tmdb';

interface MovieCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export const useMovieDetails = (movieId: number) => {
  // Movie details query
  const movieDetailsQuery = useQuery({
    queryKey: ['tmdb', 'movie', 'details', movieId],
    queryFn: () => moviesApi.getDetails(movieId),
    enabled: movieId > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Movie credits query
  const creditsQuery = useQuery({
    queryKey: ['tmdb', 'movie', 'credits', movieId],
    queryFn: () => moviesApi.getCredits(movieId),
    enabled: movieId > 0,
    staleTime: 30 * 60 * 1000,
  });

  // Similar movies query
  const similarMoviesQuery = useQuery({
    queryKey: ['tmdb', 'movie', 'similar', movieId],
    queryFn: () => moviesApi.getSimilar(movieId, 1),
    enabled: movieId > 0,
    staleTime: 30 * 60 * 1000,
  });

  // Recommendations query
  const recommendationsQuery = useQuery({
    queryKey: ['tmdb', 'movie', 'recommendations', movieId],
    queryFn: () => moviesApi.getRecommendations(movieId, 1),
    enabled: movieId > 0,
    staleTime: 30 * 60 * 1000,
  });

  const isLoading = 
    movieDetailsQuery.isLoading || 
    creditsQuery.isLoading || 
    similarMoviesQuery.isLoading || 
    recommendationsQuery.isLoading;

  const error = 
    movieDetailsQuery.error || 
    creditsQuery.error || 
    similarMoviesQuery.error || 
    recommendationsQuery.error;

  const refetch = () => {
    movieDetailsQuery.refetch();
    creditsQuery.refetch();
    similarMoviesQuery.refetch();
    recommendationsQuery.refetch();
  };

  return {
    movieDetails: movieDetailsQuery.data,
    credits: creditsQuery.data as MovieCredits | undefined,
    similarMovies: similarMoviesQuery.data?.results || [],
    recommendations: recommendationsQuery.data?.results || [],
    isLoading,
    error,
    refetch,
  };
};
