// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANlABnU_shF9R1rT_Ldd5S0sf692nBwRg",
  authDomain: "crud-app-c0484.firebaseapp.com",
  projectId: "crud-app-c0484",
  storageBucket: "crud-app-c0484.appspot.com",
  messagingSenderId: "734115999223",
  appId: "1:734115999223:web:836c4197eeb20e606b52f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized instances for use in other modules
export { auth, db };