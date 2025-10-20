import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProfileUrl } from '../config/tmdb';

interface CastCrewItem {
  id: number;
  name: string;
  character?: string;
  job?: string;
  department?: string;
  profile_path: string | null;
  order?: number;
}

interface CastCrewListProps {
  title: string;
  data: CastCrewItem[];
  type: 'cast' | 'crew';
  onItemPress?: (item: CastCrewItem) => void;
  maxItems?: number;
}

export const CastCrewList: React.FC<CastCrewListProps> = ({
  title,
  data,
  type,
  onItemPress,
  maxItems = 20,
}) => {
  const displayData = data.slice(0, maxItems);

  const renderItem = ({ item }: { item: CastCrewItem }) => {
    const profileUrl = getProfileUrl(item.profile_path, 'w185');

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onItemPress?.(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {profileUrl ? (
            <Image source={{ uri: profileUrl }} style={styles.profile} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialCommunityIcons name="account" size={24} color="#ccc" />
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          
          {type === 'cast' && item.character && (
            <Text style={styles.character} numberOfLines={2}>
              {item.character}
            </Text>
          )}
          
          {type === 'crew' && item.job && (
            <Text style={styles.job} numberOfLines={2}>
              {item.job}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No {type} information available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${type}-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        getItemLayout={Platform.OS !== 'web' ? (_: any, index: number) => ({
          length: 120, // width + margin
          offset: 120 * index,
          index,
        }) : undefined}
        initialNumToRender={Platform.OS === 'web' ? displayData.length : 5}
        maxToRenderPerBatch={Platform.OS === 'web' ? displayData.length : 10}
        windowSize={Platform.OS === 'web' ? displayData.length : 10}
        removeClippedSubviews={Platform.OS !== 'web'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingLeft: 20,
  },
  item: {
    width: 100,
    marginRight: 12,
  },
  imageContainer: {
    marginBottom: 8,
    aspectRatio: 2/3, // Consistent aspect ratio
  },
  profile: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  character: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  job: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textTransform: 'capitalize',
  },
});
