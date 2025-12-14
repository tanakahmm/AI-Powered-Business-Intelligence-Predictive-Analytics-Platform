import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChurnScreen from "../screens/ChurnScreen";
import ForecastScreen from "../screens/ForecastScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Churn" component={ChurnScreen} />
      <Stack.Screen name="Forecast" component={ForecastScreen} />
    </Stack.Navigator>
  );
}
