import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-theme-light">
      <Text className="text-2xl font-bold text-theme-dark">About</Text>
      <Text className="text-lg text-theme-medium mt-2">
        Learn more about Infomovia
      </Text>
      <Link asChild href="/" className="text-theme-accent">
        <Button title="Home" />
      </Link>
    </View>
  );
}
