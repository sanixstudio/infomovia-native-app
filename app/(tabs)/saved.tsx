import { Text, View } from "react-native";

export default function SavedScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-theme-light">
      <Text className="text-2xl font-bold text-theme-dark">Saved</Text>
      <Text className="text-lg text-theme-medium mt-2">
        Your saved items will appear here
      </Text>
    </View>
  );
}
