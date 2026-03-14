import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3D86F4",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "send" : "send-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="token"
        options={{
          title: "Token",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "timer" : "timer-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="receive"
        options={{
          title: "Receive",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
     

      /> */}
    </Tabs>
  );
}
