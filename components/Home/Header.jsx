import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../Avatar';

export default function Header() {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.welcome}>Welcome,</Text>
                <Text style={styles.username}>
                    {user?.displayName || 'User'}
                </Text>
            </View>

            <Link href="(tabs)/profile">
                <Avatar user={user} size={40} />
            </Link>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    welcome: {
        fontFamily: 'outfit',
        fontSize: 18,
    },
    username: {
        fontFamily: 'outfit',
        fontSize: 25,
        fontWeight: '600',
    }
});
