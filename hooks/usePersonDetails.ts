import { useQuery } from '@tanstack/react-query';
import { peopleApi } from '../services/tmdb';

export const usePersonDetails = (personId: number) => {
  // Person details query
  const personDetailsQuery = useQuery({
    queryKey: ['tmdb', 'person', 'details', personId],
    queryFn: () => peopleApi.getDetails(personId),
    enabled: personId > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Person movie credits query
  const movieCreditsQuery = useQuery({
    queryKey: ['tmdb', 'person', 'movie-credits', personId],
    queryFn: () => peopleApi.getMovieCredits(personId),
    enabled: personId > 0,
    staleTime: 30 * 60 * 1000,
  });

  // Person TV credits query
  const tvCreditsQuery = useQuery({
    queryKey: ['tmdb', 'person', 'tv-credits', personId],
    queryFn: () => peopleApi.getTvCredits(personId),
    enabled: personId > 0,
    staleTime: 30 * 60 * 1000,
  });

  const isLoading = 
    personDetailsQuery.isLoading || 
    movieCreditsQuery.isLoading || 
    tvCreditsQuery.isLoading;

  const error = 
    personDetailsQuery.error || 
    movieCreditsQuery.error || 
    tvCreditsQuery.error;

  const refetch = () => {
    personDetailsQuery.refetch();
    movieCreditsQuery.refetch();
    tvCreditsQuery.refetch();
  };

  // Get movie credits sorted by popularity/release date
  const movieCredits = movieCreditsQuery.data?.cast
    ?.sort((a: any, b: any) => {
      // Sort by release date (newest first) or popularity
      if (a.release_date && b.release_date) {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      }
      return (b.popularity || 0) - (a.popularity || 0);
    })
    ?.slice(0, 20) || []; // Limit to 20 most relevant

  // Get TV credits sorted by popularity/first air date
  const tvCredits = tvCreditsQuery.data?.cast
    ?.sort((a: any, b: any) => {
      // Sort by first air date (newest first) or popularity
      if (a.first_air_date && b.first_air_date) {
        return new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime();
      }
      return (b.popularity || 0) - (a.popularity || 0);
    })
    ?.slice(0, 20) || []; // Limit to 20 most relevant

  return {
    personDetails: personDetailsQuery.data,
    movieCredits,
    tvCredits,
    isLoading,
    error,
    refetch,
  };
};
