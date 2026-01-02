import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PetListItem from '../../components/Home/PetListItem';
import { db } from '../../config/FirebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function Favourite() {
    const { user, favList } = useAuth();
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (user && favList) {
            GetFavPetList();
        }
    }, [user, favList]);

    /**
     * Fetch the actual pet details for the IDs stored in favorites
     */
    const GetFavPetList = async () => {
        if (!favList || favList.length === 0) {
            setFavPetList([]);
            return;
        }

        setLoader(true);
        try {
            // Firestore 'in' query supports up to 30 items
            const q = query(
                collection(db, 'Pets'),
                where('id', 'in', favList.map(id => Number(id)))
            );

            const querySnapshot = await getDocs(q);
            const pets = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setFavPetList(pets);
        } catch (error) {
            console.error("Error fetching favorite pets:", error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={{
            padding: 20,
            marginTop: 20,
            flex: 1
        }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 30
            }}>Favourites</Text>

            <FlatList
                data={favPetList}
                numColumns={2}
                onRefresh={GetFavPetList}
                refreshing={loader}
                renderItem={({ item, index }) => (
                    <PetListItem pet={item} key={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({});