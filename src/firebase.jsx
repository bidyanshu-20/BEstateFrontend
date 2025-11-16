// firebase.js or firebase.jsx
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // <-- no quotes
  authDomain: "videstate-ab5e3.firebaseapp.com",
  projectId: "videstate-ab5e3",
  storageBucket: "videstate-ab5e3.appspot.com",   // <-- notice: should be `.appspot.com`
  messagingSenderId: "731600954337",
  appId: "1:731600954337:web:c8e68e8491d0bc23e868a0",
};



// ✅ Prevent duplicate initialization (important for Vite HMR)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

 