import { Text, View, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { icons } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full items-center justify-center px-4">
          <Image
            source={images.textLogo}
            className="w-[220] h-[120]"
            resizeMode="contain"gi
          />
          <Image
            source={images.cards}
            className="max-w-[300px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View>
            <Text className="text-white font-bold text-center text-2xl">
              Set and Track your financial goal with{" "}
              <Text className="text-[#d52bff]">Sav</Text>
              <Text>ince</Text>
            </Text>
          </View>

          <Text className="text-sm font-pregular text-gray-100 text-center mt-2">
            Save Smartly!
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/signup");
            }}
            containerStyles="mt-7"
          />
        </View>

        <Text
          className="text-slate-50 opacity-30 text-sn text-center mt-3"
          href="/sign-in"
        >
          -Continue with-
        </Text>
        <View className="items-center justify-center flex-row gap-5 mt-1">
          <Image
            source={icons.google}
            resizeMode="contain"
            className="h-10 w-10"
          />
          <Image source={icons.fb} resizeMode="contain" className="h-10 w-10" />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white absolute bottom-2 text-center font-pregular">
            Already have an account?
            <Text
              className="text-[#d52bff] font-bold"
              onPress={() => {
                router.push("/signin");
              }}
            >
              {" "}
              Sign in
            </Text>{" "}
          </Text>
        </View>
        <StatusBar backgroundColor="transparent" style="light" />
      </ScrollView>
      <StatusBar backgroundColor="transparent" style="light" />
    </SafeAreaView>
  );
}
