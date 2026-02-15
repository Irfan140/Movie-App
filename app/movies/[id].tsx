import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { isMovieSaved, saveMovie, unsaveMovie } from "@/services/storage";
import useFetch from "@/services/usefetch";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

// Movie info --> resusable component
const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  // For going back to previous screen
  const router = useRouter();

  // Getting the particular screen id
  const { id } = useLocalSearchParams();

  // State for tracking if movie is saved
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Fetching the movie details
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  // Check if movie is saved when screen loads or comes into focus
  const checkSavedStatus = useCallback(async () => {
    if (movie?.id) {
      setIsCheckingStatus(true);
      const saved = await isMovieSaved(movie.id);
      setIsSaved(saved);
      setIsCheckingStatus(false);
    }
  }, [movie?.id]);

  useFocusEffect(
    useCallback(() => {
      checkSavedStatus();
    }, [checkSavedStatus]),
  );

  // Handle save/unsave toggle
  const handleToggleSave = async () => {
    if (!movie || isCheckingStatus) return;

    // Optimistic UI update
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      if (isSaved) {
        await unsaveMovie(movie.id);
      } else {
        // Convert MovieDetails to Movie type for saving
        const movieToSave: Movie = {
          id: movie.id,
          title: movie.title,
          adult: movie.adult,
          backdrop_path: movie.backdrop_path || "",
          genre_ids: movie.genres.map((g) => g.id),
          original_language: movie.original_language,
          original_title: movie.original_title,
          overview: movie.overview || "",
          popularity: movie.popularity,
          poster_path: movie.poster_path || "",
          release_date: movie.release_date,
          video: movie.video,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
        };
        await saveMovie(movieToSave);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      // Revert on error
      setIsSaved(!newSavedState);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>

          {/* Save/Unsave Button */}
          <TouchableOpacity
            className="absolute bottom-5 left-5 rounded-full size-14 flex items-center justify-center bg-white/90"
            onPress={handleToggleSave}
            activeOpacity={0.7}
          >
            <Image
              source={icons.save}
              className="w-7 h-7"
              tintColor={isSaved ? "#E11D48" : "#000"}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000,
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* Go Back to previous Screen */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
