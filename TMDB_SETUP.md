# TMDB API Setup Guide

## Getting Started

1. **Register for TMDB API Key**
   - Go to [TMDB Account Settings](https://www.themoviedb.org/settings)
   - Click on "API" link
   - Fill out the application form
   - Accept the terms of use
   - Copy your API key

2. **Environment Configuration**
   Create a `.env` file in your project root with:
   ```env
   EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   EXPO_PUBLIC_TMDB_DEFAULT_LANGUAGE=en-US
   EXPO_PUBLIC_TMDB_DEFAULT_REGION=US
   ```

3. **API Rate Limits**
   - 40 requests per 10 seconds per IP
   - 10,000 requests per day per API key
   - Our implementation includes automatic rate limiting

## Required Attribution

When using TMDB data, you must include:
- TMDB logo
- Text: "This product uses the TMDB API but is not endorsed or certified by TMDB."

## API Features Implemented

### Movies
- Popular, Top Rated, Now Playing, Upcoming
- Discover with filters
- Details, Credits, Similar, Recommendations

### TV Shows
- Popular, Top Rated, On The Air, Airing Today
- Discover with filters
- Details, Credits, Similar, Recommendations

### People
- Popular people
- Details, Movie Credits, TV Credits

### Trending
- Movies, TV Shows, People
- Daily and Weekly trending

### Search
- Multi-search across all content types
- Individual search for movies, TV, people

### Additional Features
- Configuration (image URLs, countries, languages)
- Genres for movies and TV
- Watch providers
- Rate limiting
- Error handling
- TypeScript support

## Usage Example

```typescript
import { moviesApi, tvApi, peopleApi } from './services/tmdb';

// Get popular movies
const popularMovies = await moviesApi.getPopular();

// Get trending TV shows
const trendingTv = await trendingApi.getTrending('tv', 'week');

// Search for content
const searchResults = await searchApi.multi('avengers');
```

## Image URLs

The implementation includes helpers for all image types:
- Posters: `getPosterUrl(path, size)`
- Backdrops: `getBackdropUrl(path, size)`
- Profiles: `getProfileUrl(path, size)`
- Logos: `getLogoUrl(path, size)`
- Stills: `getStillUrl(path, size)`

## Error Handling

All API calls include proper error handling for:
- Rate limiting
- Network errors
- API errors
- Missing API key
- Invalid responses
