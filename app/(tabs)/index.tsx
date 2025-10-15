import { ScrollView, Text, View } from "react-native";

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
      <View
        style={{
          width: 300,
          height: 300,
          backgroundColor: "#83c5be",
          borderRadius: 150,
          marginTop: 16,
        }}
      ></View>
      <View
        style={{
          width: 300,
          height: 300,
          backgroundColor: "#006d77",
          borderRadius: 150,
          marginTop: 16,
        }}
      ></View>
      <View
        style={{
          width: 300,
          height: 300,
          backgroundColor: "#83c5be",
          borderRadius: 150,
          marginTop: 16,
        }}
      ></View>
    </ScrollView>
  );
}
