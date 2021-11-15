/* eslint-disable */
import { initializeApp, FirebaseOptions } from "firebase/app"

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDAQqk9vHkXwEM4msrpDYD4tQcKVtbMX88",
  authDomain: "fieldbook-28f58.firebaseapp.com",
  projectId: "fieldbook-28f58",
  storageBucket: "fieldbook-28f58.appspot.com",
  messagingSenderId: "1074405844091",
  appId: "1:1074405844091:web:95e99be0be4e9a06c36ede",
  measurementId: "G-8Z34VMSL7T",
}

export const firebaseApp = initializeApp(firebaseConfig, "fieldbook")
