import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import PetListItem from '../../components/Home/PetListItem';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function Favourite() {
    const { user, favList } = useAuth();
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (user && favList && favList.length > 0) {
            GetFavPetList();
        } else {
            setFavPetList([]);
        }
    }, [user, favList]);

    const GetFavPetList = async () => {
        setLoader(true);
        if (!favList || favList.length === 0) {
            setFavPetList([]);
            setLoader(false);
            return;
        }
        try {
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
            setFavPetList([]);
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favourites</Text>

            {loader ? (
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            ) : (
                <>
                    {favPetList?.length === 0 && !loader && (
                        <Text style={styles.noPostText}>No favorites found</Text>
                    )}
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
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 40,
        flex: 1
    },
    title: {
        fontFamily: 'outfit-medium',
        fontSize: 30,
        marginBottom: 20
    },
    noPostText: {
        fontFamily: 'outfit',
        fontSize: 16,
        marginTop: 5,
        color: '#888',
        textAlign: 'center'
    }
});