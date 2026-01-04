import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function Inbox() {
    const { user } = useAuth();
    const router = useRouter();
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            GetConfigs();
        }
    }, [user]);

    const GetConfigs = () => {
        setLoading(true);
        const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', user?.email));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach(doc => {
                list.push({
                    docId: doc.id,
                    ...doc.data()
                });
            });

            // Filter out chats with no messages
            const filteredList = list.filter(item => item.lastMessage && item.lastMessage !== '');

            const sortedList = filteredList.sort((a, b) => {
                const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
                const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
                return timeB - timeA;
            });

            setChatList(sortedList);
            setLoading(false);
        });

        return () => unsubscribe();
    };

    const MapOtherUser = (users) => {
        const otherUser = users?.filter(u => u.email !== user?.email);
        return otherUser ? otherUser[0] : null;
    };

    const renderItem = ({ item }) => {
        const otherUser = MapOtherUser(item.users);
        if (!otherUser) return null;

        return (
            <Pressable
                style={styles.chatItem}
                onPress={() => router.push({
                    pathname: '/chat',
                    params: { id: item.docId }
                })}
            >
                <Image
                    source={{ uri: otherUser.imageUrl || otherUser.photoURL || 'https://via.placeholder.com/150' }}
                    style={styles.avatar}
                />
                <View style={styles.chatContent}>
                    <View style={styles.topRow}>
                        <Text style={styles.userName}>{otherUser.name || 'Unknown User'}</Text>
                        <Text style={styles.time}>
                            {item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleDateString([], { day: '2-digit', month: '2-digit' }) + ' ' + new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                    </View>
                    <Text
                        style={styles.lastMessage}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {item.lastMessage}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Inbox</Text>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={'large'} color={Colors.PRIMARY} />
                </View>
            ) : (
                <FlatList
                    data={chatList}
                    refreshing={loading}
                    onRefresh={GetConfigs}
                    keyExtractor={item => item.docId}
                    renderItem={renderItem}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No conversations yet</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
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
    headerTitle: {
        fontFamily: 'outfit-medium',
        fontSize: 30,
        marginBottom: 20
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        backgroundColor: Colors.LIGHT_PRIMARY
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    userName: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.BLACK
    },
    lastMessage: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center'
    },
    emptyText: {
        fontFamily: 'outfit',
        fontSize: 18,
        color: Colors.GRAY
    }
});