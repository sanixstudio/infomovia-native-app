import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProfileUrl } from '../config/tmdb';
import { useMovieStore } from '../stores/movieStore';
import { Person } from '../types/tmdb';

interface PersonCardProps {
  person: Person;
  onPress?: (person: Person) => void;
  showFavoriteButton?: boolean;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onPress,
  showFavoriteButton = true,
}) => {
  const router = useRouter();
  const { favoritePeople, addFavoritePerson, removeFavoritePerson } = useMovieStore();
  
  const isFavorite = favoritePeople.some(fav => fav.id === person.id);

  const handleFavoritePress = () => isFavorite ? removeFavoritePerson(person.id) : addFavoritePerson(person);
  const handleCardPress = () => onPress ? onPress(person) : router.push(`/person/${person.id}`);

  const profileUrl = getProfileUrl(person.profile_path, 'w185');

  return (
    <Link href={`/person/${person.id}`} asChild>
      <TouchableOpacity
        style={styles.container}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
      <View style={styles.imageContainer}>
        {profileUrl ? (
          <Image source={{ uri: profileUrl }} style={styles.profile} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="account" size={40} color="#666" />
          </View>
        )}
        
        {/* Action buttons overlay */}
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
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {person.name}
        </Text>
        
        <View style={styles.metaInfo}>
          <Text style={styles.department} numberOfLines={1}>
            {person.known_for_department || 'Actor'}
          </Text>
          
          <View style={styles.popularityContainer}>
            <MaterialCommunityIcons name="trending-up" size={12} color="#666" />
            <Text style={styles.popularity}>
              {Math.round(person.popularity)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  profile: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  actionButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
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
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  department: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  popularity: {
    fontSize: 10,
    color: '#666',
  },
});
