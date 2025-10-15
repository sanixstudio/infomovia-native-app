import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold text-red-500">Settings</Text>
      </View>
    </SafeAreaView>
  );
}
