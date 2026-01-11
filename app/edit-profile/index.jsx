import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/authService';
import Colors from './../../constants/Colors';

export default function EditProfile() {
    const navigation = useNavigation();
    const router = useRouter();
    const { user, setUser } = useAuth();

    const [name, setName] = useState(user?.displayName || '');
    const [image, setImage] = useState(user?.photoURL || null);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Edit Profile',
            headerShown: true,
            headerTransparent: false,
            headerStyle: { backgroundColor: Colors.PRIMARY },
            headerTintColor: Colors.WHITE
        });
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
            base64: true
        });

        if (!result.canceled) {
            setImage("data:image/jpeg;base64," + result.assets[0].base64);
        }
    };

    const handleUpdate = async () => {
        if (!name.trim()) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Name cannot be empty', ToastAndroid.SHORT);
            } else {
                alert('Name cannot be empty');
            }
            return;
        }

        setLoader(true);
        const result = await updateUserProfile(name, image);
        setLoader(false);

        if (result.success) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
            }
            setUser(result.user);
            router.back();
        } else {
            const errorMsg = result.error || 'Failed to update profile';
            if (Platform.OS === 'android') {
                ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
            } else {
                alert(errorMsg);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: Colors.WHITE }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.imageSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatar} />
                        ) : (
                            <View style={styles.placeholderAvatar}>
                                <Ionicons name="person" size={50} color={Colors.GRAY} />
                            </View>
                        )}
                        <View style={styles.editIconBadge}>
                            <Ionicons name="camera" size={16} color={Colors.WHITE} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>Change Profile Picture</Text>
                </View>

                <View style={styles.inputSection}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor={Colors.GRAY}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={[styles.inputContainer, { opacity: 0.6 }]}>
                        <Text style={styles.label}>Email (Cannot be changed)</Text>
                        <TextInput
                            style={styles.input}
                            value={user?.email}
                            editable={false}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    disabled={loader}
                    onPress={handleUpdate}
                    style={styles.button}
                >
                    {loader ? (
                        <ActivityIndicator size="small" color={Colors.WHITE} />
                    ) : (
                        <Text style={styles.buttonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        alignItems: 'center',
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: Colors.PRIMARY,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.WHITE,
    },
    changePhotoText: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: Colors.PRIMARY,
        marginTop: 15,
    },
    inputSection: {
        width: '100%',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY,
        marginBottom: 8,
        marginLeft: 5,
    },
    input: {
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        fontFamily: 'outfit',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    button: {
        width: '100%',
        padding: 16,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.WHITE,
        textAlign: 'center',
    },
});
