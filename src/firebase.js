// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBelVVjqyxBrU8jJJobQpXHYBHmpmUb3cc",
  authDomain: "todo-app-sean.firebaseapp.com",
  projectId: "todo-app-sean",
  storageBucket: "todo-app-sean.firebasestorage.app",
  messagingSenderId: "672186006060",
  appId: "1:672186006060:web:05f60a623b406eda2aef89",
  measurementId: "G-CXL419JE5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };