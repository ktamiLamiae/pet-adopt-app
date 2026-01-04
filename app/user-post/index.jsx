import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function UserPost() {
    const navigation = useNavigation();
    const router = useRouter();
    const { user } = useAuth();
    const [userPostList, setUserPostList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'User Post',
            headerShown: true,
            headerTransparent: false,
            headerStyle: { backgroundColor: Colors.PRIMARY },
            headerTintColor: Colors.WHITE
        });
        user && GetUserPost();
        // console.log(user)
    }, [user]);

    const GetUserPost = async () => {
        setLoader(true);
        setUserPostList([]);
        const q = query(collection(db, 'Pets'), where('user.email', '==', user?.email));
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
        });
        setUserPostList(posts);
        setLoader(false);
    }

    const OnDeletePost = (docId) => {
        Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deletePost(docId)
            }
        ]);
    }

    const deletePost = async (docId) => {
        await deleteDoc(doc(db, 'Pets', docId));
        GetUserPost();
        // Alert.alert('Post Deleted', 'Post deleted successfully');
    }

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>UserPost</Text> */}

            {userPostList?.length === 0 && !loader && (
                <Text style={styles.noPostText}>No Post Found</Text>
            )}

            <FlatList
                data={userPostList}
                numColumns={2}
                onRefresh={GetUserPost}
                refreshing={loader}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/pet-details',
                            params: {
                                ...item,
                                user: JSON.stringify(item.user)
                            }
                        })}
                        style={styles.itemContainer}
                    >
                        <Image
                            source={{ uri: item?.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <Text style={styles.nameText}>{item?.name}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.breedText}>{item?.breed}</Text>
                            <Text style={styles.ageText}>{item?.age} YRS</Text>
                        </View>
                        <Pressable
                            onPress={() => OnDeletePost(item.id)}
                            style={styles.deleteButton}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        marginBottom: 20
    },
    itemContainer: {
        backgroundColor: Colors.WHITE,
        padding: 10,
        margin: 5,
        borderRadius: 10,
        flex: 1,
        maxWidth: '48%'
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 10
    },
    nameText: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        marginTop: 5
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2
    },
    breedText: {
        fontFamily: 'outfit',
        color: Colors.GRAY,
        fontSize: 12
    },
    ageText: {
        fontFamily: 'outfit',
        color: Colors.PRIMARY,
        paddingHorizontal: 7,
        fontSize: 10,
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 7,
        borderRadius: 7,
        marginTop: 10,
    },
    deleteText: {
        fontFamily: 'outfit-medium',
        textAlign: 'center',
        fontSize: 14,
        color: Colors.BLACK
    },
    noPostText: {
        fontFamily: 'outfit',
        fontSize: 16,
        marginTop: 5,
        color: Colors.GRAY,
        textAlign: 'left'
    }
});