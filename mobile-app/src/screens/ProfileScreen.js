import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("userInfo");
            if (storedUser) {
                setUserInfo(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to load user info");
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("userToken");
                            await AsyncStorage.removeItem("userInfo");
                            // Navigate back to Welcome screen, resetting stack
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Welcome" }],
                            });
                        } catch (e) {
                            console.error("Logout failed", e);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                    </Text>
                </View>
                <Text style={styles.name}>{userInfo?.name || "User"}</Text>
                <Text style={styles.email}>{userInfo?.email || "email@example.com"}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{userInfo?.role || "USER"}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Security</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Help & Support</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: "#fff",
        alignItems: "center",
        padding: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    avatarText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    roleBadge: {
        backgroundColor: "#e3f2fd",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roleText: {
        color: "#007AFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    section: {
        marginTop: 20,
        backgroundColor: "#fff",
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#888",
        marginLeft: 20,
        marginBottom: 10,
        textTransform: "uppercase",
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuText: {
        fontSize: 16,
        color: "#333",
    },
    footer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    logoutButton: {
        backgroundColor: "#ffebee",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffcdd2",
    },
    logoutText: {
        color: "#d32f2f",
        fontSize: 16,
        fontWeight: "bold",
    },
});
