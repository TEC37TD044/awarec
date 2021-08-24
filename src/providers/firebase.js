import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/storage";

const FirebaseCredentials = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

if (!Firebase.apps.length) {
  Firebase.initializeApp(FirebaseCredentials);
}

const app = Firebase.app();
const auth = Firebase.auth();
const db = Firebase.firestore();
const storage = Firebase.storage();

export { auth, db, app, storage };
export default Firebase;
