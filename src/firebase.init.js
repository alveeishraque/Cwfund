// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk7JAapXywRStJy-AzJij18GO7bWCAMbE",
  authDomain: "auth-35c49.firebaseapp.com",
  projectId: "auth-35c49",
  storageBucket: "auth-35c49.firebasestorage.app",
  messagingSenderId: "924807881648",
  appId: "1:924807881648:web:1c1113b511969bc13dac75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);