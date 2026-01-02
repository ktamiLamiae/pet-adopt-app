import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import Colors from '../../constants/Colors';

export default function PetDetails() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();


    const pet = {
        ...params,
        user: params.user ? JSON.parse(params.user) : null
    };

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: ''
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <PetInfo pet={pet} />

                <PetSubInfo pet={pet} />

                <AboutPet pet={pet} />

                <OwnerInfo pet={pet} />

                <View style={{ height: 100 }}></View>
            </ScrollView>

            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.adoptBtn}>
                    <Text style={styles.adoptText}>Adopt Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: 5,
        borderRadius: 10
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        padding: 20,
        backgroundColor: Colors.WHITE
    },
    adoptBtn: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15
    },
    adoptText: {
        textAlign: 'center',
        fontFamily: 'outfit-medium',
        fontSize: 20,
        color: Colors.WHITE
    }
});
