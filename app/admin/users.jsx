import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { onUsersUpdate } from '../../services/adminService';

export default function AdminUsers() {
    const router = useRouter();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const unsubscribe = onUsersUpdate((updatedUsers) => {
            setUsers(updatedUsers);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
                </Pressable>
                <Text style={styles.headerTitle}>Manage Users</Text>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{item.displayName?.charAt(0) || 'U'}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.displayName || 'Unknown'}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                            <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#E3F2FD' : '#F5F5F5' }]}>
                                <Text style={[styles.roleText, { color: item.role === 'admin' ? '#2196F3' : Colors.GRAY }]}>
                                    {item.role || 'user'}
                                </Text>
                            </View>
                        </View>

                    </View>
                )}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
            />
        </View>
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
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#F9F9F9',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.PRIMARY + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        color: Colors.PRIMARY,
    },
    userInfo: {
        flex: 1,
        marginLeft: 15,
    },
    userName: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: Colors.BLACK,
    },
    userEmail: {
        fontFamily: 'outfit',
        fontSize: 13,
        color: Colors.GRAY,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
        marginTop: 4,
    },
    roleText: {
        fontFamily: 'outfit-medium',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    emptyText: {
        textAlign: 'center',
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
        marginTop: 50,
    },

});
