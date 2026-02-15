import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_MOVIES_KEY = "@saved_movies";

// Save a movie to local storage
export const saveMovie = async (movie: Movie): Promise<void> => {
  try {
    const savedMovies = await getSavedMovies();

    // Check if movie is already saved
    const isAlreadySaved = savedMovies.some((m) => m.id === movie.id);

    if (!isAlreadySaved) {
      const updatedMovies = [movie, ...savedMovies];
      await AsyncStorage.setItem(
        SAVED_MOVIES_KEY,
        JSON.stringify(updatedMovies),
      );
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

// Remove a movie from local storage
export const unsaveMovie = async (movieId: number): Promise<void> => {
  try {
    const savedMovies = await getSavedMovies();
    const updatedMovies = savedMovies.filter((m) => m.id !== movieId);
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
  } catch (error) {
    console.error("Error removing movie:", error);
    throw error;
  }
};

// Get all saved movies
export const getSavedMovies = async (): Promise<Movie[]> => {
  try {
    const savedMoviesJson = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    return savedMoviesJson ? JSON.parse(savedMoviesJson) : [];
  } catch (error) {
    console.error("Error getting saved movies:", error);
    return [];
  }
};

// Check if a movie is saved
export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    return savedMovies.some((m) => m.id === movieId);
  } catch (error) {
    console.error("Error checking if movie is saved:", error);
    return false;
  }
};

// Clear all saved movies (useful for testing or profile actions)
export const clearSavedMovies = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SAVED_MOVIES_KEY);
  } catch (error) {
    console.error("Error clearing saved movies:", error);
    throw error;
  }
};
