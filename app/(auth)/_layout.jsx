// AuthLayout.jsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { useEffect } from "react";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  useEffect(() => {
    // If the user is logged in, redirect to the home page
    if (isLogged) {
      router.replace("/home"); // Use router to replace the current route
    }
  }, [isLogged]);

  // Show loader while loading
  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
