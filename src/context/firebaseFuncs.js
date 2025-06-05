// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARp0BLDeCTnrWYIrNtdbNqeQ_MRzQShTw",
    authDomain: "mtc-riverside-database.firebaseapp.com",
    projectId: "mtc-riverside-database",
    storageBucket: "mtc-riverside-database.firebasestorage.app",
    messagingSenderId: "249791371280",
    appId: "1:249791371280:web:49be35affb4769c36f9295"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveToFirebase = async (key, data) => {
    try {
        const docRef = await addDoc(collection(db, "registrations"), {key: data});
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}