import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { Client, Databases, Query, Account } from "react-native-appwrite";
import { appwriteConfig } from "../../lib/appwrite";
import { icons } from "../../constants";
import * as Progress from "react-native-progress";

const PreviousGoals = () => {
  const [previousGoals, setPreviousGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const databases = new Databases(client);
  const account = new Account(client);

  const getCurrentUser = async () => {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  };

  const fetchPreviousGoals = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User is not signed in");

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.previousGoalsCollectionId,
        [Query.equal("accountId", currentUser.$id)]
      );

      setPreviousGoals(response.documents);
    } catch (error) {
      console.error("Failed to fetch previous goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousGoals();
  }, []);

  const renderPreviousGoalItem = ({ item }) => {
    const currIcon = item.category.toLowerCase();
    const progress = item.amount;

    return (
      <View className="p-4 border border-white rounded-lg shadow mb-2">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="font-medium font-pbold text-white">{item.title}</Text>
            <Text className="font-pregular text-white">Amount: {item.amount}</Text>
            <Text className="font-pregular text-white">Description: {item.description}</Text>
            <Text className="font-pregular text-white">Type: {item.category}</Text>
          </View>
          <View className="border border-white p-3 rounded-full">
            <Image
              source={icons[currIcon] || icons.defaultIcon}
              resizeMode="contain"
              className="h-[50] w-[50]"
            />
          </View>
        </View>
        <Progress.Bar progress={1} width={null} color="green" />
        <Text className="text-center text-white mt-1">100%</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator size="large" color="#29e120" />
      ) : previousGoals.length === 0 ? (
        <View className="items-center justify-center">
          <Image source={icons.empty} resizeMode="contain" style={{ height: 180, width: 180 }} />
          <Text className="text-gray-500 font-pregular text-lg text-center">
            No previous goals found
          </Text>
        </View>
      ) : (
        <FlatList
          data={previousGoals}
          renderItem={renderPreviousGoalItem}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
};

export default PreviousGoals;
