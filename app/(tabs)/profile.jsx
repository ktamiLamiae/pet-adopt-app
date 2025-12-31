import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/authService';

export default function Profile() {
    const router = useRouter();
    const { user } = useAuth();

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={100} color={Colors.PRIMARY} />
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                </View>
            </View>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
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
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        marginBottom: 10,
    },
    menuText: {
        flex: 1,
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.BLACK,
        marginLeft: 15,
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