import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function AboutPet({ pet }) {
    const [readMore, setReadMore] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>About {pet?.name}</Text>

            <Text
                style={styles.aboutText}
                numberOfLines={readMore ? undefined : 1}
                ellipsizeMode="tail"
            >
                {pet?.about}
            </Text>

            <Pressable onPress={() => setReadMore(!readMore)}>
                <Text style={styles.readMore}>
                    {readMore ? 'Read Less' : 'Read More'}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontFamily: 'outfit-medium',
        fontSize: 20
    },
    aboutText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.BLACK,
        lineHeight: 20
    },
    readMore: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.SECONDARY
    }
});
