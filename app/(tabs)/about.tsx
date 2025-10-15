import { Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-orange-500">About</Text>
      <Text className="text-lg text-gray-600 mt-2">
        Learn more about Infomovia
      </Text>
    </View>
  );
}
