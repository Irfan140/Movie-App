import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies, unsaveMovie } from "@/services/storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Save = () => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved movies whenever the screen comes into focus
  const loadSavedMovies = useCallback(async () => {
    try {
      setLoading(true);
      const movies = await getSavedMovies();
      setSavedMovies(movies);
    } catch (error) {
      console.error("Error loading saved movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh movies when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [loadSavedMovies]),
  );

  const handleRemoveMovie = (movieId: number, title: string) => {
    Alert.alert(
      "Remove Movie",
      `Are you sure you want to remove "${title}" from your saved movies?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await unsaveMovie(movieId);
              await loadSavedMovies();
            } catch (error) {
              console.error("Error removing movie:", error);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View className="w-full flex-row justify-between items-center mt-20 mb-5">
            <View>
              <Text className="text-2xl text-white font-bold">
                Saved Movies
              </Text>
              <Text className="text-light-300 text-sm mt-1">
                {savedMovies.length}{" "}
                {savedMovies.length === 1 ? "movie" : "movies"} saved
              </Text>
            </View>
            <Image source={icons.save} className="size-8" tintColor="#fff" />
          </View>
        }
        ListEmptyComponent={
          <View className="flex justify-center items-center flex-1 mt-32">
            <Image
              source={icons.save}
              className="size-16 mb-5"
              tintColor="#4B5563"
            />
            <Text className="text-gray-400 text-lg font-semibold">
              No Saved Movies Yet
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center px-10">
              Browse movies and tap the save icon to add them here
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Save;
