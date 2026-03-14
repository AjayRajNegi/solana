// import "../polyfills";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(e)" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaProvider>
      <StatusBar style="light" />
    </>
  );
}
