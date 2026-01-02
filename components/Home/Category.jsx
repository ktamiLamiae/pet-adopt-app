import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cats');

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        setCategoryList([]);
        const snapshot = await getDocs(collection(db, 'Category'));
        const categories = [];
        snapshot.forEach(doc => {
            categories.push(doc.data());
        });
        setCategoryList(categories);
    };

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                keyExtractor={(item, index) => item?.name || index.toString()}
                style={{ marginTop: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item?.name);
                            category(item?.name)
                        }
                        }
                        style={{ flex: 1 }}>
                        <View style={[styles.container, selectedCategory === item?.name && styles.selectedCategoryContainer]}>
                            <Image
                                source={{ uri: item?.imageUrl }}
                                style={styles.image}
                            />
                        </View>
                        <Text style={styles.categoryName}>{item?.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.PRIMARY,
        margin: 5,

    },
    image: {
        width: 40,
        height: 40
    },
    categoryName: {
        fontFamily: 'outfit',
        textAlign: 'center',
        marginTop: 5,
    },
    selectedCategoryContainer: {
        backgroundColor: Colors.SECONDARY,
        borderColor: Colors.SECONDARY,
    }
});