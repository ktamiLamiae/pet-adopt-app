import { deleteUser, getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

/**
 * Permanently deletes the user account and all associated data (Pets, Favorites, Chats).
 * @returns {Promise<Object>} Result object with success status and message/error.
 */
export const deleteUserAccount = async () => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            return {
                success: false,
                error: 'No user logged in'
            };
        }

        // 1. Delete User's Pets
        const petsQuery = query(collection(db, 'Pets'), where('user.email', '==', currentUser.email));
        const petsSnapshot = await getDocs(petsQuery);
        const deletePetsPromises = petsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePetsPromises);

        // 2. Delete User's Favorites
        await deleteDoc(doc(db, 'UserFavPet', currentUser.email));

        // 3. Delete User's Chats
        const chatsQuery = query(collection(db, 'Chat'), where('userIds', 'array-contains', currentUser.email));
        const chatsSnapshot = await getDocs(chatsQuery);
        const deleteChatsPromises = chatsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteChatsPromises);

        // 4. Delete Auth User
        await deleteUser(currentUser);

        return {
            success: true,
            message: 'Account deleted successfully'
        };

    } catch (error) {
        console.error("Error deleting user account:", error);

        if (error.code === 'auth/requires-recent-login') {
            return {
                success: false,
                error: 'auth/requires-recent-login'
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to delete account'
        };
    }
};
