import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { icons } from "../../constants";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import Formfield from "../../components/FormField";

import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="flex-1">
        <View className="w-full px-4 my-10 flex-1 ">
          <Image
            source={images.textLogo}
            resizeMode="contain"
            className="w-[182] h-[84]"
          />
          <Text className="text-white text-xl my-3 font-pbold">
            Login 
          </Text>
          <Formfield
            title="Email"
            placeholder="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
            otherStyles="mt-6"
          />
          <Formfield
            title="Password"
            placeholder="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-6"
          />
          <View className="items-center">
            <CustomButton
              title="Sign in"
              handlePress={submit}
              containerStyles="mt-10"
              isLoading={isSubmitting}
            />
          </View>
          <Text className="text-slate-50 opacity-30 text-sn text-center mt-3">
            -Sign in with-
          </Text>
          <View className="items-center justify-center flex-row gap-5 mt-1">
            <Image
              source={icons.google}
              resizeMode="contain"
              className="h-10 w-10"
            />
            <Image
              source={icons.fb}
              resizeMode="contain"
              className="h-10 w-10"
            />
          </View>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-center font-pregular absolute bottom-0">
            Don't have an account?
            <Text
              className="text-[#d52bff] font-bold"
              onPress={() => {
                router.push("/signup");
              }}
            >
              {" "}
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

{/* <SafeAreaView className="bg-primary h-full">
<ScrollView>
  <View
    className="w-full flex justify-center h-full px-4 my-6"
    style={{
      minHeight: Dimensions.get("window").height - 100,
    }}
  >
    <Image
      source={images.textLogo}
      resizeMode="contain"
      className="w-[182] h-[84]"
    />

    <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
      Log in to <Text className="text-[#d52bff]">Sav</Text>ince
    </Text>

    <FormField
      title="Email"
      value={form.email}
      handleChangeText={(e) => setForm({ ...form, email: e })}
      otherStyles="mt-7"
      keyboardType="email-address"
    />

    <FormField
      title="Password"
      value={form.password}
      handleChangeText={(e) => setForm({ ...form, password: e })}
      otherStyles="mt-7"
    />

    <CustomButton
      title="Sign In"
      handlePress={submit}
      containerStyles="mt-7"
      isLoading={isSubmitting}
    />

    <Text className="text-slate-50 opacity-30 text-sn text-center mt-3">
      -Sign In with-
    </Text>
    <View className="items-center justify-center flex-row gap-5 mt-1">
      <Image
        source={icons.google}
        resizeMode="contain"
        className="h-10 w-10"
      />
      <Image
        source={icons.fb}
        resizeMode="contain"
        className="h-10 w-10"
      />
    </View>
    
  </View>
</ScrollView>
</SafeAreaView> */}