import * as WebBrowser from 'expo-web-browser';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/FirebaseConfig';

WebBrowser.maybeCompleteAuthSession();

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @returns {Promise<Object>} User object
 */
export const signUpWithEmail = async (email, password, fullName) => {
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
            displayName: fullName
        });

        // Initialize Firestore user profile
        await setDoc(doc(db, 'Users', user.email.toLowerCase()), {
            displayName: fullName,
            email: user.email.toLowerCase(),
            uid: user.uid,
            createdAt: new Date()
        });

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: fullName,
                photoURL: user.photoURL
            }
        };
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }
        };
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};



/**
 * Sign out current user
 * @returns {Promise<Object>} Success status
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to sign out'
        };
    }
};

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Update user profile
 * @param {string} fullName - New full name
 * @param {string} photoURL - New photo URL
 * @returns {Promise<Object>} Success status
 */
export const updateUserProfile = async (fullName, photoURL) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        // Update basic profile (name only to avoid length errors)
        await updateProfile(user, {
            displayName: fullName
        });

        // Save detailed profile to Firestore
        await setDoc(doc(db, 'Users', user.email.toLowerCase()), {
            displayName: fullName,
            photoURL: photoURL,
            email: user.email.toLowerCase(),
            uid: user.uid,
            updatedAt: new Date()
        }, { merge: true });

        return {
            success: true,
            user: {
                ...user,
                displayName: fullName,
                photoURL: photoURL
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Fetch extra profile info from Firestore
            const userDoc = await getDoc(doc(db, 'Users', user.email.toLowerCase()));
            const userData = userDoc.exists() ? userDoc.data() : null;

            callback({
                uid: user.uid,
                email: user.email,
                displayName: userData?.displayName || user.displayName,
                photoURL: userData?.photoURL || user.photoURL,
                role: userData?.role || 'user',
                profileExists: !!userData
            });
        } else {
            callback(null);
        }
    });
};

/**
 * Convert Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Invalid email address. Please check and try again.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return 'An error occurred. Please try again.';
    }
};
