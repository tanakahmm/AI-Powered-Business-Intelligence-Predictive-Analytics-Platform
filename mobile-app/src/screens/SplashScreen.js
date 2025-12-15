import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.replace("Home");
        } else {
          navigation.replace("Login");
        }
      } catch (e) {
        navigation.replace("Login");
      }
    };

    // Small delay to show splash screen or just run check
    setTimeout(checkAuth, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        AI Business Intelligence
      </Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
