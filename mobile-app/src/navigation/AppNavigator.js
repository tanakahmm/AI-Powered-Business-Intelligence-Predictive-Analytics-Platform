import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import ChurnScreen from "../screens/ChurnScreen";
import ForecastScreen from "../screens/ForecastScreen";

import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      {/* Replaced 'Home' with 'Main' which loads the Tabs */}
      <Stack.Screen name="Home" component={TabNavigator} />
      {/* Inner stack screens that are detailed views from Dashboard */}
      <Stack.Screen name="Churn" component={ChurnScreen} />
      <Stack.Screen name="Forecast" component={ForecastScreen} />
      <Stack.Screen name="Stock" component={require('../screens/StockScreen').default} />
      <Stack.Screen name="Notifications" component={require('../screens/NotificationScreen').default} />
      <Stack.Screen name="Orders" component={require('../screens/OrderListScreen').default} />
      <Stack.Screen name="Reports" component={require('../screens/ReportScreen').default} />
      <Stack.Screen name="ProductForm" component={require('../screens/ProductFormScreen').default} />
      <Stack.Screen name="PlaceOrder" component={require('../screens/PlaceOrderScreen').default} />
      <Stack.Screen name="StockEdit" component={require('../screens/StockEditScreen').default} />
    </Stack.Navigator>
  );
}
