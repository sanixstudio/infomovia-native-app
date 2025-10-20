import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#272640",
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarActiveBackgroundColor: "#FF6B35",
        tabBarInactiveTintColor: "#ffffff",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarLabel: ({ focused, color }) => (
          <Text
            className="text-sm font-bold text-white"
            style={{
              color,
              fontSize: 12,
              fontWeight: focused ? "bold" : "normal",
            }}
          >
            Home
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                borderTopColor: focused ? "#FF6B35" : "transparent",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="home" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                borderTopColor: focused ? "#FF6B35" : "transparent",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="heart" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                borderTopColor: focused ? "#FF6B35" : "transparent",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                color={color}
                size={size}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                borderTopColor: focused ? "#FF6B35" : "transparent",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                borderTopColor: focused ? "#FF6B35" : "transparent",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="information-outline"
                color={color}
                size={size}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
