import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { adminDeletePet, onPetsUpdate } from '../../services/adminService';

export default function AdminPets() {
    const router = useRouter();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const unsubscribe = onPetsUpdate((updatedPets) => {
            setPets(updatedPets);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = (petId) => {
        Alert.alert(
            'Delete Pet',
            'Are you sure you want to delete this pet? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingId(petId);
                        try {
                            const result = await adminDeletePet(petId);
                            if (result.success) {
                                setPets(prevPets => prevPets.filter(p => p.id !== petId));
                                Alert.alert('Success', 'Pet deleted successfully');
                            } else {
                                Alert.alert('Error', result.error || 'Failed to delete pet');
                            }
                        } catch (err) {
                            Alert.alert('Error', 'An unexpected error occurred');
                        } finally {
                            setDeletingId(null);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
                </Pressable>
                <Text style={styles.headerTitle}>Manage Pets</Text>
            </View>

            <FlatList
                data={pets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.petCard}>
                        <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
                        <View style={styles.petInfo}>
                            <Text style={styles.petName}>{item.name}</Text>
                            <Text style={styles.petDetails}>{item.breed} • {item.category}</Text>
                            <Text style={styles.petOwner}>Owner: {item.user?.email}</Text>
                        </View>
                        <Pressable
                            onPress={() => handleDelete(item.id)}
                            style={styles.deleteButton}
                            disabled={deletingId === item.id}
                        >
                            {deletingId === item.id ? (
                                <ActivityIndicator size="small" color="#FF6B6B" />
                            ) : (
                                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                            )}
                        </Pressable>
                    </View>
                )}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No pets found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: Colors.WHITE,
    },
    petCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    petInfo: {
        flex: 1,
        marginLeft: 15,
    },
    petName: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: Colors.BLACK,
    },
    petDetails: {
        fontFamily: 'outfit',
        fontSize: 13,
        color: Colors.GRAY,
    },
    petOwner: {
        fontFamily: 'outfit',
        fontSize: 11,
        color: Colors.GRAY,
        marginTop: 2,
    },
    deleteButton: {
        padding: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
        marginTop: 50,
    }
});
