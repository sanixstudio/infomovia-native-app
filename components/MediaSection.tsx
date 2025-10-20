import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  data,
  type,
  onItemPress,
  onViewAllPress,
  showViewAll = true,
  horizontal = true,
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

  const getItemLayout = (_: any, index: number) => ({
    length: type === 'person' ? 132 : 172, // width + margin
    offset: (type === 'person' ? 132 : 172) * index,
    index,
  });

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
        keyExtractor={(item) => `${type}-${item.id}`}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
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
