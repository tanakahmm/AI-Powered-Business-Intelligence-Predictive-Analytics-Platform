import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getReports } from '../services/api';

export default function ReportScreen() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await getReports();
            setReports(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.center} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Business Reports</Text>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.reportId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.type}>{item.reportType} REPORT</Text>
                        <Text style={styles.date}>{item.startDate} to {item.endDate}</Text>
                        <View style={styles.contentBox}>
                            <Text style={styles.data}>{item.data}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No reports generated yet.</Text>}
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
    type: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
    date: { color: 'gray', fontSize: 12, marginBottom: 10 },
    contentBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
    data: { fontSize: 14, fontFamily: 'monospace' },
    center: { flex: 1, justifyContent: 'center' },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray' }
});
