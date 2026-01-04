
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/authService';
import { deleteUserAccount } from '../../services/userService';

export default function Profile() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await signOutUser();
                        if (result.success) {
                            router.replace('/');
                        } else {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        const result = await deleteUserAccount();
        setIsLoading(false);

        if (result.success) {
            Alert.alert('Account deleted', 'Your account and data have been successfully deleted.');
            router.replace('/');
        } else {
            if (result.error === 'auth/requires-recent-login') {
                Alert.alert(
                    'Re-authentication required',
                    'Please log in again to delete your account.'
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to delete account');
            }
        }
    };

    const Menu = [
        {
            id: 1,
            name: 'Add New Pet',
            icon: 'add-circle',
            path: '/add-new-pet'
        },
        {
            id: 5,
            name: 'My Post',
            icon: 'bookmark',
            path: '/user-post'
        },
        {
            id: 2,
            name: 'Favorites',
            icon: 'heart',
            path: '/(tabs)/favourite'
        },
        {
            id: 3,
            name: 'Inbox',
            icon: 'chatbubble',
            path: '/(tabs)/inbox'
        },
        {
            id: 4,
            name: 'Logout',
            icon: 'exit',
        },
        {
            id: 6,
            name: 'Delete Account',
            icon: 'trash'
        }
    ];

    const onPressMenu = (item) => {
        if (item.name === 'Logout') {
            handleLogout();
            return;
        }
        else if (item.name === 'Delete Account') {
            Alert.alert(
                'Delete Account',
                'This action is irreversible. Are you sure?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: handleDeleteAccount
                    }
                ]
            );
            return;
        }

        router.push(item.path);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={Menu}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.title}>Profile</Text>
                        </View>

                        <View style={styles.profileCard}>
                            <View style={styles.avatarContainer}>
                                {user?.photoURL ? (
                                    <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                                ) : (
                                    <Ionicons name="person-circle" size={80} color={Colors.PRIMARY} />
                                )}
                            </View>

                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                                <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.menuItem}
                        onPress={() => onPressMenu(item)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: Colors.LIGHT_PRIMARY || '#FFF9EB' }]}>
                            <Ionicons name={item.icon} size={24} color={Colors.PRIMARY} />
                        </View>
                        <Text style={styles.menuText}>{item.name}</Text>
                    </Pressable>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: Colors.PRIMARY,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 28,
        color: Colors.WHITE,
    },
    profileCard: {
        alignItems: 'center',
        padding: 20,
        marginTop: -30,
        marginHorizontal: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: Colors.BLACK,
        marginBottom: 5,
    },
    userEmail: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 20,
        marginTop: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
        color: Colors.BLACK,
        marginLeft: 20,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.BLACK,
        marginBottom: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        marginHorizontal: 20,
        marginTop: 30,
        padding: 15,
        borderRadius: 14,
        gap: 10,
    },
    logoutText: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.WHITE,
    },
});