import { View } from "react-native";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";

export default function Home() {
    return (
        <View style={{
            padding: 20, marginTop: 20
        }}>
            {/*header*/}

            <Header />

            {/*Slide*/}
            <Slider />
            {/*Category*/}


            {/*list of pets*/}


            {/*add new pet option */}

        </View>
    );
}