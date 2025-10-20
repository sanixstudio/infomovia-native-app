import { Link } from "expo-router";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-theme-light" edges={['top', 'left', 'right']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-theme-dark">About</Text>
        <Text className="text-lg text-theme-medium mt-2">
          Learn more about Infomovia
        </Text>
        <Link asChild href="/" className="text-theme-accent">
          <Button title="Home" />
        </Link>
      </View>
    </SafeAreaView>
  );
}
