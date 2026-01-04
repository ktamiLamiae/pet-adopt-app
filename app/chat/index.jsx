import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/Avatar';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [chatDetails, setChatDetails] = useState(null);

    const chatId = params?.id;
    const currentUserEmail = user?.email;

    useEffect(() => {
        if (!chatId) {
            router.back();
            return;
        }
        GetUserDetails();
        GetMessages();
    }, [chatId]);

    const GetUserDetails = async () => {
        try {
            const docRef = doc(db, 'Chat', chatId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const result = docSnap.data();
                setChatDetails(result);

                const otherUser = result.users?.find(u => u.email !== currentUserEmail);

                navigation.setOptions({
                    headerTitle: otherUser?.name || 'Chat',
                    headerShown: true,
                    headerTransparent: false,
                    headerStyle: { backgroundColor: Colors.PRIMARY },
                    headerTintColor: Colors.WHITE
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement du chat:', error);
        }
    };

    const GetMessages = () => {
        try {
            const messagesRef = collection(db, 'Chat', chatId, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, snapshot => {
                const messagesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        _id: doc.id,
                        text: data.text,
                        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                        user: {
                            _id: data.senderEmail,
                            name: data.senderName,
                            email: data.senderEmail,
                            avatar: data.senderImage || null
                        }
                    };
                });
                setMessages(messagesData);
            });

            return unsubscribe;
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    const onSend = async (newMessages = []) => {
        try {
            const currentUserName = user?.fullName || user?.displayName || user?.name || 'Utilisateur';
            const currentUserImage = user?.photoURL || user?.imageUrl || null;

            const message = newMessages[0];
            const messagesRef = collection(db, 'Chat', chatId, 'messages');

            await addDoc(messagesRef, {
                text: message.text,
                senderEmail: currentUserEmail,
                senderName: currentUserName,
                senderImage: currentUserImage,
                createdAt: new Date().toISOString()
            });

            await setDoc(doc(db, 'Chat', chatId), {
                ...chatDetails,
                lastMessage: message.text,
                lastMessageTime: new Date().toISOString()
            }, { merge: true });

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    const renderAvatar = (props) => <Avatar user={props.currentMessage.user} size={36} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUserEmail,
                    name: user?.displayName,
                    email: currentUserEmail,
                    avatar: user?.photoURL || null
                }}
                renderAvatar={renderAvatar}
                renderAvatarOnTop
                showUserAvatar
                messagesContainerStyle={styles.messagesContainer}

                renderInputToolbar={(props) => (
                    <InputToolbar {...props} containerStyle={styles.inputToolbar} />
                )}
                renderSend={(props) => (
                    <Send {...props} containerStyle={styles.sendButton} />
                )}

                keyboardAvoidingViewProps={{
                    behavior: Platform.OS === 'ios' ? 'padding' : undefined,
                    keyboardVerticalOffset: Platform.OS === 'ios' ? 90 : 0
                }}

                textInputProps={{
                    style: { color: Colors.BLACK },
                    placeholderTextColor: Colors.BLACK,
                    keyboardAppearance: 'light'
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    messagesContainer: {
        backgroundColor: Colors.WHITE,
        paddingBottom: 20
    },
    inputToolbar: {
        borderTopWidth: 1,
        borderBlockColor: Colors.PRIMARY,
        backgroundColor: Colors.LIGHT_PRIMARY,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    textInput: {
        color: Colors.BLACK,
        backgroundColor: Colors.WHITE,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        marginLeft: 6,
        fontSize: 16,
        maxHeight: 120
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0
    }
});
