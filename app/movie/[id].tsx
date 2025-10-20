import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CastCrewList, MediaSection } from '../../components';
import { getBackdropUrl, getPosterUrl } from '../../config/tmdb';
import { useMovieDetails } from '../../hooks';
import { useMovieStore } from '../../stores/movieStore';

const { height } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movieId = parseInt(id || '0', 10);

  const {
    movieDetails,
    credits,
    similarMovies,
    recommendations,
    isLoading,
    error,
    refetch,
  } = useMovieDetails(movieId);

  const { favoriteMovies, watchlistMovies, addFavoriteMovie, removeFavoriteMovie, addToWatchlistMovie, removeFromWatchlistMovie } = useMovieStore();
  
  const isFavorite = favoriteMovies.some(fav => fav.id === movieId);
  const isInWatchlist = watchlistMovies.some(watch => watch.id === movieId);

  const handleFavoritePress = () => movieDetails && (isFavorite ? removeFavoriteMovie(movieId) : addFavoriteMovie(movieDetails));
  const handleWatchlistPress = () => movieDetails && (isInWatchlist ? removeFromWatchlistMovie(movieId) : addToWatchlistMovie(movieDetails));
  const handleBackPress = () => router.back();
  const handleItemPress = (item: any) => {
    if ('profile_path' in item || 'known_for_department' in item) router.push(`/person/${item.id}`);
    else if ('title' in item) router.push(`/movie/${item.id}`);
    else router.push(`/tv/${item.id}`);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#FF6B35" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {typeof error === 'string' ? error : error.message}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !movieDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const backdropUrl = getBackdropUrl(movieDetails.backdrop_path, 'w1280');
  const posterUrl = getPosterUrl(movieDetails.poster_path, 'w500');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
      >
        {/* Header with backdrop */}
        <View style={styles.header}>
          {backdropUrl && (
            <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          )}
          <View style={styles.backdropOverlay} />
          
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFavoritePress}
            >
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#FF6B35" : "#fff"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWatchlistPress}
            >
              <MaterialCommunityIcons
                name={isInWatchlist ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isInWatchlist ? "#FF6B35" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie info */}
        <View style={styles.content}>
          <View style={styles.movieInfo}>
            <View style={styles.posterContainer}>
              {posterUrl && (
                <Image source={{ uri: posterUrl }} style={styles.poster} />
              )}
            </View>
            
            <View style={styles.movieDetails}>
              <Text style={styles.title}>{movieDetails.title}</Text>
              <Text style={styles.originalTitle}>{movieDetails.original_title}</Text>
              
              <View style={styles.metaInfo}>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{movieDetails.vote_average.toFixed(1)}</Text>
                  <Text style={styles.voteCount}>({movieDetails.vote_count} votes)</Text>
                </View>
                
                <Text style={styles.year}>
                  {new Date(movieDetails.release_date).getFullYear()}
                </Text>
                
                <Text style={styles.runtime}>
                  {movieDetails.runtime} min
                </Text>
              </View>

              <View style={styles.genres}>
                {movieDetails.genres.map((genre: any) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movieDetails.overview}</Text>
          </View>

          {/* Tagline */}
          {movieDetails.tagline && (
            <View style={styles.section}>
              <Text style={styles.tagline}>&ldquo;{movieDetails.tagline}&rdquo;</Text>
            </View>
          )}

          {/* Cast */}
          {credits?.cast && credits.cast.length > 0 && (
            <CastCrewList
              title="Cast"
              data={credits.cast}
              type="cast"
              onItemPress={handleItemPress}
            />
          )}

          {/* Crew */}
          {credits?.crew && credits.crew.length > 0 && (
            <CastCrewList
              title="Crew"
              data={credits.crew}
              type="crew"
              onItemPress={handleItemPress}
            />
          )}

          {/* Similar Movies */}
          {similarMovies && similarMovies.length > 0 && (
            <MediaSection
              title="Similar Movies"
              data={similarMovies}
              type="movie"
              onItemPress={handleItemPress}
            />
          )}

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <MediaSection
              title="Recommendations"
              data={recommendations}
              type="movie"
              onItemPress={handleItemPress}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: height * 0.4,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  actionButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  movieInfo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  posterContainer: {
    marginRight: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  originalTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  year: {
    fontSize: 16,
    color: '#666',
    marginRight: 16,
  },
  runtime: {
    fontSize: 16,
    color: '#666',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tagline: {
    fontSize: 16,
    color: '#FF6B35',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});
