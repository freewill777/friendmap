import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { HeapProvider } from "./Heap";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Touchable, TouchableOpacity, View, useColorScheme } from "react-native";
export { ErrorBoundary } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    MenloRegular: require("../assets/fonts/Menlo-Regular.ttf"),
    TalerSemibold: require("../assets/fonts/Taler-SemiBold.otf"),
    NeueHaasDisplayBold: require("../assets/fonts/NeueHaasDisplayBold.ttf"),
    NeueHaasDisplayMediu: require("../assets/fonts/NeueHaasDisplayMediu.ttf"),
    NeueHaasDisplayThin: require("../assets/fonts/NeueHaasDisplayThin.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { back } = useRouter();

  return (
    <>
      <StatusBar style="dark" />
      <HeapProvider>
        <ThemeProvider
          value={DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
              key="tabs-screen"
            />
            <Stack.Screen
              name="modal"
              key="modal-screen"
              options={{
                presentation: "modal",
                headerShown: false,
                headerTitle: "Info",
              }}
            />
            <Stack.Screen
              name="login"
              key="login-screen"
              options={{
                headerTitle: "",
                // presentation: "modal",
                headerTransparent: true,
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={back}>
                      <FontAwesome name="close" size={36} color="#696969" />
                    </TouchableOpacity>
                  );
                },
              }}
            />
            <Stack.Screen
              name="story"
              key="story-screen"
              options={{
                headerTitle: "",
                // presentation: "modal",
                headerTransparent: true,
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={back}>
                      <FontAwesome name="close" size={36} color="#696969" />
                    </TouchableOpacity>
                  );
                },
              }}
            />
            <Stack.Screen
              name="newstory"
              key="new-story-screen"
              options={{
                headerTitle: "",
                headerTransparent: true,
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={back}>
                      <FontAwesome name="close" size={36} color="white" />
                    </TouchableOpacity>
                  );
                },
              }}
            />
            <Stack.Screen
              name="register"
              key="regsiter-screen"
              options={{
                headerTitle: "",
                headerTransparent: true,
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={back}>
                      <FontAwesome name="close" size={36} color="#696969" />
                    </TouchableOpacity>
                  );
                },
              }}
            />
            <Stack.Screen
              name="newevent"
              key="new-event-screen"
              options={{
                headerTitle: "",
                headerTransparent: true,
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={back}>
                      <FontAwesome name="close" size={36} color="#696969" />
                    </TouchableOpacity>
                  );
                },
              }}
            />
          </Stack>

        </ThemeProvider>
      </HeapProvider>
    </>
  );
}
