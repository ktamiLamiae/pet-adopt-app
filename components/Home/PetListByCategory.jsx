import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Category from './Category';
import PetListItem from './PetListItem';


export default function PetListByCategory() {

    const [petList, setPetList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Cats');

    const GetPetList = async (category) => {
        setSelectedCategory(category);
        setLoader(true);
        const q = query(
            collection(db, 'Pets'),
            where('category', '==', category)
        );

        const querySnapshot = await getDocs(q);

        const pets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setPetList(pets);
        setLoader(false);
    };

    useEffect(() => {
        GetPetList('Cats');
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Category category={(value) => GetPetList(value)} />

            <FlatList
                data={petList}
                numColumns={2}
                keyExtractor={(item) => item.id}
                refreshing={loader}
                style={{ marginTop: 15 }}
                onRefresh={() => GetPetList(selectedCategory)}
                removeClippedSubviews
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={5}
                renderItem={({ item }) => (
                    <PetListItem pet={item} />
                )}
            />
        </View>
    );
}
