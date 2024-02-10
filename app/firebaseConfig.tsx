// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDownloadURL, getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const firebaseStorage = getStorage(app);

export var firebaseImageBaseURL: string|null = null;

export async function setFirebaseImageBaseURL() {
  if (firebaseImageBaseURL) return firebaseImageBaseURL;
  const storage = firebaseStorage;
  const imageRef = ref(storage, `showImages/resizedImages/broken_640x640.jpeg`);
  const url = await getDownloadURL(imageRef);
  const splitURL = url.split("resizedImages");
  const baseURL = splitURL[0];
  const fullBaseURL = baseURL + "resizedImages%2F";
  firebaseImageBaseURL = fullBaseURL;
}

setFirebaseImageBaseURL();