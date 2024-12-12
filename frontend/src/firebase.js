// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA5368oAsEzqdh3eFlYqwGaGNveLu7qaUM",
    authDomain: "new-project-98a18.firebaseapp.com",
    projectId: "new-project-98a18",
    storageBucket: "new-project-98a18.appspot.com",
    messagingSenderId: "632670698420",
    appId: "1:632670698420:web:d3c0e6eea53512abcd90e1",
    // measurementId: "G-LZXWSS60YV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// setPersistence(auth, browserLocalPersistence).catch((error) => {
//     console.error('Error setting persistence:', error);
//   });
  
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
