import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import {router} from "expo-router"
import { getCurrentUser, signOut } from "../../lib/appwrite"; // Adjust the path if needed
import CustomButton from "../../components/CustomButton"
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(); // Call logout function from Appwrite
      setUserData(null); // Clear user data
      navigation.navigate("index"); // Navigate to the login or home screen after logout
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleContinueWithEmail = (event) => {
    event.preventDefault();
    router.push("/sign-in"); // Navigate to the sign-in or sign-up screen
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-6 my-6">
        {userData ? (
          <View className="pt-5">
            {/* Profile Header */}
            <View className="mt-6 p-4 rounded-lg shadow-md border border-gray-500 items-center">
              <Text className="text-2xl text-white font-pbold text-center mb-4">
                Profile
              </Text>
              <Image
                source={{ uri: userData.avatar }}
                className="h-24 w-24 rounded-full border-4 border-primary"
                alt="User Avatar"
              />
              <Text className="text-lg text-white mt-4 font-psemibold text-center">
                {userData.username}
              </Text>
              <Text className="text-white text-center font-pregular">
                Email: <Text className="font-pbold">{userData.email}</Text>
              </Text>
              <Text className="text-white text-center font-pregular">
                UID: <Text className="font-pbold">{userData.accountId}</Text>
              </Text>
            </View>
            <View className="mt-6">
              <CustomButton
              title="Logout"
              handlePress={handleLogout}
              />
            </View>
            {/* About Section */}
            <View className="pt-8 px-2">
              <View className="flex-row items-center justify-center mb-2">
                <Text className="font-psemibold text-white text-lg mr-2">
                  About the app
                </Text>
                <View className="relative top-[-8] left-[-8]">
                  <Image
                    source={icons.info}
                    resizeMode="contain"
                    className="h-5 w-5"
                  />
                </View>
              </View>
              <Text className="text-white text-base leading-relaxed font-pregular">
                Savince focuses on helping users set and manage their savings goals with Goal Setting and Progress Tracking.
                Whether you’re saving for a new gadget, an upcoming vacation, or simply building a rainy-day fund, 
                Savince empowers you to track and manage your progress every step of the way.
              </Text>

              <Text className="text-lg text-white font-semibold mt-4">
                Features:
              </Text>

              <View className="mt-2 space-y-3">
                <View className="flex-row items-start">
                  <Text className="text-lg text-white font-semibold">1.</Text>
                  <Text className="text-white text-base font-pregular ml-2">
                    <Text className="font-semibold">Set and Track Goals:</Text> Easily create savings goals and set target amounts. Savince helps you keep track of your progress so you always know how close you are to reaching your dreams.
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-lg text-white font-semibold">2.</Text>
                  <Text className="text-white text-base font-pregular ml-2">
                    <Text className="font-semibold">Categories for Every Goal:</Text> Visualize your goals with custom icons for categories like travel, shopping, or finances. Organized and visually intuitive, these categories make managing goals easy and enjoyable.
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-lg text-white font-semibold">3.</Text>
                  <Text className="text-white text-base font-pregular ml-2">
                    <Text className="font-semibold">Progress Updates:</Text> Stay motivated by regularly updating your progress. See how far you’ve come and how much closer you are to achieving each goal.
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-lg text-white font-semibold">4.</Text>
                  <Text className="text-white text-base font-pregular ml-2">
                    <Text className="font-semibold">Modern, Minimal Design:</Text> A clean, user-friendly interface keeps your focus on what matters most: reaching your savings goals without distraction.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="text-white text-center mt-4">
            <CustomButton
              title="Sign in here"
              handlePress={handleContinueWithEmail}
              />
              <View>
                <Text className="text-white text-center py-10">
                  Restart the app after logging out.
                </Text>
              </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
