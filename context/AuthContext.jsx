import { doc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../config/FirebaseConfig';
import { onAuthStateChange, signOutUser } from '../services/authService';
import Shared from '../shared/Shared';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [favList, setFavList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let authUnsubscribe;
        let profileUnsubscribe;

        authUnsubscribe = onAuthStateChange((currentUser) => {
            // Clear previous profile listener if any
            if (profileUnsubscribe) profileUnsubscribe();

            if (currentUser) {
                setUser(currentUser);
                fetchFavorites(currentUser);

                // Set up real-time listener for the user's profile document
                // This ensures that if an admin deletes the user from Firestore, 
                // they are kicked out of the app immediately.
                profileUnsubscribe = onSnapshot(doc(db, 'Users', currentUser.email.toLowerCase()), (snapshot) => {
                    if (!snapshot.exists()) {
                        console.log("User profile deleted. Kicking out...");
                        signOutUser();
                        setUser(null);
                    } else {
                        // Update user role/data if it changes in real-time
                        const updatedData = snapshot.data();
                        setUser(prev => ({
                            ...prev,
                            displayName: updatedData.displayName || prev.displayName,
                            photoURL: updatedData.photoURL || prev.photoURL,
                            role: updatedData.role || 'user'
                        }));
                    }
                });
            } else {
                setUser(null);
                setFavList([]);
            }
            setLoading(false);
        });

        // Cleanup subscriptions on unmount
        return () => {
            if (authUnsubscribe) authUnsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
        };
    }, []);

    const fetchFavorites = async (currentUser) => {
        const result = await Shared.GetFavList(currentUser);
        setFavList(result?.favorites ? result.favorites : []);
    }

    const value = useMemo(() => ({
        user,
        setUser,
        favList,
        setFavList,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        refreshFavorites: () => user && fetchFavorites(user)
    }), [user, favList, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
