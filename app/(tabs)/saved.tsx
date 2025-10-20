import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-theme-light" edges={['top', 'left', 'right']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-theme-dark">Saved</Text>
        <Text className="text-lg text-theme-medium mt-2">
          Your saved items will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}
