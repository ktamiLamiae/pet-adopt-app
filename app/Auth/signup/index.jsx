import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { signUpWithEmail } from '../../../services/authService';

export default function Signup() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSignup = async () => {
        // Validation
        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await signUpWithEmail(email, password, fullName);
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Account created successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/(tabs)/home')
                }
            ]);
        } else {
            Alert.alert('Sign Up Failed', result.error);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
            <View style={styles.subContainer}>
                <Text style={styles.title}>Create New Account</Text>
                <Text style={styles.subtitle}>Welcome! Please enter your details.</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color={Colors.GRAY} style={styles.icon} />
                        <TextInput
                            placeholder='Enter your full name'
                            placeholderTextColor={Colors.GRAY}
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            editable={!loading}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color={Colors.GRAY} style={styles.icon} />
                        <TextInput
                            placeholder='Enter your email'
                            placeholderTextColor={Colors.GRAY}
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            editable={!loading}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.GRAY} style={styles.icon} />
                        <TextInput
                            placeholder='Enter your password (min 6 characters)'
                            placeholderTextColor={Colors.GRAY}
                            secureTextEntry={true}
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            editable={!loading}
                        />
                    </View>
                </View>

                <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleEmailSignup}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Create Account</Text>
                    )}
                </Pressable>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>Or continue with</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialContainer}>
                    <Pressable
                        style={styles.socialButton}
                        // onPress={handleGoogleSignup}
                        disabled={loading}
                    >
                        <Ionicons name="logo-google" size={24} color="black" />
                        <Text style={styles.socialText}>Google</Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={() => router.push('/Auth/login')}
                    style={styles.loginLink}
                    disabled={loading}
                >
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
                    </Text>
                </Pressable>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        flex: 1,
    },
    subContainer: {
        padding: 20,
        backgroundColor: Colors.WHITE,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: 16,
        textAlign: 'center',
        color: Colors.GRAY,
        marginTop: 10,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontFamily: 'outfit',
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontFamily: 'outfit',
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 14,
        width: '100%',
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.GRAY,
        opacity: 0.5,
    },
    dividerText: {
        marginHorizontal: 10,
        color: Colors.GRAY,
        fontFamily: 'outfit',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 10,
        gap: 10,
    },
    socialText: {
        fontFamily: 'outfit',
        fontSize: 16,
    },
    loginLink: {
        marginTop: 20,
        marginBottom: 20,
    },
    loginText: {
        textAlign: 'center',
        fontFamily: 'outfit',
        color: Colors.GRAY,
    }
})
