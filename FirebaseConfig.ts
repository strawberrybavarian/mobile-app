// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg6t3URIJAThVL3fVWa7tShp5da3GKUAA",
  authDomain: "molinopolyclinicapp.firebaseapp.com",
  projectId: "molinopolyclinicapp",
  storageBucket: "molinopolyclinicapp.appspot.com",
  messagingSenderId: "596818114227",
  appId: "1:596818114227:web:29a9c9444cacea19b462c6"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);