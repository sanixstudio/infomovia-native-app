import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-theme-dark">Home</Text>
      <Text className="text-lg text-theme-medium mt-2">Welcome to Infomovia!</Text>
    </View>
  );
}
