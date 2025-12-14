import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Button } from "react-native";
import { getForecast } from "../services/api";

export default function ForecastScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getForecast(3);
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load forecast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading forecast...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Button title="Retry" onPress={loadForecast} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No forecast data available</Text>
        <Button title="Retry" onPress={loadForecast} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sales Forecast (Next 3 Months)</Text>

      <View style={styles.forecastContainer}>
        {data.predicted_sales && data.predicted_sales.map((value, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.monthText}>Month {index + 1}</Text>
            <Text style={styles.valueText}>₹{value.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>

      <View style={styles.trendContainer}>
        <Text style={styles.trendLabel}>Trend:</Text>
        <Text style={[styles.trendValue, { color: data.trend === 'UPWARD' ? '#388e3c' : '#d32f2f' }]}>
          {data.trend} {data.trend === 'UPWARD' ? '📈' : '📉'}
        </Text>
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
    fontSize: 24,
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
  forecastContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  trendContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 18,
    color: '#555',
    marginRight: 10,
  },
  trendValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
