import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getStocks } from '../services/api';

export default function StockScreen({ navigation }) {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        try {
            const data = await getStocks();
            setStocks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.center} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Inventory Stock</Text>
            <FlatList
                data={stocks}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("StockEdit", { stock: item })}
                    >
                        <Text style={styles.stockItem}>Product ID: {item.productId}</Text>
                        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                        <Text style={styles.reorder}>Reorder Level: {item.reorderLevel}</Text>
                        <Text style={styles.hint}>(Tap to Edit)</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>Inventory is empty.</Text>
                        <Text style={styles.subText}>Add products from the Home screen.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8 },
    stockItem: { fontSize: 18, fontWeight: '600' },
    quantity: { fontSize: 16, color: 'blue' },
    reorder: { fontSize: 14, color: 'red' },
    hint: { fontSize: 12, color: 'gray', marginTop: 5 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 18, color: '#888', fontWeight: 'bold' },
    subText: { fontSize: 14, color: '#aaa', marginTop: 5 }
});
