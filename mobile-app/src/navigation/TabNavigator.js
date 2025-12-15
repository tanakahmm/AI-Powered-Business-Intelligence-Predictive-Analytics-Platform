import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import CustomerListScreen from "../screens/CustomerListScreen";
import SalesScreen from "../screens/SalesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRole = async () => {
            try {
                const userInfoStr = await AsyncStorage.getItem('userInfo');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    setRole(userInfo.role);
                } else {
                    setRole("CUSTOMER"); // Default fallback
                }
            } catch (e) {
                console.log("Error loading role in TabNav", e);
                setRole("CUSTOMER");
            } finally {
                setLoading(false);
            }
        };
        loadRole();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Dashboard") {
                        iconName = focused ? "stats-chart" : "stats-chart-outline";
                    } else if (route.name === "Customers") {
                        iconName = focused ? "people" : "people-outline";
                    } else if (route.name === "Sales") {
                        iconName = focused ? "cash" : "cash-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="Dashboard" component={HomeScreen} />

            {/* Conditional Tabs */}
            {(role === "ADMIN" || role === "ANALYST") && (
                <>
                    <Tab.Screen name="Customers" component={CustomerListScreen} />
                    <Tab.Screen name="Sales" component={SalesScreen} />
                </>
            )}

            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

