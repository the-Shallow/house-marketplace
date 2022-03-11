// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHlVovvN7ywXR2F7DeMNEA9xDkkKm_4KY",
  authDomain: "house-marketplace-84161.firebaseapp.com",
  projectId: "house-marketplace-84161",
  storageBucket: "house-marketplace-84161.appspot.com",
  messagingSenderId: "1020164243178",
  appId: "1:1020164243178:web:06e281b014f76205c2e193"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();