import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'BloomFilter error',
    'statusBarTranslucent'
]);

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyD7G3bzG3ycl4Aw_2rCmMckHxf5P9fcLz0",
    authDomain: "pet-adopt-867d8.firebaseapp.com",
    projectId: "pet-adopt-867d8",
    storageBucket: "pet-adopt-867d8.appspot.com",
    messagingSenderId: "655898741230",
    appId: "1:655898741230:web:a2722c83e5916dc02826ff",
    measurementId: "G-4F8CXYL9NZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

