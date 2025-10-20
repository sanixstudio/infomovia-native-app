import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-theme-dark">Settings</Text>
      </View>
    </SafeAreaView>
  );
}
