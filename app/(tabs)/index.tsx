import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaSection } from '../../components/MediaSection';
import { useTMDBData } from '../../hooks/useTMDBData';
import { Movie, Person, TVShow } from '../../types/tmdb';

export default function HomeScreen() {
  const {
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
    refetchAll,
  } = useTMDBData();

  // Debug logging
  console.log('HomeScreen Debug:', {
    isLoading,
    error,
    popularMoviesLength: popularMovies.length,
    trendingMoviesLength: trendingMovies.length,
    popularTvShowsLength: popularTvShows.length,
    trendingTvShowsLength: trendingTvShows.length,
    popularPeopleLength: popularPeople.length,
    trendingPeopleLength: trendingPeople.length,
  });

  const handleItemPress = (item: Movie | TVShow | Person) => {
    // TODO: Navigate to detail screen
    Alert.alert('Item Selected', `You selected: ${'title' in item ? item.title : 'name' in item ? item.name : 'Unknown'}`);
  };

  const handleViewAllPress = (type: string) => {
    // TODO: Navigate to full list screen
    Alert.alert('View All', `View all ${type}`);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#FF6B35" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {typeof error === 'string' ? error : error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={48} color="#FF6B35" />
          <Text style={styles.loadingTitle}>Loading content...</Text>
          <Text style={styles.loadingSubtitle}>Fetching the latest movies, TV shows, and celebrities</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetchAll}
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Welcome to Infomovia!</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover the latest movies, TV shows, and celebrities
          </Text>
        </View>

        {/* Debug Info - Remove in production */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Debug: Movies: {popularMovies.length}, TV: {popularTvShows.length}, People: {popularPeople.length}
          </Text>
        </View>

        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <MediaSection
            title="Trending Movies"
            data={trendingMovies}
            type="movie"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('trending movies')}
          />
        )}

        {/* Now Playing Movies */}
        {nowPlayingMovies.length > 0 && (
          <MediaSection
            title="Now Playing"
            data={nowPlayingMovies}
            type="movie"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('now playing movies')}
          />
        )}

        {/* Popular Movies */}
        {popularMovies.length > 0 && (
          <MediaSection
            title="Popular Movies"
            data={popularMovies}
            type="movie"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('popular movies')}
          />
        )}

        {/* Top Rated Movies */}
        {topRatedMovies.length > 0 && (
          <MediaSection
            title="Top Rated Movies"
            data={topRatedMovies}
            type="movie"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('top rated movies')}
          />
        )}

        {/* Upcoming Movies */}
        {upcomingMovies.length > 0 && (
          <MediaSection
            title="Upcoming Movies"
            data={upcomingMovies}
            type="movie"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('upcoming movies')}
          />
        )}

        {/* Trending TV Shows */}
        {trendingTvShows.length > 0 && (
          <MediaSection
            title="Trending TV Shows"
            data={trendingTvShows}
            type="tv"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('trending tv shows')}
          />
        )}

        {/* On The Air TV Shows */}
        {onTheAirTvShows.length > 0 && (
          <MediaSection
            title="On The Air"
            data={onTheAirTvShows}
            type="tv"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('on the air tv shows')}
          />
        )}

        {/* Popular TV Shows */}
        {popularTvShows.length > 0 && (
          <MediaSection
            title="Popular TV Shows"
            data={popularTvShows}
            type="tv"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('popular tv shows')}
          />
        )}

        {/* Top Rated TV Shows */}
        {topRatedTvShows.length > 0 && (
          <MediaSection
            title="Top Rated TV Shows"
            data={topRatedTvShows}
            type="tv"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('top rated tv shows')}
          />
        )}

        {/* Airing Today TV Shows */}
        {airingTodayTvShows.length > 0 && (
          <MediaSection
            title="Airing Today"
            data={airingTodayTvShows}
            type="tv"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('airing today tv shows')}
          />
        )}

        {/* Trending People */}
        {trendingPeople.length > 0 && (
          <MediaSection
            title="Trending People"
            data={trendingPeople}
            type="person"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('trending people')}
          />
        )}

        {/* Popular People */}
        {popularPeople.length > 0 && (
          <MediaSection
            title="Popular People"
            data={popularPeople}
            type="person"
            onItemPress={handleItemPress}
            onViewAllPress={() => handleViewAllPress('popular people')}
          />
        )}

        {/* Fallback content when no data */}
        {popularMovies.length === 0 && popularTvShows.length === 0 && popularPeople.length === 0 && (
          <View style={styles.fallbackContainer}>
            <MaterialCommunityIcons name="movie-open" size={64} color="#666" />
            <Text style={styles.fallbackTitle}>No content available</Text>
            <Text style={styles.fallbackSubtitle}>
              Make sure you have a valid TMDB API key configured
            </Text>
            <Text style={styles.fallbackText}>
              Check the console for debug information
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFCC00', // theme-light color
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
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
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
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
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 16,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
