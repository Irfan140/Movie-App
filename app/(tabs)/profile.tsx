import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getTrendingMovies } from "@/services/appwrite";
import { clearSavedMovies, getSavedMovies } from "@/services/storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <View className="flex-1 bg-dark-100 rounded-xl p-4 items-center">
    <View
      className={`rounded-full p-3 mb-3`}
      style={{ backgroundColor: `${color}20` }}
    >
      <Image source={icon} className="size-6" tintColor={color} />
    </View>
    <Text className="text-2xl text-white font-bold mb-1">{value}</Text>
    <Text className="text-light-300 text-xs text-center">{label}</Text>
  </View>
);

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View className="flex-row justify-between items-center py-4 border-b border-dark-100">
    <Text className="text-light-300 text-sm">{label}</Text>
    <Text className="text-white text-sm font-semibold">{value}</Text>
  </View>
);

const Profile = () => {
  const [savedCount, setSavedCount] = useState(0);
  const [trendingCount, setTrendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalSearches, setTotalSearches] = useState(0);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const [savedMovies, trendingMovies] = await Promise.all([
        getSavedMovies(),
        getTrendingMovies(),
      ]);

      setSavedCount(savedMovies.length);
      setTrendingCount(trendingMovies?.length || 0);

      // Calculate total searches from trending movies
      const searches = trendingMovies?.reduce(
        (sum, movie) => sum + movie.count,
        0,
      );
      setTotalSearches(searches || 0);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData]),
  );

  const handleClearSavedMovies = () => {
    Alert.alert(
      "Clear Saved Movies",
      "Are you sure you want to remove all saved movies? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearSavedMovies();
              await loadProfileData();
              Alert.alert("Success", "All saved movies have been removed.");
            } catch (error) {
              console.error("Error clearing saved movies:", error);
              Alert.alert("Error", "Failed to clear saved movies.");
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

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className="items-center mt-20 mb-8">
          <Text className="text-light-300 text-sm mt-1">
            Exploring your stats
          </Text>
        </View>

        {/* Statistics Cards */}
        <View className="flex-row gap-3 mb-6">
          <StatCard
            icon={icons.save}
            label="Saved Movies"
            value={savedCount}
            color="#E11D48"
          />
          <StatCard
            icon={icons.star}
            label="Trending Tracked"
            value={trendingCount}
            color="#FBBF24"
          />
        </View>

        {/* Actions */}
        <View className="bg-dark-100/50 rounded-xl p-5 mb-6">
          <Text className="text-white text-lg font-bold mb-4">Settings</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-dark-100"
            onPress={handleClearSavedMovies}
            disabled={savedCount === 0}
          >
            <View className="flex-row items-center">
              <Image
                source={icons.save}
                className="size-5 mr-3"
                tintColor={savedCount === 0 ? "#4B5563" : "#E11D48"}
              />
              <Text
                className={`text-sm ${
                  savedCount === 0 ? "text-gray-500" : "text-white"
                }`}
              >
                Clear Saved Movies
              </Text>
            </View>
            <Image
              source={icons.arrow}
              className="size-4"
              tintColor={savedCount === 0 ? "#4B5563" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View className="bg-dark-100/50 rounded-xl p-5">
          <Text className="text-white text-lg font-bold mb-3">About</Text>
          <Text className="text-light-300 text-sm leading-5">
            Discover and save your favorite movies. Track trending searches and
            explore the latest releases in cinema.
          </Text>
          <Text className="text-light-300 text-xs mt-4 text-center">
            Powered by TMDB • Data from Appwrite
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
