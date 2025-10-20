import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaSection } from '../../components';
import { getBackdropUrl, getProfileUrl } from '../../config/tmdb';
import { usePersonDetails } from '../../hooks';
import { useMovieStore } from '../../stores/movieStore';

const { height } = Dimensions.get('window');

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const personId = parseInt(id || '0', 10);

  const {
    personDetails,
    movieCredits,
    tvCredits,
    isLoading,
    error,
    refetch,
  } = usePersonDetails(personId);

  const { favoritePeople, addFavoritePerson, removeFavoritePerson } = useMovieStore();
  
  const isFavorite = favoritePeople.some(fav => fav.id === personId);

  const handleFavoritePress = () => personDetails && (isFavorite ? removeFavoritePerson(personId) : addFavoritePerson(personDetails));
  const handleBackPress = () => router.back();
  const handleItemPress = (item: any) => {
    if ('title' in item) router.push(`/movie/${item.id}`);
    else if ('name' in item) router.push(`/tv/${item.id}`);
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
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !personDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading person details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const backdropUrl = getBackdropUrl(personDetails.profile_path, 'w1280');
  const profileUrl = getProfileUrl(personDetails.profile_path, 'h632');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
      >
        {/* Header with backdrop */}
        <View style={styles.header}>
          {backdropUrl && (
            <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          )}
          <View style={styles.backdropOverlay} />
          
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Action button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFavoritePress}
          >
            <MaterialCommunityIcons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF6B35" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* Person info */}
        <View style={styles.content}>
          <View style={styles.personInfo}>
            <View style={styles.profileContainer}>
              {profileUrl && (
                <Image source={{ uri: profileUrl }} style={styles.profile} />
              )}
            </View>
            
            <View style={styles.personDetails}>
              <Text style={styles.name}>{personDetails.name}</Text>
              
              <View style={styles.metaInfo}>
                <View style={styles.departmentContainer}>
                  <MaterialCommunityIcons name="briefcase" size={16} color="#666" />
                  <Text style={styles.department}>{personDetails.known_for_department}</Text>
                </View>
                
                {personDetails.birthday && (
                  <View style={styles.birthdayContainer}>
                    <MaterialCommunityIcons name="cake" size={16} color="#666" />
                    <Text style={styles.birthday}>
                      {new Date(personDetails.birthday).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                
                {personDetails.place_of_birth && (
                  <View style={styles.birthplaceContainer}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                    <Text style={styles.birthplace}>{personDetails.place_of_birth}</Text>
                  </View>
                )}
              </View>

              <View style={styles.popularityContainer}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#FF6B35" />
                <Text style={styles.popularity}>
                  Popularity: {Math.round(personDetails.popularity)}
                </Text>
              </View>
            </View>
          </View>

          {/* Biography */}
          {personDetails.biography && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Biography</Text>
              <Text style={styles.biography}>{personDetails.biography}</Text>
            </View>
          )}

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.personalInfo}>
              {personDetails.birthday && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Born:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(personDetails.birthday).toLocaleDateString()}
                    {personDetails.place_of_birth && ` in ${personDetails.place_of_birth}`}
                  </Text>
                </View>
              )}
              
              {personDetails.deathday && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Died:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(personDetails.deathday).toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Known for:</Text>
                <Text style={styles.infoValue}>{personDetails.known_for_department}</Text>
              </View>
              
              {personDetails.homepage && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Website:</Text>
                  <TouchableOpacity onPress={() => {/* Open website */}}>
                    <Text style={[styles.infoValue, styles.linkText]}>
                      {personDetails.homepage}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Movie Credits */}
          {movieCredits && movieCredits.length > 0 && (
            <MediaSection
              title="Movie Credits"
              data={movieCredits}
              type="movie"
              onItemPress={handleItemPress}
            />
          )}

          {/* TV Credits */}
          {tvCredits && tvCredits.length > 0 && (
            <MediaSection
              title="TV Credits"
              data={tvCredits}
              type="tv"
              onItemPress={handleItemPress}
            />
          )}

          {/* Known For */}
          {personDetails.known_for && personDetails.known_for.length > 0 && (
            <MediaSection
              title="Known For"
              data={personDetails.known_for as any[]}
              type="movie" // This will be handled by the MediaSection component
              onItemPress={handleItemPress}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: height * 0.4,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  actionButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  personInfo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileContainer: {
    marginRight: 16,
  },
  profile: {
    width: 120,
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  personDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  metaInfo: {
    marginBottom: 12,
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  department: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  birthday: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  birthplaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  birthplace: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularity: {
    fontSize: 14,
    color: '#FF6B35',
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  biography: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  personalInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  linkText: {
    color: '#FF6B35',
    textDecorationLine: 'underline',
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
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});
