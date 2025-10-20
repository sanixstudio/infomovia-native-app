import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaSection } from '../../components/MediaSection';
import { useMovieStore } from '../../stores/movieStore';

type TabType = 'favorites' | 'watchlist';

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  
  const {
    favoriteMovies,
    favoriteTvShows,
    favoritePeople,
    watchlistMovies,
    watchlistTvShows,
  } = useMovieStore();

  const favoritesCount = favoriteMovies.length + favoriteTvShows.length + favoritePeople.length;
  const watchlistCount = watchlistMovies.length + watchlistTvShows.length;

  const renderTabButton = (tab: TabType, title: string, count: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = (type: string) => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name={type === 'favorites' ? 'heart-outline' : 'bookmark-outline'} 
        size={64} 
        color="#ccc" 
      />
      <Text style={styles.emptyTitle}>No {type} yet</Text>
      <Text style={styles.emptySubtitle}>
        {type === 'favorites' 
          ? 'Start adding movies, TV shows, and people to your favorites!'
          : 'Add movies and TV shows to your watchlist to see them here.'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.subtitle}>Your favorite movies, TV shows, and people</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('favorites', 'Favorites', favoritesCount)}
        {renderTabButton('watchlist', 'Watchlist', watchlistCount)}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {}}
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
      >
        {activeTab === 'favorites' ? (
          <>
            {/* Favorite Movies */}
            {favoriteMovies.length > 0 && (
              <MediaSection
                title="Favorite Movies"
                data={favoriteMovies}
                type="movie"
                showViewAll={false}
              />
            )}

            {/* Favorite TV Shows */}
            {favoriteTvShows.length > 0 && (
              <MediaSection
                title="Favorite TV Shows"
                data={favoriteTvShows}
                type="tv"
                showViewAll={false}
              />
            )}

            {/* Favorite People */}
            {favoritePeople.length > 0 && (
              <MediaSection
                title="Favorite People"
                data={favoritePeople}
                type="person"
                showViewAll={false}
              />
            )}

            {/* Empty State for Favorites */}
            {favoritesCount === 0 && renderEmptyState('favorites')}
          </>
        ) : (
          <>
            {/* Watchlist Movies */}
            {watchlistMovies.length > 0 && (
              <MediaSection
                title="Movies to Watch"
                data={watchlistMovies}
                type="movie"
                showViewAll={false}
              />
            )}

            {/* Watchlist TV Shows */}
            {watchlistTvShows.length > 0 && (
              <MediaSection
                title="TV Shows to Watch"
                data={watchlistTvShows}
                type="tv"
                showViewAll={false}
              />
            )}

            {/* Empty State for Watchlist */}
            {watchlistCount === 0 && renderEmptyState('watchlist')}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFCC00', // theme-light color
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
