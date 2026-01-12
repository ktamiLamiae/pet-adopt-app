import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cats');

    useEffect(() => {
        const q = query(collection(db, 'Category'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const categories = [];
            snapshot.forEach(doc => {
                categories.push({ ...doc.data(), id: doc.id });
            });
            setCategoryList(categories);
        }, (error) => {
            console.error("Error listening to categories:", error);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginBottom: 10 }}>Category</Text>

            <FlatList
                data={categoryList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item?.name || index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item?.name);
                            category(item?.name)
                        }}
                        style={styles.itemWrapper}>
                        <View style={[styles.container, selectedCategory === item?.name && styles.selectedCategoryContainer]}>
                            <Image
                                source={{ uri: item?.imageUrl }}
                                style={styles.image}
                            />
                        </View>
                        <Text style={styles.categoryName}>{item?.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingRight: 20 }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    itemWrapper: {
        alignItems: 'center',
        marginRight: 15,
    },
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.PRIMARY,
        width: 70,
        height: 70,
        justifyContent: 'center',
    },
    image: {
        width: 35,
        height: 35
    },
    categoryName: {
        fontFamily: 'outfit',
        textAlign: 'center',
        marginTop: 5,
        fontSize: 12,
    },
    selectedCategoryContainer: {
        backgroundColor: Colors.SECONDARY,
        borderColor: Colors.SECONDARY,
    }
});
