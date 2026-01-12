import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';
import { addCategory, adminDeleteCategory, getCategories, onCategoriesUpdate } from '../../services/adminService';

export default function AdminCategories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const unsubscribe = onCategoriesUpdate((updatedCategories) => {
            setCategories(updatedCategories);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const result = await getCategories();
        if (result.success) {
            setCategories(result.categories);
        }
        setLoading(false);
    };

    const handleDeleteCategory = (categoryName) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${categoryName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingId(categoryName);
                        const result = await adminDeleteCategory(categoryName);
                        if (result.success) {
                            Alert.alert('Success', 'Category deleted successfully');
                        } else {
                            Alert.alert('Error', result.error);
                        }
                        setDeletingId(null);
                    }
                }
            ]
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim() || !selectedImage) {
            Alert.alert('Error', 'Please provide both a name and an image.');
            return;
        }

        setIsSubmitting(true);
        const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`;
        const result = await addCategory(newCategoryName.trim(), base64Image);
        setIsSubmitting(false);

        if (result.success) {
            Alert.alert('Success', 'Category added successfully!');
            setNewCategoryName('');
            setSelectedImage(null);
            fetchCategories();
        } else {
            Alert.alert('Error', result.error);
        }
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
                <Text style={styles.headerTitle}>Manage Categories</Text>
            </View>

            <View style={styles.addSection}>
                <Text style={styles.sectionTitle}>Add New Category</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Category Name"
                        value={newCategoryName}
                        onChangeText={setNewCategoryName}
                    />
                    <Pressable onPress={pickImage} style={styles.imagePicker}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                        ) : (
                            <Ionicons name="camera" size={24} color={Colors.PRIMARY} />
                        )}
                    </Pressable>
                </View>
                <Pressable
                    onPress={handleAddCategory}
                    style={[styles.addButton, isSubmitting && styles.disabledButton]}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={Colors.WHITE} />
                    ) : (
                        <Text style={styles.addButtonText}>Add Category</Text>
                    )}
                </Pressable>
            </View>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id || item.name}
                renderItem={({ item }) => (
                    <View style={styles.categoryCard}>
                        <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                        </View>
                        <Pressable
                            onPress={() => handleDeleteCategory(item.name)}
                            style={styles.deleteButton}
                            disabled={deletingId === item.name}
                        >
                            {deletingId === item.name ? (
                                <ActivityIndicator size="small" color="#FF6B6B" />
                            ) : (
                                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                            )}
                        </Pressable>
                    </View>
                )}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
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
    addSection: {
        padding: 20,
        backgroundColor: '#F9F9F9',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    sectionTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.BLACK,
        marginBottom: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontFamily: 'outfit',
        borderWidth: 1,
        borderColor: '#DDD',
        marginRight: 10,
    },
    imagePicker: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    addButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    categoryImage: {
        width: 45,
        height: 45,
        borderRadius: 8,
    },
    categoryInfo: {
        flex: 1,
        marginLeft: 12,
    },
    categoryName: {
        fontFamily: 'outfit-bold',
        fontSize: 14,
        color: Colors.BLACK,
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        textAlign: 'center',
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
        marginTop: 50,
    }
});

