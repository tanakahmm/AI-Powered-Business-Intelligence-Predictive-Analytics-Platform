import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateStock } from '../services/api';

export default function StockEditScreen({ route, navigation }) {
    const { stock } = route.params; // Expecting stock object passed via navigation
    const [quantity, setQuantity] = useState(stock.quantity.toString());
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!quantity) {
            Alert.alert("Error", "Please enter quantity");
            return;
        }

        setLoading(true);
        try {
            await updateStock(stock.productId, parseInt(quantity));
            Alert.alert("Success", "Stock Updated!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update stock");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Update Stock</Text>
            <Text style={styles.label}>Product ID: {stock.productId}</Text>

            <Text style={styles.label}>Current Quantity: {stock.quantity}</Text>

            <Text style={styles.label}>New Quantity</Text>
            <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
            />

            <View style={styles.spacer} />
            <Button title={loading ? "Updating..." : "Update Stock"} onPress={handleUpdate} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 20 },
    spacer: { height: 20 }
});
