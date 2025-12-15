import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define API URL
const REGISTER_URL = "http://192.168.1.4:8080/api/auth/register";

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(REGISTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Auto login on successful registration
            await AsyncStorage.setItem("userToken", data.token);
            await AsyncStorage.setItem(
                "userInfo",
                JSON.stringify({
                    name: data.name,
                    email: data.email,
                    role: data.role,
                })
            );

            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => navigation.replace("Home") },
            ]);
        } catch (error) {
            console.error("Signup Error:", error);
            Alert.alert("Signup Failed", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <>
                    <Text style={{ marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>Select Role:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <TouchableOpacity
                            style={[styles.roleButton, role === "CUSTOMER" && styles.selectedRole]}
                            onPress={() => setRole("CUSTOMER")}>
                            <Text style={[styles.roleText, role === "CUSTOMER" && styles.selectedRoleText]}>Customer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.roleButton, role === "ANALYST" && styles.selectedRole]}
                            onPress={() => setRole("ANALYST")}>
                            <Text style={[styles.roleText, role === "ANALYST" && styles.selectedRoleText]}>Analyst</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.roleButton, role === "ADMIN" && styles.selectedRole]}
                            onPress={() => setRole("ADMIN")}>
                            <Text style={[styles.roleText, role === "ADMIN" && styles.selectedRoleText]}>Admin</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 40,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 14,
        color: "#666",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    linkButton: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#007AFF",
        fontSize: 14,
    },
    roleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 5,
        width: '30%',
        alignItems: 'center'
    },
    selectedRole: {
        backgroundColor: '#007AFF'
    },
    roleText: {
        color: '#007AFF'
    },
    selectedRoleText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
