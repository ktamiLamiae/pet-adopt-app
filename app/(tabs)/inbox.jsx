import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../../components/Avatar';
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

    const onDeleteChat = (docId) => {
        Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete this conversation?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const messagesRef = collection(db, 'Chat', docId, 'messages');
                            const messagesSnapshot = await getDocs(messagesRef);
                            const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
                            await Promise.all(deletePromises);

                            await deleteDoc(doc(db, 'Chat', docId));
                        } catch (error) {
                            console.error('Error deleting chat:', error);
                            Alert.alert('Error', 'Failed to delete chat');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const otherUser = MapOtherUser(item.users);
        if (!otherUser) return null;

        const isUnread = item.unreadBy && item.unreadBy.includes(user?.email);

        return (
            <Pressable
                style={[styles.chatItem, isUnread && styles.chatItemUnread]}
                onPress={() => router.push({
                    pathname: '/chat',
                    params: { id: item.docId }
                })}
            >
                <Avatar
                    user={otherUser}
                    size={60}
                    style={styles.avatar}
                />
                <View style={styles.chatContent}>
                    <View style={styles.topRow}>
                        <Text style={[styles.userName, isUnread && styles.userNameUnread]}>{otherUser.name || 'Unknown User'}</Text>
                        <Text style={styles.time}>
                            {item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleDateString([], { day: '2-digit', month: '2-digit' }) + ' ' + new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                    </View>
                    <View style={styles.bottomRow}>
                        <Text
                            style={[styles.lastMessage, isUnread && styles.lastMessageUnread]}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {item.lastMessage}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onDeleteChat(item.docId)}
                            style={styles.deleteButton}
                        >
                            <Ionicons name="trash-outline" size={20} color={Colors.GRAY} />
                        </TouchableOpacity>
                    </View>
                </View>
                {isUnread && (
                    <View style={styles.unreadIndicator} />
                )}
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
        color: Colors.GRAY,
        flex: 1
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center'
    },
    emptyText: {
        fontFamily: 'outfit',
        fontSize: 18,
        color: Colors.GRAY
    },
    chatItemUnread: {
        backgroundColor: '#F0F9FF' // Light blue background for unread
    },
    userNameUnread: {
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY
    },
    lastMessageUnread: {
        fontFamily: 'outfit-medium',
        color: Colors.BLACK
    },
    unreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.SECONDARY,
        marginLeft: 10
    },
    time: {
        fontFamily: 'outfit',
        fontSize: 12,
        color: Colors.GRAY
    }
});