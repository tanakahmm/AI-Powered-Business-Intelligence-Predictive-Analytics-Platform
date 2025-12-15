import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createProduct } from '../services/api';

export default function ProductFormScreen({ navigation }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [initialStock, setInitialStock] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            const userInfoStr = await AsyncStorage.getItem('userInfo');
            if (userInfoStr) {
                const userInfo = JSON.parse(userInfoStr);
                // Allow both ADMIN and ANALYST to create products if needed, or strictly ADMIN
                if (userInfo.role !== 'ADMIN') {
                    Alert.alert("Access Denied", "Only Admins can create products.");
                    navigation.goBack();
                }
            }
        };
        checkRole();
    }, []);

    const handleSubmit = async () => {
        if (!name || !category || !costPrice || !sellingPrice) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const productData = {
                name,
                category,
                initialStock: parseInt(initialStock) || 0,
                costPrice: parseFloat(costPrice),
                sellingPrice: parseFloat(sellingPrice),
                active
            };

            await createProduct(productData);
            Alert.alert("Success", "Product Created!");
            navigation.goBack();
        } catch (error) {
            console.error("Create Product Error:", error);
            Alert.alert("Error", error.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Laptop" />

                <Text style={styles.label}>Category</Text>
                <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="e.g. Electronics" />

                <Text style={styles.label}>Initial Stock</Text>
                <TextInput style={styles.input} value={initialStock} onChangeText={setInitialStock} placeholder="0" keyboardType="numeric" />

                <Text style={styles.label}>Cost Price</Text>
                <TextInput style={styles.input} value={costPrice} onChangeText={setCostPrice} placeholder="0.00" keyboardType="numeric" />

                <Text style={styles.label}>Selling Price</Text>
                <TextInput style={styles.input} value={sellingPrice} onChangeText={setSellingPrice} placeholder="0.00" keyboardType="numeric" />

                <View style={styles.row}>
                    <Text style={styles.label}>Active</Text>
                    <Switch value={active} onValueChange={setActive} />
                </View>

                <Button title={loading ? "Saving..." : "Create Product"} onPress={handleSubmit} disabled={loading} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 }
});
