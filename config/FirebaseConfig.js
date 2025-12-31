// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyD7G3bzG3ycl4Aw_2rCmMckHxf5P9fcLz0",
    authDomain: "pet-adopt-867d8.firebaseapp.com",
    projectId: "pet-adopt-867d8",
    storageBucket: "pet-adopt-867d8.firebasestorage.app",
    messagingSenderId: "655898741230",
    appId: "1:655898741230:web:a2722c83e5916dc02826ff",
    measurementId: "G-4F8CXYL9NZ"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);