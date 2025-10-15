import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold text-purple-500">
          Search
        </Text>
        <Text className="text-lg text-gray-600 mt-2">
          Search for content here
        </Text>
      </View>
    </SafeAreaView>
  );
}
