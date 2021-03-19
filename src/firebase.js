import firebase from "firebase";

const firebaseApp=firebase.initializeApp( {
    apiKey: "AIzaSyD43yH3UMINxOjltfBtcC7WZBBCJ9OQdX4",
    authDomain: "instagram-clone-837d2.firebaseapp.com",
    databaseURL: "https://instagram-clone-837d2-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-837d2",
    storageBucket: "instagram-clone-837d2.appspot.com",
    messagingSenderId: "666954746933",
    appId: "1:666954746933:web:4f34ab825e538ac09e757c",
    measurementId: "G-YLPYVDW4PW"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };