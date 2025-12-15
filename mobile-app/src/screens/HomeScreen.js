import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDashboardSummary } from "../services/api";
import Card from "../component/card";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("USER");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        setRole(userInfo.role);
      }
      const res = await getDashboardSummary();
      setData(res);
      // If dashboard summary doesn't return new metrics directly, we might need to adjust logic
      // Assuming getDashboardSummary returns the map we updated in DashboardService (with metrics keys)
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header, KPI, Grid, Footer content... */}
        <Text style={styles.header}>Application</Text>
        <Text style={styles.subHeader}>Business Intelligence Suite</Text>

        {/* KPI Section - Only for Admin/Analyst */}
        {(role === 'ADMIN' || role === 'ANALYST') && (
          <>
            <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
            <View style={styles.kpiGrid}>
              <Card title="Revenue" value={data?.totalRevenue ? `$${data.totalRevenue}` : "$0"} />
              <Card title="Profit" value={data?.totalProfit ? `$${data.totalProfit}` : "$0"} />
              <Card title="AOV" value={data?.averageOrderValue ? `$${data.averageOrderValue}` : "$0"} />
              <Card title="Margin" value={data?.profitMargin ? `${data.profitMargin}%` : "0%"} />
              <Card title="Churn Rate" value={data?.churnRate ? `${data.churnRate}%` : "0%"} />
              <Card title="Active Cust." value={data?.activeCustomers || "0"} />
              <Card title="Growth" value={data?.monthlyGrowth ? `${data.monthlyGrowth}%` : "0%"} />
            </View>
          </>
        )}

        {/* Operations Section */}
        <Text style={styles.sectionTitle}>Smart Operations</Text>
        <View style={styles.grid}>
          {/* CUSTOMER VIEW: Stock, My Orders, New Order, Notifications, Settings */}
          {role === 'CUSTOMER' && (
            <>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#2196F3' }]} onPress={() => navigation.navigate("Orders")}>
                <Text style={styles.navText}>🛒 My Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#673AB7' }]} onPress={() => navigation.navigate("PlaceOrder")}>
                <Text style={styles.navText}>➕ New Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#F44336' }]} onPress={() => Alert.alert("Settings", "Settings Page coming soon!")}>
                <Text style={styles.navText}>⚙️ Settings</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ADMIN & ANALYST VIEW: Everything */}
          {(role === 'ADMIN' || role === 'ANALYST') && (
            <>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#4CAF50' }]} onPress={() => navigation.navigate("Stock")}>
                <Text style={styles.navText}>📦 Inventory</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#2196F3' }]} onPress={() => navigation.navigate("Orders")}>
                <Text style={styles.navText}>🛒 Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#FF9800' }]} onPress={() => navigation.navigate("Reports")}>
                <Text style={styles.navText}>📊 Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#9C27B0' }]} onPress={() => navigation.navigate("Notifications")}>
                <Text style={styles.navText}>🔔 Alerts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#3F51B5' }]} onPress={() => navigation.navigate("ProductForm")}>
                <Text style={styles.navText}>🆕 New Product</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#607D8B' }]} onPress={() => navigation.navigate("Forecast")}>
                <Text style={styles.navText}>📈 Forecast</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navCard, { backgroundColor: '#E91E63' }]} onPress={() => navigation.navigate("Churn")}>
                <Text style={styles.navText}>📉 Churn Risk</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Button title="Refresh Data" onPress={loadData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', marginBottom: 5 },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 10, marginBottom: 15 },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  navCard: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3
  },
  navText: { color: 'white', fontSize: 18, fontWeight: '600' },

  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#d32f2f', marginBottom: 20, textAlign: 'center' },
  footer: { marginTop: 20 }
});
