import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

/**
 * Fetch dashboard statistics
 */
export const getAdminStats = async () => {
    try {
        const petsSnapshot = await getDocs(collection(db, 'Pets'));
        const usersSnapshot = await getDocs(collection(db, 'Users'));

        return {
            success: true,
            stats: {
                totalPets: petsSnapshot.size,
                totalUsers: usersSnapshot.size,
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Real-time listener for pets
 * @param {Function} callback - Callback function to handle updates
 */
export const onPetsUpdate = (callback) => {
    const q = query(collection(db, 'Pets'), orderBy('category', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const pets = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        callback(pets);
    });
};

/**
 * Fetch all pets for management
 */
export const getAllPets = async () => {
    try {
        const q = query(collection(db, 'Pets'), orderBy('category', 'asc'));
        const snapshot = await getDocs(q);
        const pets = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        return { success: true, pets };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all users for management
 */
export const onUsersUpdate = (callback) => {
    const q = query(collection(db, 'Users'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        callback(users);
    });
};

/**
 * Fetch all users for management
 */
export const getAllUsers = async () => {
    try {
        const q = query(collection(db, 'Users'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        return { success: true, users };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Delete a pet by admin
 */
export const adminDeletePet = async (petId) => {
    try {
        console.log("Attempting to delete pet with ID:", petId);
        if (!petId) throw new Error("Pet ID is required");

        const petRef = doc(db, 'Pets', String(petId));
        await deleteDoc(petRef);
        console.log("Pet deleted successfully");
        return { success: true };
    } catch (error) {
        console.error("Error deleting pet:", error);
        return { success: false, error: error.message };
    }
};



/**
 * Delete a category by admin
 */
export const adminDeleteCategory = async (categoryName) => {
    try {
        console.log("Attempting to delete category:", categoryName);
        if (!categoryName) throw new Error("Category name is required");

        await deleteDoc(doc(db, 'Category', String(categoryName)));
        console.log("Category deleted successfully");
        return { success: true };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, error: error.message };
    }
};

export const onCategoriesUpdate = (callback) => {
    const q = query(collection(db, 'Category'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        callback(categories);
    });
};

/**
 * Fetch all categories
 */
export const getCategories = async () => {
    try {
        const q = query(collection(db, 'Category'), orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);
        const categories = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        return { success: true, categories };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Add a new category
 * @param {string} name - Category name
 * @param {string} base64Image - Image in Base64 format
 */
export const addCategory = async (name, base64Image) => {
    try {
        // We store the base64 string directly as requested
        // Note: For large images, this might hit Firestore limit (1MB), 
        // but for small icons it's usually fine.
        const categoryData = {
            name: name,
            imageUrl: base64Image,
            createdAt: new Date()
        };

        // Add doc with auto-ID or using name as ID?
        // Let's use name as ID or auto-id. Home screen uses item.name as key.
        await setDoc(doc(db, 'Category', name), categoryData);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
