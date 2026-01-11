import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from './../../config/FirebaseConfig';
import Colors from './../../constants/Colors';

export default function AddNewPet() {
    const navigation = useNavigation();
    const router = useRouter();
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [formData, setFormData] = useState({
        category: 'Cats',
        sex: 'Male'
    });
    const [gender, setGender] = useState('Male');
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cats');
    const [image, setImage] = useState();
    const [base64Image, setBase64Image] = useState();
    const [loader, setLoader] = useState(false);

    // Modal state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showGenderModal, setShowGenderModal] = useState(false);

    const generateRandomAvatar = () => {
        const id = Math.floor(Math.random() * 99) + 1;
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
    };
    useEffect(() => {
        navigation.setOptions({
            headerTitle: params?.id ? 'Edit Pet' : 'Add New Pet',
            headerShown: true,
            headerTransparent: false,
            headerStyle: { backgroundColor: Colors.PRIMARY },
            headerTintColor: Colors.WHITE
        })
    }, [params?.id])

    useEffect(() => {
        GetCategories();
    }, [])

    useEffect(() => {
        if (params?.id) {
            setFormData({
                name: params?.name,
                category: params?.category,
                breed: params?.breed,
                age: params?.age,
                sex: params?.sex,
                weight: params?.weight,
                address: params?.address,
                about: params?.about
            });
            setSelectedCategory(params?.category);
            setGender(params?.sex);
            setImage(params?.imageUrl);
        }
    }, [params?.id])

    const GetCategories = async () => {
        setCategoryList([]);
        const snapshot = await getDocs(collection(db, 'Category'));
        const categories = [];
        snapshot.forEach(doc => {
            categories.push(doc.data());
        });
        setCategoryList(categories);
    };

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
            base64: true
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setBase64Image("data:image/jpeg;base64," + result.assets[0].base64);
        }
    }

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const GetCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
            return;
        }

        setLoader(true);
        try {
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                const formattedAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim().replace(/^[ ,]+|[ ,]+$/g, '').replace(/ ,/g, ',');
                handleInputChange('address', formattedAddress);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show('Error fetching location', ToastAndroid.SHORT);
        } finally {
            setLoader(false);
        }
    }

    const onSubmit = () => {
        if (Object.keys(formData).length < 8 || !image) {
            ToastAndroid.show('Please fill all fields and pick an image', ToastAndroid.SHORT);
            return;
        }

        if (params?.id && !base64Image) {
            // Editing and image not changed
            setLoader(true);
            SaveFormData(image);
        } else {
            UploadImage();
        }
    }

    const UploadImage = async () => {
        if (!user) {
            ToastAndroid.show('Please sign in to upload images', ToastAndroid.SHORT);
            return;
        }

        setLoader(true);
        try {
            if (!base64Image) {
                throw new Error("No image data found. Please pick the image again.");
            }

            await SaveFormData(base64Image);

            if (Platform.OS === 'android') {
                ToastAndroid.show(params?.id ? 'Pet updated successfully!' : 'Pet added successfully!', ToastAndroid.SHORT);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error saving pet:', error);

            const message = error.message?.includes('too large')
                ? 'Image too large. Try a different one.'
                : 'Failed to add pet. Please try again.';

            if (Platform.OS === 'android') {
                ToastAndroid.show(message, ToastAndroid.LONG);
            } else {
                alert(message);
            }
        }
    }

    const SaveFormData = async (imageUrl) => {
        const docId = params?.id ? params.id : Date.now().toString();
        const userData = {
            name: user?.displayName || user?.email.split('@')[0],
            email: user?.email,
            imageUrl: user?.photoURL || generateRandomAvatar()
        };

        await setDoc(doc(db, 'Pets', docId), {
            ...formData,
            imageUrl: imageUrl,
            user: userData,
            id: docId,
            adopted: params?.id ? (formData.adopted || false) : false // Default to false for new pets
        });

        setLoader(false);

        // Navigate first, then clear form
        router.replace('/(tabs)/home');

        // Clear form after navigation if adding new pet (not editing)
        if (!params?.id) {
            setTimeout(() => {
                setFormData({
                    category: 'Cats',
                    sex: 'Male'
                });
                setGender('Male');
                setSelectedCategory('Cats');
                setImage(null);
                setBase64Image(null);
            }, 100);
        }
    }


    const renderPickerModal = (visible, setVisible, data, onSelect, title) => (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    onSelect(item.name || item);
                                    setVisible(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>{item.name || item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView style={{ padding: 20 }}>
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 20
                }}>{params?.id ? 'Edit Pet publication' : 'Add New Pet for adoption'}</Text>

                <TouchableOpacity
                    onPress={imagePicker}
                    style={styles.imageContainer}>
                    {!image ? <Image source={require('../../assets/images/project/pet-paw.jpg')}
                        style={styles.image}
                    /> :
                        <Image source={{ uri: image }}
                            style={styles.image}
                        />}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Name *</Text>
                    <TextInput
                        placeholder="Enter pet's name"
                        placeholderTextColor={Colors.GRAY}
                        value={formData.name}
                        style={styles.input}
                        onChangeText={(value) => handleInputChange('name', value)}
                    />
                </View>

                {/* Custom Category Selection */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Category *</Text>
                    <TouchableOpacity
                        style={styles.pickerContainer}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        <Text style={styles.pickerValue}>{selectedCategory}</Text>
                        <Text style={styles.pickerChevron}>▼</Text>
                    </TouchableOpacity>
                </View>

                {renderPickerModal(
                    showCategoryModal,
                    setShowCategoryModal,
                    categoryList,
                    (val) => {
                        setSelectedCategory(val);
                        handleInputChange('category', val);
                    },
                    "Select Category"
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Breed *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter breed"
                        placeholderTextColor={Colors.GRAY}
                        value={formData.breed}
                        onChangeText={(value) => handleInputChange('breed', value)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter age"
                        placeholderTextColor={Colors.GRAY}
                        value={formData.age}
                        keyboardType="numeric"
                        onChangeText={(value) => handleInputChange('age', value)}
                    />
                </View>

                {/* Custom Gender Selection */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender *</Text>
                    <TouchableOpacity
                        style={styles.pickerContainer}
                        onPress={() => setShowGenderModal(true)}
                    >
                        <Text style={styles.pickerValue}>{gender}</Text>
                        <Text style={styles.pickerChevron}>▼</Text>
                    </TouchableOpacity>
                </View>

                {renderPickerModal(
                    showGenderModal,
                    setShowGenderModal,
                    ['Male', 'Female'],
                    (val) => {
                        setGender(val);
                        handleInputChange('sex', val);
                    },
                    "Select Gender"
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weight *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter weight (kg)"
                        placeholderTextColor={Colors.GRAY}
                        value={formData.weight}
                        keyboardType="numeric"
                        onChangeText={(value) => handleInputChange('weight', value)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address *</Text>
                    <View style={styles.addressInputContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginTop: 0 }]}
                            placeholder="Enter address"
                            placeholderTextColor={Colors.GRAY}
                            value={formData.address}
                            onChangeText={(value) => handleInputChange('address', value)}
                        />
                        <TouchableOpacity
                            onPress={GetCurrentLocation}
                            style={styles.locationButton}>
                            <Ionicons name="location" size={24} color={Colors.PRIMARY} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>About *</Text>
                    <TextInput
                        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                        placeholder="Tell us more about the pet"
                        placeholderTextColor={Colors.GRAY}
                        value={formData.about}
                        numberOfLines={5}
                        multiline={true}
                        onChangeText={(value) => handleInputChange('about', value)}
                    />
                </View>

                <TouchableOpacity
                    disabled={loader}
                    onPress={onSubmit}
                    style={styles.button}>
                    {loader ? <ActivityIndicator size="large" color={Colors.WHITE} /> :
                        <Text style={styles.buttonText}>{params?.id ? 'Update Pet' : 'Submit'}</Text>}
                </TouchableOpacity>

                <View style={{ height: 50 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        marginTop: 20,
        alignItems: 'flex-start'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        backgroundColor: Colors.LIGHT_PRIMARY
    },
    inputContainer: {
        marginTop: 15
    },
    label: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY,
        marginBottom: 5
    },
    input: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        fontFamily: 'outfit',
        marginTop: 5,
        borderWidth: 1,
        borderColor: Colors.WHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    addressInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5
    },
    locationButton: {
        backgroundColor: Colors.WHITE,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.WHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        height: 60,
        justifyContent: 'center'
    },
    pickerContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.WHITE,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    pickerValue: {
        fontFamily: 'outfit',
        fontSize: 16
    },
    pickerChevron: {
        fontSize: 12,
        color: Colors.GRAY
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginTop: 30,
        marginBottom: 20
    },
    buttonText: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
        color: Colors.WHITE,
        textAlign: 'center'
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        padding: 20,
        maxHeight: '60%'
    },
    modalTitle: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center'
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    modalItemText: {
        fontFamily: 'outfit',
        fontSize: 16,
        textAlign: 'center'
    }
})
