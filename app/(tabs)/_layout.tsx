import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Constants
const COLORS = {
  background: "#272640",
  active: "#FF6B35",
  text: "#ffffff",
} as const;

// Tab configuration
const TAB_CONFIG = [
  { name: "index", title: "Home", icon: "home" },
  { name: "saved", title: "Saved", icon: "heart" },
  { name: "search", title: "Search", icon: "magnify" },
  { name: "settings", title: "Settings", icon: "cog" },
  { name: "about", title: "About", icon: "information-outline" },
] as const;

// Reusable components
const TabLabel = ({ focused, color, title }: { focused: boolean; color: string; title: string }) => (
  <Text
    style={{
      color,
      fontSize: 12,
      fontWeight: focused ? "bold" : "normal",
    }}
  >
    {title}
  </Text>
);

const TabIcon = ({ focused, color, size, iconName }: { 
  focused: boolean; 
  color: string; 
  size: number; 
  iconName: string;
}) => (
  <View
    style={{
      borderTopColor: focused ? COLORS.active : "transparent",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons name={iconName as any} color={color} size={size} />
  </View>
);

// Screen options factory
const createTabOptions = (title: string, iconName: string) => ({
  title,
  headerShown: false,
  tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => (
    <TabLabel focused={focused} color={color} title={title} />
  ),
  tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <TabIcon focused={focused} color={color} size={size} iconName={iconName} />
  ),
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarItemStyle: {
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: COLORS.text,
        tabBarActiveBackgroundColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.text,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
      }}
    >
      {TAB_CONFIG.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={createTabOptions(title, icon)}
        />
      ))}
    </Tabs>
  );
}
