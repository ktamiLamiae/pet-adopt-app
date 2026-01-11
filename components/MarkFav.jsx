import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import Shared from '../shared/Shared';

export default function MarkFav({ pet }) {
    const { user, favList, setFavList, refreshFavorites } = useAuth();

    const AddToFav = async () => {
        const updatedFavList = [...favList, pet.id];
        setFavList(updatedFavList);
        await Shared.UpdateFav(user, updatedFavList);
        refreshFavorites();
    };

    const RemoveFromFav = async () => {
        const updatedFavList = favList.filter(item => item !== pet.id);
        setFavList(updatedFavList);
        await Shared.UpdateFav(user, updatedFavList);
        refreshFavorites();
    };

    return (
        <View>
            {favList?.some(item => item === pet.id) ? (
                <Pressable onPress={RemoveFromFav}>
                    <Ionicons name="heart" size={30} color={Colors.RED} />
                </Pressable>
            ) : (
                <Pressable onPress={AddToFav}>
                    <Ionicons name="heart-outline" size={30} color={Colors.GRAY} />
                </Pressable>
            )}
        </View>
    );
}
