import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Header from "../../components/Home/Header";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Slider from "../../components/Home/Slider";
import Colors from "../../constants/Colors";

export default function Home() {
    return (
        <View style={{
            padding: 20,
            marginTop: 20,
            flex: 1
        }}>

            <Header />

            <Slider />

            <View style={{ flex: 1 }}>
                <PetListByCategory />
            </View>

            <Link href={'/add-new-pet'}
                style={styles.newPost}>
                <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
                <Text style={styles.text}>Add New Pet</Text>
            </Link>

        </View>
    );
}

const styles = StyleSheet.create({
    newPost: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 5,
        textAlign: 'center',
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderStyle: 'dashed',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'outfit-medium',
        color: Colors.PRIMARY
    }
})