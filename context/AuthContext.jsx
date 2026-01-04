import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '../services/authService';
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
        const unsubscribe = onAuthStateChange((currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchFavorites(currentUser);
            } else {
                setFavList([]);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const fetchFavorites = async (currentUser) => {
        const result = await Shared.GetFavList(currentUser);
        setFavList(result?.favorites ? result.favorites : []);
    }

    const value = {
        user,
        favList,
        setFavList,
        loading,
        isAuthenticated: !!user,
        refreshFavorites: () => user && fetchFavorites(user)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
