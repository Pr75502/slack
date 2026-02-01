import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDPzfSl0rXAeoMuXtmlKjIuz3lzpYijSPs",
    authDomain: "slackclone-15f43.firebaseapp.com",
    projectId: "slackclone-15f43",
    storageBucket: "slackclone-15f43.firebasestorage.app",
    messagingSenderId: "1079951153531",
    appId: "1:1079951153531:web:0df116ac79bf85638b85de",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);







