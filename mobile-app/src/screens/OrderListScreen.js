import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { getOrders } from '../services/api';

export default function OrderListScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return '#4CAF50';
            case 'SHIPPED': return '#2196F3';
            case 'PENDING': return '#FF9800';
            default: return '#757575';
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.center} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Order Management</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.orderId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.orderId}>Order #{item.orderId}</Text>
                            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                        </View>
                        <Text style={styles.date}>{item.orderDate}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.customerName}>Customer: {item.customer?.name || "Unknown"}</Text>
                        {item.product && (
                            <Text style={styles.product}>Product: {item.product.name} (Qty: {item.quantity})</Text>
                        )}
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No orders yet</Text>
                        <Text style={styles.subText}>Your order history will appear here.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontSize: 18, fontWeight: '600' },
    status: { fontWeight: 'bold', fontSize: 14 },
    date: { color: 'gray', fontSize: 12, marginTop: 4 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    customerName: { fontSize: 16, color: '#333' },
    product: { fontSize: 14, color: '#555', marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 18, color: '#888', fontWeight: 'bold' },
    subText: { fontSize: 14, color: '#aaa', marginTop: 5 }
});
