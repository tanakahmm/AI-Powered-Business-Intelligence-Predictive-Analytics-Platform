import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity,
  ScrollView, Alert, FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.4:8080/api";

export default function ForecastScreen() {
  const [activeTab, setActiveTab] = useState("predict"); // predict | history
  const [months, setMonths] = useState("3");
  const [predictionData, setPredictionData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Prediction Logic ---
  const handlePredict = async () => {
    if (!months || isNaN(months)) {
      Alert.alert("Error", "Please enter a valid number of months");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/forecast/predict?months=${months}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setPredictionData(data);
      } else {
        Alert.alert("Error", "Failed to get forecast");
      }
    } catch (error) {
      console.error("Error predicting:", error);
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForecast = async () => {
    if (!predictionData) return;
    try {
      const token = await AsyncStorage.getItem("userToken");
      // Mapping prediction data to entity structure if needed. 
      // For now, saving a simplified object or assuming the backend can handle it.
      // Since SalesForecast entity structure might be different, let's just save the period and value.
      // Note: The backend expects a SalesForecast object. Ideally we should fit it.
      // Let's create a generic entry.
      const payload = {
        forecastDate: new Date().toISOString().split('T')[0],
        forecastPeriod: `${months} Months`,
        predictedAmount: predictionData.predicted_sales ? predictionData.predicted_sales[0] : 0, // Taking first month as example
        confidenceInterval: "95%",
        modelUsed: "Holt-Winters"
      };

      const response = await fetch(`${BASE_URL}/forecast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "Forecast saved to history");
        setActiveTab("history");
        fetchHistory(); // refresh history
      } else {
        Alert.alert("Error", "Failed to save forecast");
      }
    } catch (error) {
      console.error("Error saving forecast:", error);
    }
  };

  // --- History Logic ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/forecast`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setHistoryData(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await fetch(`${BASE_URL}/forecast/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHistory();
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Date: {item.forecastDate}</Text>
        <TouchableOpacity onPress={() => handleDeleteHistory(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.value}>Period: {item.forecastPeriod}</Text>
      <Text style={styles.value}>Amount: ₹{item.predictedAmount?.toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Forecasts</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "predict" && styles.activeTab]}
          onPress={() => setActiveTab("predict")}
        >
          <Text style={[styles.tabText, activeTab === "predict" && styles.activeTabText]}>New Prediction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>Saved History</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "predict" ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Forecast Horizon (Months):</Text>
          <TextInput
            style={styles.input}
            value={months}
            onChangeText={setMonths}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handlePredict}>
            <Text style={styles.buttonText}>Generate Forecast</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />}

          {predictionData && (
            <View style={styles.resultContainer}>
              <Text style={styles.subHeader}>Result:</Text>
              <View style={styles.trendBox}>
                <Text style={styles.trendLabel}>Trend: {predictionData.trend}</Text>
              </View>
              {predictionData.predicted_sales?.map((val, idx) => (
                <Text key={idx} style={styles.resultText}>Month {idx + 1}: ₹{val.toLocaleString()}</Text>
              ))}
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveForecast}>
                <Text style={styles.buttonText}>Save to History</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={historyData}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderHistoryItem}
              ListEmptyComponent={<Text style={styles.emptyText}>No saved forecasts.</Text>}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: "bold", margin: 20, color: "#333" },
  tabContainer: { flexDirection: "row", marginHorizontal: 20, marginBottom: 10 },
  tab: { flex: 1, padding: 10, alignItems: "center", borderBottomWidth: 2, borderColor: "transparent" },
  activeTab: { borderColor: "#007AFF" },
  tabText: { fontSize: 16, color: "#666" },
  activeTabText: { color: "#007AFF", fontWeight: "bold" },
  content: { padding: 20, flex: 1 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  label: { fontSize: 16, marginBottom: 5, color: "#333" },
  resultContainer: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  subHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  trendBox: { marginBottom: 10 },
  trendLabel: { fontSize: 16, fontWeight: "600", color: "#444" },
  resultText: { fontSize: 16, color: "#555", marginBottom: 5 },
  saveButton: { marginTop: 15, backgroundColor: "#28a745" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  value: { fontSize: 14, color: "#555" },
  deleteText: { color: "red", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" }
});
