import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { Client, Databases, Query, Account } from "react-native-appwrite";
import { appwriteConfig } from "../../lib/appwrite";
import { icons } from "../../constants";
import * as Progress from "react-native-progress";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { createOrUpdateProgress, fetchProgress } from "../../lib/appwrite";

const Goals = ({ loading }) => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(loading);
  const [progressInputs, setProgressInputs] = useState({});
  const [loadingStates, setLoadingStates] = useState({}); // Corrected: Local loading state for each button
  const [previousGoals, setPreviousGoals] = useState([]);

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

  const fetchProgressByGoalId = async (accountId, goalId) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.progressCollectionId,
        [
          Query.equal("accountId", accountId),
          Query.equal("goalId", goalId),
        ]
      );
      return response.documents.length > 0 ? response.documents[0].value : 0;
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      return 0;
    }
  };

  const fetchGoals = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User is not signed in");

      const goalsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.goalsCollectionId,
        [Query.equal("accountId", currentUser.$id)]
      );

      const updatedGoals = await Promise.all(
        goalsResponse.documents.map(async (goal) => {
          const progress = await fetchProgressByGoalId(currentUser.$id, goal.$id);
          return { ...goal, progress };
        })
      );

      setGoals(updatedGoals);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchGoals();
  }, []);

  const handleProgressInputChange = (goalId, amount) => {
    setProgressInputs((prevInputs) => ({
      ...prevInputs,
      [goalId]: amount,
    }));
  };

  const addProgress = async (goalId) => {
    const amount = parseInt(progressInputs[goalId], 10);
    if (!isNaN(amount) && amount > 0) {
      try {
        setLoadingStates((prev) => ({ ...prev, [goalId]: true })); // Set loading for the specific goal
        const currentUser = await getCurrentUser();
  
        // Fetch existing progress for the goal
        const existingProgress = await fetchProgressByGoalId(currentUser.$id, goalId);
        const updatedProgress = existingProgress + amount; // Update the existing progress with new amount
  
        // Update the progress in the database
        await createOrUpdateProgress(currentUser.$id, goalId, updatedProgress);
  
        // Check if the goal is completed
        const goal = goals.find(g => g.$id === goalId);
        if (updatedProgress >= goal.amount) {
          // Prepare the data to be stored in the previousGoals collection
          const previousGoalData = {
            title: goal.title,
            amount: goal.amount,
            category: goal.category,
            accountId: currentUser.$id, // Associate with the current user
          };
  
          // Transfer the goal to previous goals
          await databases.createDocument(
            appwriteConfig.databaseId,
            '671f400d00238a14bd8e', // Your previousGoals collection ID
            goalId, // Use the goal ID or generate a new one
            previousGoalData
          );
  
          // Remove the goal from current goals
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.goalsCollectionId,
            goalId
          );
  
          setGoals((prevGoals) => prevGoals.filter(g => g.$id !== goalId)); // Update the state for active goals
        } else {
          // Update the state for active goals
          setGoals((prevGoals) =>
            prevGoals.map((goal) =>
              goal.$id === goalId ? { ...goal, progress: updatedProgress } : goal
            )
          );
        }
  
        // Clear the input field for the goal
        setProgressInputs((prevInputs) => ({
          ...prevInputs,
          [goalId]: "",
        }));
      } catch (error) {
        console.error("Failed to add progress:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [goalId]: false })); // Reset loading for the specific goal
      }
    }
  };
  
  

const ProgressBar = ({ progress, max }) => {
    const progressRatio = progress / max;
    return (
      <View className="w-full py-2">
        <Progress.Bar progress={progressRatio} width={null} color="green" />
        <Text className="text-center text-white mt-1">
          {`${Math.round(progressRatio * 100)}%`}
        </Text>
      </View>
    );
};

const renderGoalItem = ({ item }) => {
    const currIcon = item.category.toLowerCase();
    const progress = item.progress || 0;
    const isButtonLoading = loadingStates[item.$id]; // Check if the specific button is loading

    return (
      <View className="p-4 border border-white rounded-lg shadow mb-2">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="font-medium font-pbold text-white text-lg">{item.title}</Text>
            <Text className="font-pregular text-white text-base">Amount: {item.amount}</Text>
            <Text className="font-pregular text-white">Type: {item.category}</Text>
            <Text className="font-pregular text-white">Progress: {item.progress}</Text>
            <Text className="font-pregular text-white">Description: {item.description}</Text>
            <Text className="text-[#7b7b7bb1] font-pregular">UID: {item.uniqueID}</Text>
          </View>
          <View className="border border-white p-3 rounded-full">
            <Image
              source={icons[currIcon] || icons.defaultIcon}
              resizeMode="contain"
              className="h-[50] w-[50]"
            />
          </View>
        </View>
        <ProgressBar progress={progress} max={item.amount} />
        <View className="mt-4">
          <FormField
            title="Add Progress"
            placeholder="Enter amount"
            value={progressInputs[item.$id] || ""}
            handleChangeText={(text) => handleProgressInputChange(item.$id, text)}
            otherStyles="mt-2"
            keyboardType="numeric"
          />
          <CustomButton
            title={isButtonLoading ? "Wait..." : "Add"} // Change button text while loading
            handlePress={() => addProgress(item.$id)}
            containerStyles="mt-2"
            disabled={isButtonLoading} // Disable button while loading
          />
        </View>
      </View>
    );
};

return (
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator size="large" color="#29e120" />
      ) : goals.length === 0 ? (
        <View className="items-center justify-center">
          <Image source={icons.empty} resizeMode="contain" style={{ height: 180, width: 180 }} />
          <Text className="text-gray-500 font-pregular text-lg text-center">Create your first goal</Text>
          <Text className="font-pregular text-sm text-gray-500 text-center">Tap the plus button to set up your first goal</Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
);
};

export default Goals;
