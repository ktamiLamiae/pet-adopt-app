import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';


const WelcomeScreen = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/project/login.png')}
                style={styles.image}
            />
            <View style={styles.subContainer}>
                <Text style={styles.title}>
                    Ready to make a new friend?
                </Text>
                <Text style={styles.subtitle}>
                    Let's adopt the pet which you like and make there life happy again
                </Text>

                <Pressable style={styles.button} onPress={() => router.push('/Auth/login')}>
                    <Text style={styles.buttonText}>
                        Get Started
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        height: '100%',
    },
    image: {
        width: '100%',
        height: 600,
    },
    subContainer: {
        padding: 20,
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
        textAlign: 'center',
        color: Colors.GRAY,
        marginTop: 20,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 14,
        borderRadius: 14,
        width: '100%',
        marginTop: 60,
    },
    buttonText: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
})

export default WelcomeScreen;