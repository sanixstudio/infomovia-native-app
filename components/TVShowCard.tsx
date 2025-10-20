import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPosterUrl } from '../config/tmdb';
import { useMovieStore } from '../stores/movieStore';
import { TVShow } from '../types/tmdb';

interface TVShowCardProps {
  tvShow: TVShow;
  onPress?: (tvShow: TVShow) => void;
  showFavoriteButton?: boolean;
  showWatchlistButton?: boolean;
}

export const TVShowCard: React.FC<TVShowCardProps> = ({
  tvShow,
  onPress,
  showFavoriteButton = true,
  showWatchlistButton = true,
}) => {
  const router = useRouter();
  const { favoriteTvShows, watchlistTvShows, addFavoriteTvShow, removeFavoriteTvShow, addToWatchlistTvShow, removeFromWatchlistTvShow } = useMovieStore();
  
  const isFavorite = favoriteTvShows.some(fav => fav.id === tvShow.id);
  const isInWatchlist = watchlistTvShows.some(watch => watch.id === tvShow.id);

  const handleFavoritePress = () => isFavorite ? removeFavoriteTvShow(tvShow.id) : addFavoriteTvShow(tvShow);
  const handleWatchlistPress = () => isInWatchlist ? removeFromWatchlistTvShow(tvShow.id) : addToWatchlistTvShow(tvShow);
  const handleCardPress = () => onPress ? onPress(tvShow) : router.push(`/tv/${tvShow.id}`);

  const posterUrl = getPosterUrl(tvShow.poster_path, 'w342');

  return (
    <Link href={`/tv/${tvShow.id}`} asChild>
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
            <MaterialCommunityIcons name="television" size={40} color="#666" />
          </View>
        )}
        
        {/* Action buttons overlay */}
        <View style={styles.actionButtons}>
          {showFavoriteButton && (
            <TouchableOpacity
              style={styles.actionButton}
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
              style={styles.actionButton}
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
          {tvShow.name}
        </Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{tvShow.vote_average.toFixed(1)}</Text>
          </View>
          
          <Text style={styles.year}>
            {tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A'}
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
