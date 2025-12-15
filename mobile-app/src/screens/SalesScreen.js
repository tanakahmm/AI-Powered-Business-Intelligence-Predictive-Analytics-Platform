import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
    RefreshControl, Modal, TextInput, Alert, SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.4:8080/api";

export default function SalesScreen() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newSale, setNewSale] = useState({
        region: "", saleDate: "", revenue: "", profit: ""
    });

    const fetchSales = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(`${BASE_URL}/sales/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setSales(data);
            }
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSales();
    };

    const handleCreateSale = async () => {
        if (!newSale.region || !newSale.revenue) {
            Alert.alert("Error", "Region and Revenue are required");
            return;
        }
        try {
            const token = await AsyncStorage.getItem("userToken");
            const payload = {
                ...newSale,
                revenue: parseFloat(newSale.revenue),
                profit: parseFloat(newSale.profit),
                // Default date if empty
                saleDate: newSale.saleDate || new Date().toISOString().split('T')[0]
            };

            const response = await fetch(`${BASE_URL}/sales`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setModalVisible(false);
                setNewSale({ region: "", saleDate: "", revenue: "", profit: "" });
                fetchSales();
                Alert.alert("Success", "Sale recorded successfully");
            } else {
                Alert.alert("Error", "Failed to record sale");
            }
        } catch (error) {
            console.error("Error creating sale:", error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    const handleDeleteSale = async (id) => {
        Alert.alert(
            "Delete Sale",
            "Are you sure you want to delete this sale?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("userToken");
                            await fetch(`${BASE_URL}/sales/${id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchSales();
                        } catch (error) {
                            console.error("Error deleting sale:", error);
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.label}>Region:</Text>
                <Text style={styles.value}>{item.region}</Text>
                <TouchableOpacity onPress={() => handleDeleteSale(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{item.saleDate}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
                <Text style={styles.label}>Revenue:</Text>
                <Text style={styles.revenue}>₹{item.revenue?.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Profit:</Text>
                <Text style={styles.profit}>₹{item.profit?.toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sales History</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>+ Record Sale</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={sales}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
                        <Text style={styles.modalTitle}>Record New Sale</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Region"
                            value={newSale.region}
                            onChangeText={(text) => setNewSale({ ...newSale, region: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            value={newSale.saleDate}
                            onChangeText={(text) => setNewSale({ ...newSale, saleDate: text })}
                        />
                        <View style={styles.rowInput}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                placeholder="Revenue"
                                keyboardType="numeric"
                                value={newSale.revenue}
                                onChangeText={(text) => setNewSale({ ...newSale, revenue: text })}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                                placeholder="Profit"
                                keyboardType="numeric"
                                value={newSale.profit}
                                onChangeText={(text) => setNewSale({ ...newSale, profit: text })}
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
                                onPress={handleCreateSale}
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: "#666",
    },
    value: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    deleteText: {
        color: "red",
        fontWeight: "bold",
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 8,
    },
    revenue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#007AFF",
    },
    profit: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#388e3c",
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
    rowInput: {
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
