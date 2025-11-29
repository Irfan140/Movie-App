# 🎬 Irfanix - Movie Discovery App

A modern, feature-rich movie discovery application built with React Native and Expo, featuring trending movies, search functionality, and detailed movie information powered by The Movie Database (TMDB) API and Appwrite.

![React Native](https://img.shields.io/badge/React_Native-0.79.5-blue)
![Expo](https://img.shields.io/badge/Expo-~53.0.20-black)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-blue)
![NativeWind](https://img.shields.io/badge/NativeWind-4.1.23-38bdf8)

## ✨ Features

- 🔍 **Smart Search** - Search for movies with debounced input and real-time results
- 🔥 **Trending Movies** - View the most searched movies based on user activity
- 📱 **Responsive Design** - Beautiful UI with custom tab navigation and smooth animations
- 🎥 **Movie Details** - Comprehensive movie information including ratings, genres, runtime, and overview
- 💾 **Search Analytics** - Track popular searches using Appwrite backend
- ⚡ **Fast Performance** - Optimized with custom hooks and efficient data fetching

## 📷 Screenshots

<table>
  <tr>
    <td><img src="assets/readme-assets/Screenshot_20251129_105042.jpg" alt="Home" width="240"/></td>
    <td><img src="assets/readme-assets/Screenshot_20251129_105113.jpg" alt="Notes List" width="240"/></td>
    <td><img src="assets/readme-assets/Screenshot_20251129_105128.jpg" alt="Create Note" width="240"/></td>
  </tr>
  
</table>

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router with file-based routing
- **Styling:** NativeWind - Tailwind CSS for React Native
- **Backend:** Appwrite for search analytics and trending data
- **API:** The Movie Database (TMDB) API for movie data



## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Irfan140/Movie-App.git
cd Movie-App-Expo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your API keys:

```env
# TMDB API Configuration
EXPO_PUBLIC_TMDB_API_READ_ACCESS_TOKEN=your_tmdb_api_token_here

# Appwrite Configuration
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
```

#### Getting API Keys:

**TMDB API:**
1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create an account and go to Settings > API
3. Request an API key and copy the "Read Access Token"

**Appwrite:**
1. Visit [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a new project
3. Create a database and collection with the following attributes:
   - `searchTerm` (string)
   - `movie_id` (integer)
   - `title` (string)
   - `count` (integer)
   - `poster_url` (string)
4. Copy your project ID, database ID, and collection ID

### 4. Start the development server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `a` - Open on Android emulator
- Press `i` - Open on iOS simulator
- Press `w` - Open in web browser
- Scan QR code with Expo Go app on your physical device

## 📱 Available Scripts

```bash
npm start          # Start the development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint for code quality
```

## 🏗️ Project Structure

```
Movie-App-Expo/
├── app/                        # Main application screens
│   ├── (tabs)/                # Tab-based navigation screens
│   │   ├── _layout.tsx       # Tab navigation layout
│   │   ├── index.tsx         # Home screen (trending & latest movies)
│   │   ├── search.tsx        # Search functionality
│   │   ├── saved.tsx         # Saved movies (TODO)
│   │   └── profile.tsx       # User profile (TODO)
│   ├── movies/
│   │   └── [id].tsx          # Dynamic movie details screen
│   ├── _layout.tsx           # Root layout
│   └── global.css            # Global styles
├── components/                # Reusable components
│   ├── MovieCard.tsx         # Movie card component
│   ├── SearchBar.tsx         # Search input component
│   └── TrendingCard.tsx      # Trending movie card with ranking
├── services/                  # API and data services
│   ├── api.ts                # TMDB API functions
│   ├── appwrite.ts           # Appwrite backend functions
│   └── usefetch.ts           # Custom data fetching hook
├── constants/                 # App constants
│   ├── icons.ts              # Icon exports
│   └── images.ts             # Image exports
├── interfaces/                # TypeScript interfaces
│   └── interfaces.d.ts       # Type definitions
├── assets/                    # Static assets
│   ├── fonts/
│   ├── icons/
│   └── images/
└── ...config files
```

## 🎯 Key Features Explained

### Custom Hook: `useFetch`
A reusable hook that handles API requests with loading states, error handling, and manual refetch capability:

```typescript
const { data, loading, error, refetch, reset } = useFetch(fetchFunction);
```

### Debounced Search
Search functionality implements a 500ms debounce to optimize API calls and reduce unnecessary requests.

### Trending Algorithm
Movies are ranked based on search frequency, stored in Appwrite database with automatic count incrementation.

### File-based Routing
Using Expo Router for intuitive navigation:
- `(tabs)` - Group route for tab navigation
- `[id]` - Dynamic route for movie details

## 🎨 Customization

### Color Scheme
Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: "#030014",      // Background
  secondary: "#151312",    // Secondary background
  accent: "#AB8BFF",       // Accent color
  // ... more colors
}
```

## 🔜 Upcoming Features

- [ ] Save/Bookmark movies functionality
- [ ] User authentication and profiles
- [ ] Movie watchlist
- [ ] Movie recommendations
- [ ] Video trailer playback
- [ ] Social sharing features

## 🐛 Known Issues

- Profile and Saved screens are currently placeholders (marked as TODO)
- Video playback not yet implemented



## 👨‍💻 Author

**Irfan Mehmud**
- GitHub: [@Irfan140](https://github.com/Irfan140)


## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

Made with ❤️ using React Native and Expo
