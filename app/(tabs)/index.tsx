import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-theme-light">
      <Text className="text-2xl font-bold text-theme-dark">
        Welcome to Infomovia!
      </Text>
      <Text className="text-lg text-theme-medium mt-2">
        Where you can find the best information about the world
      </Text>
    </View>
  );
}
