  import { useState, useEffect } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { Image, Text, View } from "react-native";
  import { StatusBar } from "expo-status-bar";
  import { images } from "../../constants";
  import { Account, Client } from "react-native-appwrite";
  import { appwriteConfig } from "../../lib/appwrite";
  import Goals from "../goals/goals"; 
  import AppendGoals from "../goals/appendGoals"
  const Home = () => {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    const client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId);

    const account = new Account(client);

    const fetchAccount = async () => {
      try {
        const accountData = await account.get();
        setUsername(accountData.name);
      } catch (error) {
        console.error("Failed to fetch account:", error);
      } finally {
        setLoading(false); 
      }
    };

    useEffect(() => {
      fetchAccount(); 
    }, []);

    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex-1 justify-between">
          <View className="flex my-6 px-4 space-y-2 flex-1">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">{username || "Loading..."}</Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="w-full h-full flex-1">
              <Text className="text-lg font-pregular text-gray-100 mb-3">Your Goals</Text>
              <AppendGoals/>
            </View>
          </View>
          <StatusBar backgroundColor="transparent" style="light" />
        </View>
      </SafeAreaView>
    );
  };

  export default Home;
