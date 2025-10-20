import { useQuery } from '@tanstack/react-query';
import { tvApi } from '../services/tmdb';

interface TVShowCredits {
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

export const useTVShowDetails = (tvShowId: number) => {
  // TV show details query
  const tvShowDetailsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'details', tvShowId],
    queryFn: () => tvApi.getDetails(tvShowId),
    enabled: tvShowId > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // TV show credits query
  const creditsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'credits', tvShowId],
    queryFn: () => tvApi.getCredits(tvShowId),
    enabled: tvShowId > 0,
    staleTime: 30 * 60 * 1000,
  });

  // Similar TV shows query
  const similarTvShowsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'similar', tvShowId],
    queryFn: () => tvApi.getSimilar(tvShowId, 1),
    enabled: tvShowId > 0,
    staleTime: 30 * 60 * 1000,
  });

  // Recommendations query
  const recommendationsQuery = useQuery({
    queryKey: ['tmdb', 'tv', 'recommendations', tvShowId],
    queryFn: () => tvApi.getRecommendations(tvShowId, 1),
    enabled: tvShowId > 0,
    staleTime: 30 * 60 * 1000,
  });

  const isLoading = 
    tvShowDetailsQuery.isLoading || 
    creditsQuery.isLoading || 
    similarTvShowsQuery.isLoading || 
    recommendationsQuery.isLoading;

  const error = 
    tvShowDetailsQuery.error || 
    creditsQuery.error || 
    similarTvShowsQuery.error || 
    recommendationsQuery.error;

  const refetch = () => {
    tvShowDetailsQuery.refetch();
    creditsQuery.refetch();
    similarTvShowsQuery.refetch();
    recommendationsQuery.refetch();
  };

  return {
    tvShowDetails: tvShowDetailsQuery.data,
    credits: creditsQuery.data as TVShowCredits | undefined,
    similarTvShows: similarTvShowsQuery.data?.results || [],
    recommendations: recommendationsQuery.data?.results || [],
    isLoading,
    error,
    refetch,
  };
};
