'use server';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set, get } from 'firebase/database';

// Your Firebase config here
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app); // Initialize Realtime Database

// Firestore Functions
export const saveUserDataFirestore = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, `users/${user.uid}`);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
    });
  }
};

export const getUserDataFirestore = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }
};

// Realtime Database Functions
export const saveUserDataRealtime = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      name: user.displayName,
      email: user.email,
    });
  }
};

export const getUserDataRealtime = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      console.log("User data:", snapshot.val());
    } else {
      console.log("No data available");
    }
  }
};

export const googleProvider = new GoogleAuthProvider();
export { auth, db, app, database };

