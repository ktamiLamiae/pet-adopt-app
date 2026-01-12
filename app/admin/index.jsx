import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { getAdminStats } from '../../services/adminService';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ totalPets: 0, totalUsers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        const result = await getAdminStats();
        if (result.success) {
            setStats(result.stats);
        }
        setLoading(false);
    };

    const AdminMenus = [
        {
            id: 1,
            name: 'Manage Pets',
            icon: 'paw',
            path: '/admin/pets',
            color: '#4CAF50'
        },
        {
            id: 2,
            name: 'Manage Users',
            icon: 'people',
            path: '/admin/users',
            color: '#2196F3'
        },
        {
            id: 3,
            name: 'Manage Categories',
            icon: 'apps',
            path: '/admin/categories',
            color: '#FF9800'
        }
    ];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
                </Pressable>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="paw" size={32} color="#4CAF50" />
                        <Text style={styles.statNumber}>{stats.totalPets}</Text>
                        <Text style={styles.statLabel}>Total Pets</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="people" size={32} color="#2196F3" />
                        <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Management</Text>
                {AdminMenus.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => router.push(item.path)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuText}>{item.name}</Text>
                            <Text style={styles.menuSubtext}>View and manage all {item.name.toLowerCase().split(' ')[1]}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={Colors.GRAY} />
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: Colors.WHITE,
    },
    content: {
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        flex: 0.48,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statNumber: {
        fontFamily: 'outfit-bold',
        fontSize: 28,
        color: Colors.BLACK,
        marginTop: 10,
    },
    statLabel: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY,
    },
    sectionTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.BLACK,
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuInfo: {
        flex: 1,
        marginLeft: 15,
    },
    menuText: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: Colors.BLACK,
    },
    menuSubtext: {
        fontFamily: 'outfit',
        fontSize: 12,
        color: Colors.GRAY,
    }
});
