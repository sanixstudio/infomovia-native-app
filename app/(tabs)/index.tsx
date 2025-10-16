import { ScrollView, Text } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#edf6f9",
      }}
    >
      <Text className="text-2xl font-bold text-theme-dark">Home</Text>
      <Text className="text-lg text-theme-medium mt-2">
        Welcome to Infomovia!
      </Text>
    </ScrollView>
  );
}
