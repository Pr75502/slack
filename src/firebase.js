import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNmivRzHCFSzkBU9A_5H9Xq0X4y0_OTEs",
  authDomain: "slackclone-v2.firebaseapp.com",
  projectId: "slackclone-v2",
  storageBucket: "slackclone-v2.firebasestorage.app",
  messagingSenderId: "810276678422",
  appId: "1:810276678422:web:17e3d9340d5fbd3fbf7e37",
  measurementId: "G-BG57SSM8VF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);