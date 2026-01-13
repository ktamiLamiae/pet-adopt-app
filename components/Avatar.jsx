import { Image, StyleSheet, Text, View } from 'react-native';

export default function Avatar({ user, size = 40, style }) {
    const avatar = user?.photoURL || user?.avatar || user?.imageUrl;

    const getInitial = () => {
        return (
            user?.displayName?.charAt(0) ||
            user?.fullName?.charAt(0) ||
            user?.name?.charAt(0) ||
            user?.email?.charAt(0) ||
            'U'
        ).toUpperCase();
    };

    const getAvatarColor = () => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#FF8A80', '#82B1FF', '#B9F6CA', '#FFD180'
        ];

        const email = user?.email || '';
        if (email) {
            const hash = email.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            return colors[Math.abs(hash) % colors.length];
        }
        return colors[0];
    };

    const avatarSize = {
        width: size,
        height: size,
        borderRadius: size / 2
    };

    const fontSize = size * 0.45;

    if (avatar && avatar !== 'https://via.placeholder.com/150') {
        return (
            <Image
                source={{ uri: avatar }}
                style={[styles.avatar, avatarSize, style]}
                onError={(e) => {
                    console.log('Erreur chargement image:', e.nativeEvent.error);
                }}
            />
        );
    }

    return (
        <View
            style={[
                styles.avatarFallback,
                avatarSize,
                { backgroundColor: getAvatarColor() },
                style
            ]}
        >
            <Text style={[styles.avatarText, { fontSize }]}>
                {getInitial()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        resizeMode: 'cover'
    },
    avatarFallback: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        color: '#fff',
        fontFamily: 'outfit-medium',
        fontWeight: '600'
    }
});