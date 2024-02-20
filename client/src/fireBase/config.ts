import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBO2-J_KoeZMsB6jGtwMkigmA7ERTYIr48",
  authDomain: "otp-sms-store.firebaseapp.com",
  projectId: "otp-sms-store",
  storageBucket: "otp-sms-store.appspot.com",
  messagingSenderId: "512902079287",
  appId: "1:512902079287:web:c363930a5824c0b13970b2",
  measurementId: "G-0VHB12W4Y1",
};

const firebase = initializeApp(firebaseConfig);
const authFireBase = getAuth(firebase);

export { authFireBase, firebase };
