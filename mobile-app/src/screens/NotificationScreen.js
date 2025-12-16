import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getNotifications, markNotificationRead } from '../services/api';

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getNotifications();
            if (data) {
                setNotifications(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id) => {
        try {
            await markNotificationRead(id);
            loadData(); // Refresh
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.center} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.notificationId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleRead(item.notificationId)} style={[styles.item, !item.read && styles.unread]}>
                        <Text style={styles.msg}>{item.message}</Text>
                        <Text style={styles.type}>{item.type} - {item.severity}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ fontSize: 18, color: '#888' }}>No notifications</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 5 },
    unread: { backgroundColor: '#e3f2fd' },
    msg: { fontSize: 16 },
    type: { fontSize: 12, color: 'gray', marginTop: 5 },
    center: { flex: 1, justifyContent: 'center' }
});
