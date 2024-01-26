// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b6f91.firebaseapp.com",
  projectId: "mern-blog-b6f91",
  storageBucket: "mern-blog-b6f91.appspot.com",
  messagingSenderId: "201713814403",
  appId: "1:201713814403:web:2903e45e17fe9951e484b6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);