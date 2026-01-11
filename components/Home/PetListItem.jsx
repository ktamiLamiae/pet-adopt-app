import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import MarkFav from "../MarkFav";

const PetListItem = ({ pet }) => {
    const router = useRouter();

    const navParams = useMemo(() => {
        const { user, ...petData } = pet;
        return {
            ...petData,
            userName: user?.name,
            userEmail: user?.email,
            userImageUrl: user?.imageUrl
        };
    }, [pet]);

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/pet-details',
                params: navParams
            })}
            style={styles.container}>
            <View style={{ position: 'absolute', zIndex: 10, right: 10, top: 10 }}>
                <MarkFav pet={pet} color={Colors.WHITE} />
            </View>
            <Image
                source={{ uri: pet?.imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.nameRow}>
                <Text style={styles.nameText}>{pet?.name}</Text>
                {pet.adopted && (
                    <View style={styles.adoptedBadge}>
                        <Text style={styles.adoptedText}>ADOPTED</Text>
                    </View>
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.breedText}>{pet?.breed}</Text>
                <Text style={styles.ageText}>{pet?.age} YRS</Text>
            </View>
        </TouchableOpacity>
    );
}

export default React.memo(PetListItem);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 5,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        flex: 1,
        maxWidth: '48%',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: 135,
        borderRadius: 10
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5
    },
    nameText: {
        fontFamily: 'outfit-medium',
        fontSize: 18
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    breedText: {
        fontFamily: 'outfit',
        color: Colors.GRAY
    },
    ageText: {
        fontFamily: 'outfit',
        color: Colors.PRIMARY,
        paddingHorizontal: 7,
        fontSize: 11,
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 10,
    },
    adoptedBadge: {
        backgroundColor: '#10B981', // Green
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    adoptedText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: 9
    }
});
