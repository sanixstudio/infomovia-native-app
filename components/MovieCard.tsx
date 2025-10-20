import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPosterUrl } from '../config/tmdb';
import { useMovieStore } from '../stores/movieStore';
import { Movie } from '../types/tmdb';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
  showFavoriteButton?: boolean;
  showWatchlistButton?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  showFavoriteButton = true,
  showWatchlistButton = true,
}) => {
  const router = useRouter();
  const {
    isFavoriteMovie,
    isInWatchlistMovie,
    addFavoriteMovie,
    removeFavoriteMovie,
    addToWatchlistMovie,
    removeFromWatchlistMovie,
  } = useMovieStore();

  const isFavorite = isFavoriteMovie(movie.id);
  const isInWatchlist = isInWatchlistMovie(movie.id);

  const handleFavoritePress = () => {
    if (isFavorite) {
      removeFavoriteMovie(movie.id);
    } else {
      addFavoriteMovie(movie);
    }
  };

  const handleWatchlistPress = () => {
    if (isInWatchlist) {
      removeFromWatchlistMovie(movie.id);
    } else {
      addToWatchlistMovie(movie);
    }
  };

  const handleCardPress = () => {
    console.log('MovieCard pressed, onPress:', !!onPress, 'movie id:', movie.id);
    if (onPress) {
      onPress(movie);
    } else {
      console.log('Navigating to:', `/movie/${movie.id}`);
      router.push(`/movie/${movie.id}`);
    }
  };

  const posterUrl = getPosterUrl(movie.poster_path, 'w342');

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <TouchableOpacity
        style={styles.container}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
      <View style={styles.imageContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="movie" size={40} color="#666" />
          </View>
        )}
        
        {/* Action buttons overlay */}
        <View style={styles.actionButtons}>
          {showFavoriteButton && (
            <TouchableOpacity
              style={[styles.actionButton, isFavorite && styles.activeButton]}
              onPress={handleFavoritePress}
            >
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#FF6B35" : "#fff"}
              />
            </TouchableOpacity>
          )}
          
          {showWatchlistButton && (
            <TouchableOpacity
              style={[styles.actionButton, isInWatchlist && styles.activeButton]}
              onPress={handleWatchlistPress}
            >
              <MaterialCommunityIcons
                name={isInWatchlist ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isInWatchlist ? "#FF6B35" : "#fff"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          </View>
          
          <Text style={styles.year}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 12,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  poster: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
  },
  content: {
    paddingTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  year: {
    fontSize: 12,
    color: '#666',
  },
});
