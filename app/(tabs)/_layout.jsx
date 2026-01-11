import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
    const router = useRouter();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user?.email) return;

        const q = query(
            collection(db, 'Chat'),
            where('userIds', 'array-contains', user.email)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let count = 0;
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.unreadBy && data.unreadBy.includes(user.email)) {
                    count++;
                }
            });
            setUnreadCount(count);
        });

        return () => unsubscribe();
    }, [user?.email]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.PRIMARY
            }}
        >
            <Tabs.Screen name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
                }}
            />

            <Tabs.Screen name="favourite"
                options={{
                    title: 'Favourite',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />
                }}
            />

            <Tabs.Screen name="create"
                options={{
                    title: 'Add New',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="pets" size={24} color={color} />
                }}
            />

            <Tabs.Screen name="inbox"
                options={{
                    title: 'Inbox',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="chatbubble" size={24} color={color} />,
                    tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
                    tabBarBadgeStyle: { backgroundColor: Colors.SECONDARY }
                }}
            />

            <Tabs.Screen name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="people-circle" size={24} color={color} />
                }}
            />

        </Tabs>


    )
}

const styles = StyleSheet.create({})