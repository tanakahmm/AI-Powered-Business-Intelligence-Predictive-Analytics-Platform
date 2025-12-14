import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { getDashboardSummary } from "../services/api";
import Card from "../component/card";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      setData(res);
    } catch (err) {
      console.log("API ERROR:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Button title="Retry" onPress={loadData} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No data available</Text>
        <Button title="Retry" onPress={loadData} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Card title="Revenue" value={data.revenue} />
      <Card title="Profit" value={data.profit} />
      <Card title="Customers" value={data.customers} />
      <Card title="Growth" value={data.growth} />

      <View style={styles.buttonContainer}>
        <Button
          title="Churn Prediction"
          onPress={() => navigation.navigate("Churn")}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Sales Forecast"
          onPress={() => navigation.navigate("Forecast")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10,
  },
});
