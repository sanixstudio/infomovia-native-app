import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaSection } from '../../components/MediaSection';
import { useTMDBData } from '../../hooks/useTMDBData';

type MovieCategory = 'trending' | 'popular' | 'top-rated' | 'now-playing' | 'upcoming';

const CATEGORY_CONFIG = {
  'trending': {
    title: 'Trending Movies',
    dataKey: 'trendingMovies' as const,
    description: 'Movies that are trending right now'
  },
  'popular': {
    title: 'Popular Movies',
    dataKey: 'popularMovies' as const,
    description: 'Most popular movies'
  },
  'top-rated': {
    title: 'Top Rated Movies',
    dataKey: 'topRatedMovies' as const,
    description: 'Highest rated movies'
  },
  'now-playing': {
    title: 'Now Playing',
    dataKey: 'nowPlayingMovies' as const,
    description: 'Movies currently in theaters'
  },
  'upcoming': {
    title: 'Upcoming Movies',
    dataKey: 'upcomingMovies' as const,
    description: 'Movies coming soon'
  }
} as const;

export default function MoviesListScreen() {
  const { category } = useLocalSearchParams<{ category: MovieCategory }>();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'year'>('default');

  const {
    trendingMovies,
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    isLoading,
    error,
    refetchAll,
  } = useTMDBData();

  const config = CATEGORY_CONFIG[category || 'popular'];
  const movies = {
    trendingMovies,
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
  }[config.dataKey];

  const sortedMovies = React.useMemo(() => {
    if (!movies) return [];
    
    switch (sortBy) {
      case 'rating':
        return [...movies].sort((a, b) => b.vote_average - a.vote_average);
      case 'year':
        return [...movies].sort((a, b) => {
          const yearA = new Date(a.release_date).getFullYear();
          const yearB = new Date(b.release_date).getFullYear();
          return yearB - yearA;
        });
      default:
        return movies;
    }
  }, [movies, sortBy]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSortPress = (newSort: typeof sortBy) => {
    setSortBy(newSort);
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
          <TouchableOpacity style={styles.retryButton} onPress={() => refetchAll()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !movies) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={48} color="#FF6B35" />
          <Text style={styles.loadingTitle}>Loading movies...</Text>
          <Text style={styles.loadingSubtitle}>{config.description}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.description}</Text>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {[
            { key: 'default', label: 'Default' },
            { key: 'rating', label: 'Rating' },
            { key: 'year', label: 'Year' }
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.sortButton,
                sortBy === key && styles.activeSortButton
              ]}
              onPress={() => handleSortPress(key as typeof sortBy)}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === key && styles.activeSortButtonText
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Movies List */}
      <View style={styles.content}>
        <MediaSection
          title={`${config.title} (${sortedMovies.length})`}
          data={sortedMovies}
          type="movie"
          showViewAll={false}
          horizontal={false}
          refreshing={isLoading}
          onRefresh={refetchAll}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showing {sortedMovies.length} movies
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFCC00', // theme-light color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  activeSortButton: {
    backgroundColor: '#FF6B35',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
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
    padding: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});
