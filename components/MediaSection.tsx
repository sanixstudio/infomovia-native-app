import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Movie, Person, TVShow } from '../types/tmdb';
import { MovieCard } from './MovieCard';
import { PersonCard } from './PersonCard';
import { TVShowCard } from './TVShowCard';

interface MediaSectionProps {
  title: string;
  data: Movie[] | TVShow[] | Person[];
  type: 'movie' | 'tv' | 'person';
  onItemPress?: (item: Movie | TVShow | Person) => void;
  onViewAllPress?: () => void;
  showViewAll?: boolean;
  horizontal?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  data,
  type,
  onItemPress,
  onViewAllPress,
  showViewAll = true,
  horizontal = true,
  refreshing = false,
  onRefresh,
}) => {
  const renderItem = ({ item }: { item: Movie | TVShow | Person }) => {
    switch (type) {
      case 'movie':
        return (
          <MovieCard
            movie={item as Movie}
            onPress={onItemPress}
          />
        );
      case 'tv':
        return (
          <TVShowCard
            tvShow={item as TVShow}
            onPress={onItemPress}
          />
        );
      case 'person':
        return (
          <PersonCard
            person={item as Person}
            onPress={onItemPress}
          />
        );
      default:
        return null;
    }
  };

  const getItemLayout = horizontal ? (_: any, index: number) => {
    const itemWidth = 160; // All cards are medium size (160px)
    const margin = 12;
    return {
      length: itemWidth + margin,
      offset: (itemWidth + margin) * index,
      index,
    };
  } : undefined;

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No {type}s available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showViewAll && onViewAllPress && (
          <TouchableOpacity onPress={onViewAllPress} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#FF6B35" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${type}-${item.id}-${index}`}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={horizontal ? styles.listContainer : styles.verticalListContainer}
        getItemLayout={getItemLayout}
        initialNumToRender={horizontal ? 5 : 10}
        maxToRenderPerBatch={horizontal ? 10 : 20}
        windowSize={horizontal ? 10 : 20}
        removeClippedSubviews={horizontal}
        numColumns={horizontal ? undefined : 2}
        columnWrapperStyle={horizontal ? undefined : styles.row}
        refreshControl={
          !horizontal && onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF6B35"
              colors={['#FF6B35']}
            />
          ) : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  listContainer: {
    paddingLeft: 16,
  },
  verticalListContainer: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textTransform: 'capitalize',
  },
});
