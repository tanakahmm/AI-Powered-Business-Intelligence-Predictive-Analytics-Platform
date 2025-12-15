import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>AI Business Intelligence</Text>
                <Text style={styles.subtitle}>
                    Predictive analytics and insights for your business growth.
                </Text>

                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.signupButton]}
                    onPress={() => navigation.navigate("Signup")}
                >
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 20,
    },
    contentContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    button: {
        width: "100%",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: "#007AFF",
    },
    signupButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#007AFF",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    signupButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
