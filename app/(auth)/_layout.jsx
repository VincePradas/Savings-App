import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Redirect } from "expo-router";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  // Show loader while loading
  if (loading) {
    return <Loader isLoading={loading} />;
  }

  // If the user is logged in, redirect to home
  if (isLogged) {
    return <Redirect href="/home" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
      
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
