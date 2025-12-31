import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { user } = useAuth();

    const getInitial = () => {
        return (
            user?.displayName?.charAt(0) ||
            user?.email?.charAt(0) ||
            'U'
        ).toUpperCase();
    };

    const getAvatarColor = () => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];
        const initial = getInitial();
        const index = initial.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const renderAvatar = () => {
        if (user?.photoURL) {
            return (
                <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatar}
                />
            );
        }

        return (
            <View
                style={[
                    styles.avatarFallback,
                    { backgroundColor: getAvatarColor() }
                ]}
            >
                <Text style={styles.avatarText}>{getInitial()}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.welcome}>Welcome,</Text>
                <Text style={styles.username}>
                    {user?.displayName || 'User'}
                </Text>
            </View>

            {renderAvatar()}
        </View>
    );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcome: {
        fontFamily: 'outfit',
        fontSize: 18,
    },
    username: {
        fontFamily: 'outfit',
        fontSize: 25,
        fontWeight: '600',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarFallback: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'outfit',
        fontWeight: '600',
    },
});
