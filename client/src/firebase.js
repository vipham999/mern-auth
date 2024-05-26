// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-auth-42dab.firebaseapp.com',
  projectId: 'mern-auth-42dab',
  storageBucket: 'mern-auth-42dab.appspot.com',
  messagingSenderId: '799566083429',
  appId: '1:799566083429:web:baea89c2daf64fc047dd8c'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
