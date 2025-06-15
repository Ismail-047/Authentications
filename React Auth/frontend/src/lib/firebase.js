import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB76WofMW-4EHcbUO-8x5NmyuOneMcQuNQ",
    authDomain: "authentication-86400.firebaseapp.com",
    projectId: "authentication-86400",
    storageBucket: "authentication-86400.firebasestorage.app",
    messagingSenderId: "338295248517",
    appId: "1:338295248517:web:ef2728be93ddb27903bbec",
    measurementId: "G-VJTVCPSSN3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();