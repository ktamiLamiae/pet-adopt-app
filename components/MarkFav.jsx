import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import Shared from '../shared/Shared';

export default function MarkFav({ pet }) {

    const { user, favList, setFavList } = useAuth();

    const AddToFav = async () => {
        const updatedFavList = [...favList, Number(pet.id)];
        setFavList(updatedFavList);
        await Shared.UpdateFav(user, updatedFavList);
    }

    const RemoveFromFav = async () => {
        const updatedFavList = favList.filter(item => Number(item) !== Number(pet.id));
        setFavList(updatedFavList);
        await Shared.UpdateFav(user, updatedFavList);
    }

    return (
        <View>
            {favList?.some(item => Number(item) === Number(pet.id)) ? (
                <Pressable onPress={() => RemoveFromFav()}>
                    <Ionicons name="heart" size={30} color={Colors.RED} />
                </Pressable>
            ) : (
                <Pressable onPress={() => AddToFav()}>
                    <Ionicons name="heart-outline" size={30} color={Colors.GRAY} />
                </Pressable>
            )}
        </View>
    )
}