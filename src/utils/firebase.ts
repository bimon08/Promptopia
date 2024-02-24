import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCdJZItUz2_wPemqoURvHKqARsFC8kWUo0",
  authDomain: "pic-fetch-a3d19.firebaseapp.com",
  projectId: "pic-fetch-a3d19",
  storageBucket: "pic-fetch-a3d19.appspot.com",
  messagingSenderId: "291007434607",
  appId: "1:291007434607:web:74630449b39de15a41629a",
  // measurementId: "G-GLY9R96VL0",
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

// FIREBASE_API_KEY = "AIzaSyCrEVhrZha3LYw4v0HTDxrW8ZwI0lRXE34";
// FIREBASE_API_KEY = "build-and-grow-639eb.firebaseapp.com";
// FIREBASE_PROJECT_ID = "build-and-grow-639eb";
// FIREBASE_STORAGE_BUCKET = "build-and-grow-639eb.appspot.com";
// FIREBASE_MESSAGING_SENDER_ID = "350043470606";
// FIREBASE_APP_ID = "1:350043470606:web:e5cc7ff2e1f66c9ccb755f";
// FIREBASE_MEASUREMENT_ID = "G-GLY9R96VL0";

//  apiKey: process.env.FIREBASE_API_KEY,
  
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,