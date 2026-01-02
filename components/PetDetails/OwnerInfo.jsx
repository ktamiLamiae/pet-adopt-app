import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function OwnerInfo({ pet }) {
    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <Image
                    source={{ uri: pet?.user?.imageUrl }}
                    style={styles.userImage}
                />
                <View>
                    <Text style={styles.userName}>{pet?.user?.name}</Text>
                    <Text style={styles.userRole}>Pet Owner</Text>
                </View>
            </View>
            <Ionicons name="send-sharp" size={24} color={Colors.PRIMARY} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderColor: Colors.PRIMARY,
    },
    userContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 99
    },
    userName: {
        fontFamily: 'outfit-medium',
        fontSize: 17
    },
    userRole: {
        fontFamily: 'outfit',
        color: Colors.GRAY
    }
});
