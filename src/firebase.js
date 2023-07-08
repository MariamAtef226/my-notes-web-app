// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore" // we've added this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1qktW9yiQ_VgiMgweKObkMUxzE4ipFpQ",
  authDomain: "react-notes-b620a.firebaseapp.com",
  projectId: "react-notes-b620a",
  storageBucket: "react-notes-b620a.appspot.com",
  messagingSenderId: "508765322024",
  appId: "1:508765322024:web:53b2447a37a053cd902e1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // gives reference to the application on fire base 
export const db = getFirestore(app) // we have several services, but we want to access only the firestore (store a reference to it in a variable)
export const notesCollection = collection(db, "notes") // retrieve collection from 'db' database called 'notes'
