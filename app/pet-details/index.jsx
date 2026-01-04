import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function PetDetails() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useAuth();


    const pet = {
        ...params,
        user: params.user ? JSON.parse(params.user) : null
    };

    useEffect(() => {
        // console.log(pet, user);
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: ''
        });
    }, []);

    const InitiateChat = async () => {
        try {
            const docId1 = user?.email + '_' + pet?.user?.email;
            const docId2 = pet?.user?.email + '_' + user?.email;

            const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
            const querySnapshot = await getDocs(q);

            let chatExists = false;
            querySnapshot.forEach((document) => {
                if (document.id === docId1 || document.id === docId2) {
                    chatExists = true;
                    navigation.navigate('chat/index', { id: document.id });
                }
            });

            if (!chatExists || querySnapshot.docs?.length === 0) {
                await setDoc(doc(db, 'Chat', docId1), {
                    id: docId1,
                    users: [
                        {
                            email: user?.email,
                            name: user?.displayName,
                            photoURL: user?.photoURL
                        },
                        {
                            email: pet?.user?.email,
                            name: pet?.user?.name,
                            imageUrl: pet?.user?.imageUrl
                        }
                    ],
                    userIds: [user?.email, pet?.user?.email],
                    createdAt: new Date()
                });

                navigation.navigate('chat/index', { id: docId1 });
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du chat:', error);
        }
    };

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
                <TouchableOpacity onPress={InitiateChat}
                    style={styles.adoptBtn}>
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
