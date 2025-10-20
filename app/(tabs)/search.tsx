import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaSection } from '../../components/MediaSection';
import { useTMDBSearch } from '../../hooks/useTMDBData';

type SearchFilter = 'all' | 'movie' | 'tv' | 'person';


export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data: searchResults, isLoading, error } = useTMDBSearch(
    searchQuery,
    searchQuery.length > 2
  );

  // Load search history from storage on mount
  useEffect(() => {
    // TODO: Load from AsyncStorage
  }, []);

  // Save search to history
  const handleSearch = (query: string) => {
    if (query.trim().length > 2) {
      setSearchHistory(prev => {
        const newHistory = [query.trim(), ...prev.filter(item => item !== query.trim())].slice(0, 10);
        // TODO: Save to AsyncStorage
        return newHistory;
      });
    }
  };

  // Filter results based on active filter
  const getFilteredResults = (): any[] => {
    if (!searchResults?.results) return [];
    
    switch (activeFilter) {
      case 'movie':
        return searchResults.results.filter((item: any) => item.media_type === 'movie');
      case 'tv':
        return searchResults.results.filter((item: any) => item.media_type === 'tv');
      case 'person':
        return searchResults.results.filter((item: any) => item.media_type === 'person');
      default:
        return searchResults.results;
    }
  };

  const filteredResults = getFilteredResults();

  const renderFilterButton = (filter: SearchFilter, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={activeFilter === filter ? '#fff' : '#666'}
      />
      <Text style={[
        styles.filterButtonText,
        activeFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSearchHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Recent Searches</Text>
      {searchHistory.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyItem}
          onPress={() => {
            setSearchQuery(item);
            handleSearch(item);
          }}
        >
          <MaterialCommunityIcons name="history" size={16} color="#666" />
          <Text style={styles.historyText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="magnify" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery.length > 2 ? 'No results found' : 'Search for movies, TV shows, and people'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.length > 2 
          ? 'Try a different search term or check your spelling'
          : 'Enter at least 3 characters to start searching'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your favorite content</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies, TV shows, people..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <MaterialCommunityIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Filters */}
      {searchQuery.length > 2 && (
        <View style={styles.filtersContainer}>
          {renderFilterButton('all', 'All', 'view-grid')}
          {renderFilterButton('movie', 'Movies', 'movie')}
          {renderFilterButton('tv', 'TV Shows', 'television')}
          {renderFilterButton('person', 'People', 'account')}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {searchQuery.length === 0 ? (
          renderSearchHistory()
        ) : searchQuery.length <= 2 ? (
          renderEmptyState()
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#FF6B35" />
            <Text style={styles.errorTitle}>Search failed</Text>
            <Text style={styles.errorMessage}>
              {typeof error === 'string' ? error : error.message}
            </Text>
          </View>
        ) : filteredResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="magnify" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search term or check your spelling
            </Text>
            <Text style={styles.emptyHint}>
              Current filter: {activeFilter === 'all' ? 'All' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsScrollContent}
          >
            {/* Results Header */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </Text>
            </View>

            {/* Grouped Results */}
            {(() => {
              // Group results by type
              const groupedResults = filteredResults.reduce((acc: any, item: any) => {
                const type = item.media_type;
                if (!acc[type]) {
                  acc[type] = [];
                }
                
                // Convert search result to appropriate type
                let convertedItem: any;
                
                if (type === 'person') {
                  convertedItem = {
                    id: item.id,
                    name: item.name || '',
                    profile_path: item.profile_path,
                    known_for_department: item.known_for_department || 'Acting',
                    popularity: item.popularity || 0,
                    adult: item.adult || false,
                    gender: 0,
                    known_for: [],
                  };
                } else if (type === 'tv') {
                  convertedItem = {
                    id: item.id,
                    name: item.name || '',
                    poster_path: item.poster_path,
                    vote_average: item.vote_average || 0,
                    first_air_date: item.first_air_date || '',
                    adult: item.adult || false,
                    backdrop_path: item.backdrop_path,
                    genre_ids: item.genre_ids || [],
                    origin_country: item.origin_country || [],
                    original_language: item.original_language || 'en',
                    original_name: item.original_name || item.name || '',
                    overview: item.overview || '',
                    popularity: item.popularity || 0,
                    vote_count: 0,
                  };
                } else {
                  convertedItem = {
                    id: item.id,
                    title: item.title || '',
                    poster_path: item.poster_path,
                    vote_average: item.vote_average || 0,
                    release_date: item.release_date || '',
                    adult: item.adult || false,
                    backdrop_path: item.backdrop_path,
                    genre_ids: item.genre_ids || [],
                    original_language: item.original_language || 'en',
                    original_title: item.original_title || item.title || '',
                    overview: item.overview || '',
                    popularity: item.popularity || 0,
                    vote_count: 0,
                    video: item.video || false,
                  };
                }
                
                acc[type].push(convertedItem);
                return acc;
              }, {});

              // Render grouped results
              return Object.entries(groupedResults).map(([type, items]: [string, any]) => (
                <View key={type} style={styles.resultGroup}>
                  <MediaSection
                    title={`${type.charAt(0).toUpperCase() + type.slice(1)}s (${items.length})`}
                    data={items}
                    type={type as 'movie' | 'tv' | 'person'}
                    showViewAll={false}
                    horizontal={false}
                  />
                </View>
              ));
            })()}
          </ScrollView>
        )}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  historyContainer: {
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
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
  resultsContainer: {
    flex: 1,
  },
  resultsScrollContent: {
    paddingBottom: 20,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resultGroup: {
    marginBottom: 24,
  },
});
