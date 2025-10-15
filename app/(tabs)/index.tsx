import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">Home</Text>
      <Text className="text-lg text-gray-600 mt-2">Welcome to Infomovia!</Text>
    </View>
  );
}
