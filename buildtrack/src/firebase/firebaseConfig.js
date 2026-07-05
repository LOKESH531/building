import { initializeApp } from "firebase/app";


import { 
getAuth 
} from "firebase/auth";


import {
getFirestore
}
from "firebase/firestore";


import {
getStorage
}
from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAag3a-LBRPXZjEbOtzd3sktCyP1b7pq90",
  authDomain: "buildtrack-1797.firebaseapp.com",
  projectId: "buildtrack-1797",
 // storageBucket: "buildtrack-1797.firebasestorage.app",
 storageBucket: "buildtrack-1797.appspot.com",
  messagingSenderId: "704557220354",
  appId: "1:704557220354:web:152223d9778568c800dd1b",
  measurementId: "G-80SRR5NJB8"
};




const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);


export const storage = getStorage(app);