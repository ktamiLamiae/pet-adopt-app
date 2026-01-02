import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";


const GetFavList = async (user) => {
    const docSnap = await getDoc(doc(db, "UserFavPet", user?.email));
    if (docSnap?.exists()) {
        return docSnap.data();
    } else {
        const initialData = {
            email: user?.email,
            favorites: []
        };
        await setDoc(doc(db, "UserFavPet", user?.email), initialData);
        return initialData;
    }
}

const UpdateFav = async (user, favorites) => {
    const docRef = doc(db, "UserFavPet", user?.email)
    try {
        await updateDoc(docRef, { favorites: favorites })
    } catch (error) {
        console.log(error)
    }
}

export default {
    GetFavList,
    UpdateFav
}