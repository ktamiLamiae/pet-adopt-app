import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import MarkFav from '../MarkFav';

export default function PetInfo({ pet }) {
    return (
        <View>
            <Image
                source={{ uri: pet?.imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <View>
                    <Text style={styles.name}>{pet?.name}</Text>
                    <Text style={styles.address}>{pet?.address}</Text>
                </View>
                <MarkFav pet={pet} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 500
    },
    infoContainer: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        fontFamily: 'outfit-bold',
        fontSize: 27
    },
    address: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY
    }
});
