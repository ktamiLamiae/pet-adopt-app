import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

/**
 * Fetch detailed information for a single pet by ID
 * @param {string} petId - The document ID of the pet
 * @returns {Promise<Object>} Result object with success status and pet data or error
 */
export const getPetDetail = async (petId) => {
    try {
        if (!petId) throw new Error("Pet ID is required");

        const petRef = doc(db, 'Pets', String(petId));
        const petSnap = await getDoc(petRef);

        if (petSnap.exists()) {
            return {
                success: true,
                pet: { ...petSnap.data(), id: petSnap.id }
            };
        } else {
            return { success: false, error: "Pet not found" };
        }
    } catch (error) {
        console.error("Error fetching pet detail:", error);
        return { success: false, error: error.message };
    }
};
