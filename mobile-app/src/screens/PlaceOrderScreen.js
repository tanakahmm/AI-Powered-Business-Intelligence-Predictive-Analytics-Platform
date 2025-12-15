import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { placeOrder, getProducts } from '../services/api';

export default function PlaceOrderScreen({ navigation }) {
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [fetchingProducts, setFetchingProducts] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                // Get Customer ID
                const userInfoStr = await AsyncStorage.getItem('userInfo');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    if (userInfo.customerId) {
                        setCustomerId(userInfo.customerId.toString());
                    } else {
                        // Fallback if no customer ID (e.g. old admin login)
                        setCustomerId("1");
                    }
                }

                // Get Products
                const productList = await getProducts();
                setProducts(productList);
            } catch (error) {
                console.error("Init Error:", error);
                Alert.alert("Error", "Failed to load initial data");
            } finally {
                setFetchingProducts(false);
            }
        };
        initialize();
    }, []);

    const handlePlaceOrder = async () => {
        if (!customerId || !productId || !quantity) {
            Alert.alert("Error", "Please select a product and enter quantity");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                customer: { customerId: parseInt(customerId) },
                product: { productId: parseInt(productId) },
                quantity: parseInt(quantity)
            };

            await placeOrder(orderData);
            Alert.alert("Success", "Order Placed Successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Place New Order</Text>

                <Text style={styles.label}>Customer ID (Auto-filled)</Text>
                <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={customerId}
                    editable={false}
                />

                <Text style={styles.label}>Select Product</Text>
                {fetchingProducts ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                    <View style={styles.productList}>
                        {products.map((prod) => (
                            <TouchableOpacity
                                key={prod.productId}
                                style={[styles.productItem, productId === prod.productId && styles.selectedProduct]}
                                onPress={() => setProductId(prod.productId)}
                            >
                                <Text style={[styles.productText, productId === prod.productId && styles.selectedProductText]}>
                                    {prod.name} - ${prod.sellingPrice}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Enter Quantity"
                    keyboardType="numeric"
                />

                <View style={styles.spacer} />
                <Button title={loading ? "Placing Order..." : "Confirm Order"} onPress={handlePlaceOrder} disabled={loading || !productId} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
    disabledInput: { backgroundColor: '#f0f0f0', color: '#666' },
    spacer: { height: 30 },
    productList: { maxHeight: 200, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
    productItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    selectedProduct: { backgroundColor: '#007AFF' },
    productText: { fontSize: 16 },
    selectedProductText: { color: '#fff', fontWeight: 'bold' }
});
