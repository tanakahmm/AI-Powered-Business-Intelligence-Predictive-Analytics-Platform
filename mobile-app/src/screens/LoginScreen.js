// LoginScreen.js
import React from "react";
import { View, Text, Button } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Login (Demo)</Text>
      <Button title="Login" onPress={() => navigation.replace("Home")} />
    </View>
  );
}
