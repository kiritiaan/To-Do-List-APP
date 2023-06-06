import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8tJdO9TA44YRW8dKcWvZwBmjfdNzrisw",
  authDomain: "prototype-dc45b.firebaseapp.com",
  projectId: "prototype-dc45b",
  storageBucket: "prototype-dc45b.appspot.com",
  messagingSenderId: "1001378614261",
  appId: "1:1001378614261:web:86d6ed0e0c77c212086ebc",
  measurementId: "G-889LQLBPY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const Auth = getAuth(app);
export const db = getFirestore(app);
export const signIn = signInWithEmailAndPassword;