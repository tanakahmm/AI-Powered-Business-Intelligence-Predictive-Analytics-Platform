import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../services/api';
// Note: We need to export BASE_URL from api.js or create a createProduct function. 
// For now, I'll assume we add createProduct to api.js or use fetch directly.

export default function ProductFormScreen({ navigation }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const checkRole = async () => {
            const userInfoStr = await AsyncStorage.getItem('userInfo');
            if (userInfoStr) {
                const userInfo = JSON.parse(userInfoStr);
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
            const token = await AsyncStorage.getItem('userToken');
            const productData = {
                name,
                category,
                costPrice: parseFloat(costPrice),
                sellingPrice: parseFloat(sellingPrice),
                active
            };

            const response = await fetch(`${BASE_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                Alert.alert("Success", "Product Created!");
                navigation.goBack();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to create product");
            }
        } catch (error) {
            console.error("Create Product Error:", error);
            Alert.alert("Error", "Failed to create product");
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
