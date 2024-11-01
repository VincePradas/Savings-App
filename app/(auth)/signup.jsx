import { Text, View, ScrollView, Image, Alert } from "react-native";
import { router } from "expo-router";
import { React, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons } from "../../constants";
import Formfield from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider"

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

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
            Create an Account
          </Text>
          <Formfield
            title="Username"
            placeholder="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-6"
          />
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
              title="Sign up"
              handlePress={submit}
              containerStyles="mt-10"
              isLoading={isSubmitting}
            />
          </View>
          <Text className="text-slate-50 opacity-30 text-sn text-center mt-3">
            -Sign Up with-
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
        <View className="flex-1 items-center justify-center mb-5">
          <Text className="text-white text-center font-pregular absolute bottom-0">
            Already have an account?
            <Text
              className="text-[#d52bff] font-bold"
              onPress={() => {
                router.push("/signin");
              }}
            >
              {" "}
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
