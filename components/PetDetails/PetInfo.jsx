import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
                <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name}>{pet?.name}</Text>
                        {pet?.adopted && (
                            <View style={styles.adoptedBadge}>
                                <Text style={styles.adoptedText}>ADOPTED</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pet?.address)}`)}
                        style={styles.addressContainer}
                    >
                        <Ionicons name="location-outline" size={18} color={Colors.GRAY} />
                        <Text style={styles.address}>{pet?.address}</Text>
                    </TouchableOpacity>
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
        color: Colors.GRAY,
        flex: 1
    },
    addressContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        marginTop: 5
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    adoptedBadge: {
        backgroundColor: Colors.SECONDARY,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20
    },
    adoptedText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-medium',
        fontSize: 12
    }
});
