import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { icons } from "../../constants"; 
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createGoal } from "../../lib/appwrite";

const categories = [
  { id: 1, name: "Gadgets", icon: icons.gadgets },
  { id: 2, name: "Clothes", icon: icons.clothes },
  { id: 3, name: "Money", icon: icons.money },
  { id: 4, name: "Travel", icon: icons.travel },
  { id: 5, name: "Foods", icon: icons.foods },
  { id: 6, name: "Shopping", icon: icons.shopping }

];

const AddGoal = () => {
  const genUID = () => {
    return Math.floor(Math.random() * 999999);
  };
  
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    description:"",
    creator: "",
    uniqueID: genUID(),
  });

  const submit = async () => {
    if (form.title === "" || form.amount === "" || !form.category) {
      return Alert.alert("Please provide all fields");
    }
    console.log("Submitting goal:", form);
    setUploading(true);
    try {
      await createGoal({
        ...form,
        userId: user.$id, // Include user ID
        category: form.category, // Pass category here
      });
  
      Alert.alert("Success", "Goal created successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        category: "",
        amount: "",
        description:"",
        creator:"",
        uniqueID: genUID(),
      });
      setUploading(false);  
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Create a Goal</Text>

        <FormField
          title="Name your goal"
          value={form.title}
          placeholder="What should we call your goal?"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-7"
        />

        <View className="mt-7">
          <Text className="text-base text-gray-100 font-pmedium">Select Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3 mt-3">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setForm({ ...form, category: category.name })}
                className={`p-4 rounded-lg border ${
                  form.category === category.name ? "border-secondary-100" : "border-transparent"
                }`}
              >
                <Image source={category.icon} className="w-12 h-12" resizeMode="contain" />
                <Text className="text-center text-gray-100 pt-2">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FormField
          title="Goal Amount"
          value={form.amount}
          placeholder="How much is your target goal?"
          handleChangeText={(e) => setForm({ ...form, amount: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Description"
          value={form.description}
          placeholder="What's this for?"
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Create"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddGoal;
