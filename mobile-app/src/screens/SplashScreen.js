// SplashScreen.js
import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => navigation.replace("Login"), 2000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
        AI Business Intelligence
      </Text>
    </View>
  );
}
