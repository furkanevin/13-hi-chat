// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//! auth import
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//! database import
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcwT6lPznyx45Zf9HUSgKpxu-lqF29Lig",
  authDomain: "hi-chat-b0d43.firebaseapp.com",
  projectId: "hi-chat-b0d43",
  storageBucket: "hi-chat-b0d43.firebasestorage.app",
  messagingSenderId: "286785324689",
  appId: "1:286785324689:web:dd054d82c6650684b0e130",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//! auth servisinin referansını al
export const auth = getAuth(app);

//! google sağlaycısının kurulumu
export const provider = new GoogleAuthProvider();

//! veritabanı servisinin referansını al
export const db = getFirestore(app);
