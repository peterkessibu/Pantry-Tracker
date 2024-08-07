
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

  // your firebase config here
  const firebaseConfig = {
    apiKey: "AIzaSyAcpxMMR7qTwvgkpjKTOVRxQiFGA43gg1k",
    authDomain: "stockup-f1411.firebaseapp.com",
    projectId: "stockup-f1411",
    storageBucket: "stockup-f1411.appspot.com",
    messagingSenderId: "447366001531",
    appId: "1:447366001531:web:55583c77224e4af0a5c3de",
    measurementId: "G-H8EL5XDDGW"
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  export { auth, db };