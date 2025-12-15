import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
    RefreshControl, Modal, TextInput, Alert, Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
  import { SafeAreaView } from 'react-native';

const BASE_URL = "http://192.168.1.4:8080/api";

export default function CustomerListScreen() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: "", email: "", phone: "", city: "", state: "", status: "Active"
    });

    const fetchCustomers = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(`${BASE_URL}/customers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCustomers();
    };

    const handleCreateCustomer = async () => {
        if (!newCustomer.name || !newCustomer.email) {
            Alert.alert("Error", "Name and Email are required");
            return;
        }
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(`${BASE_URL}/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newCustomer),
            });
            if (response.ok) {
                setModalVisible(false);
                setNewCustomer({ name: "", email: "", phone: "", city: "", state: "", status: "Active" });
                fetchCustomers();
                Alert.alert("Success", "Customer created successfully");
            } else {
                Alert.alert("Error", "Failed to create customer");
            }
        } catch (error) {
            console.error("Error creating customer:", error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    const handleDeleteCustomer = async (id) => {
        Alert.alert(
            "Delete Customer",
            "Are you sure you want to delete this customer?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("userToken");
                            await fetch(`${BASE_URL}/customers/${id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchCustomers();
                        } catch (error) {
                            console.error("Error deleting customer:", error);
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteCustomer(item.customerId)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.detailsRow}>
                <Text style={styles.detail}>Region: {item.city}, {item.state}</Text>
                <Text style={styles.detail}>Status: {item.status}</Text>
            </View>
        </View>
    );


    // ... inside component
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customers</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={customers}
                    keyExtractor={(item) => item.customerId?.toString() || Math.random().toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Customer</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={newCustomer.name}
                            onChangeText={(text) => setNewCustomer({ ...newCustomer, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={newCustomer.email}
                            autoCapitalize="none"
                            onChangeText={(text) => setNewCustomer({ ...newCustomer, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            value={newCustomer.phone}
                            keyboardType="phone-pad"
                            onChangeText={(text) => setNewCustomer({ ...newCustomer, phone: text })}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                placeholder="City"
                                value={newCustomer.city}
                                onChangeText={(text) => setNewCustomer({ ...newCustomer, city: text })}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                                placeholder="State"
                                value={newCustomer.state}
                                onChangeText={(text) => setNewCustomer({ ...newCustomer, state: text })}
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleCreateCustomer}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    addButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    deleteText: {
        color: "red",
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    detail: {
        fontSize: 12,
        color: "#555",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    row: {
        flexDirection: "row",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#ddd",
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        marginLeft: 10,
    },
    cancelButtonText: {
        color: "#333",
        fontWeight: "bold",
        fontSize: 16,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
