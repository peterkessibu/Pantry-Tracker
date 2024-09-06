import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

export const googleProvider = new GoogleAuthProvider();
export { auth, db, app };
