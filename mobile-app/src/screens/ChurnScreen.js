import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView, Alert } from "react-native";
import { predictChurn } from "../services/api";

export default function ChurnScreen() {
  const [form, setForm] = useState({
    last_purchase_days_ago: "",
    total_orders: "",
    total_spent: "",
    complaints: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    // Validation
    if (!form.last_purchase_days_ago || !form.total_orders || !form.total_spent || !form.complaints) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = {
        last_purchase_days_ago: Number(form.last_purchase_days_ago),
        total_orders: Number(form.total_orders),
        total_spent: Number(form.total_spent),
        complaints: Number(form.complaints)
      };
      const res = await predictChurn(data);
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to predict churn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Customer Churn Prediction</Text>

      <Text style={styles.label}>Last Purchase (days ago)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 30"
        keyboardType="numeric"
        value={form.last_purchase_days_ago}
        onChangeText={v => setForm({ ...form, last_purchase_days_ago: v })}
      />

      <Text style={styles.label}>Total Orders</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5"
        keyboardType="numeric"
        value={form.total_orders}
        onChangeText={v => setForm({ ...form, total_orders: v })}
      />

      <Text style={styles.label}>Total Spent (₹)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 12000"
        keyboardType="numeric"
        value={form.total_spent}
        onChangeText={v => setForm({ ...form, total_spent: v })}
      />

      <Text style={styles.label}>Complaints</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 1"
        keyboardType="numeric"
        value={form.complaints}
        onChangeText={v => setForm({ ...form, complaints: v })}
      />

      <View style={styles.buttonContainer}>
        <Button title="Predict Churn" onPress={handlePredict} disabled={loading} />
      </View>

      {loading && (
        <View style={styles.resultContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {error && (
        <View style={styles.resultContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Result</Text>
          <Text style={styles.resultText}>
            Churn Probability: <Text style={styles.resultValue}>{(result.churn_probability * 100).toFixed(1)}%</Text>
          </Text>
          <Text style={styles.resultText}>
            Risk Level: <Text style={[styles.resultValue, { color: getRiskColor(result.risk_level) }]}>
              {result.risk_level}
            </Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const getRiskColor = (risk) => {
  switch (risk) {
    case 'HIGH': return '#d32f2f';
    case 'MEDIUM': return '#f57c00';
    case 'LOW': return '#388e3c';
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  resultValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
