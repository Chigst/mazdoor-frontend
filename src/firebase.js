// src/firebaseConfig.js

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuYmAw-dztTVMr37bCuLDGesToZC-ZyOs",
  authDomain: "mazdoor-acc88.firebaseapp.com",
  projectId: "mazdoor-acc88",
  storageBucket: "mazdoor-acc88.appspot.com", // ✅ Fixed here
  messagingSenderId: "333489311293",
  appId: "1:333489311293:web:de561765e79929852ba454",
  measurementId: "G-Q1PYR2NXHT"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
