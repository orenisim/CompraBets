//FireStore App
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js'
const firebaseConfig = {
    apiKey: "AIzaSyC_jSUTKeamVerqfTUzk6okNxEMuKwHCfc",
    authDomain: "comprabets.firebaseapp.com",
    projectId: "comprabets",
    storageBucket: "comprabets.appspot.com",
    messagingSenderId: "4808226814",
    appId: "1:4808226814:web:85f7766bf4afad0b7272af"
};
const app = initializeApp(firebaseConfig);

//DB
import {
    getFirestore, collection, getDocs, //init
    addDoc, //add
    deleteDoc, doc, //del
    onSnapshot, // realtime
    query, where, //QUERIES
    orderBy,
    serverTimestamp,
    getDoc, updateDoc,
    getCountFromServer
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js'
const db = getFirestore();

//Auth
import {
    getAuth, createUserWithEmailAndPassword, signOut,
    signInWithEmailAndPassword, onAuthStateChanged,
    updateProfile, sendEmailVerification,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js'
export const auth = getAuth(app);


//collection name
const usersColRef = collection(db, 'users');

//create user with auth and insert to DB with uniqe user name
export const createUser = async (firstName, lastName, userName, email, pass) => {
    //check if exist this user name in DB --> collection users
    const q = query(usersColRef, where("displayNameLowerCase", "==", userName.toLowerCase()));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count) throw TypeError("User name already taken");
    else {
        //check if exist email in DB
        const q = query(usersColRef, where("email", "==", email));
        const snapshot = await getCountFromServer(q);
        if (snapshot.data().count) throw TypeError("Email already in use");
        else {
            //create user with auth
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(cred.user, { displayName: userName });
            //inset to DB --> collection users
            await addDoc(usersColRef, {
                displayName: userName,
                displayNameLowerCase: userName.toLowerCase(),
                email, firstName, lastName,
                league: ''
            })
        }
    }
}


//log in into Auth with display name
export const logInUser = async (userName, pass) => {
    const q = query(usersColRef, where("displayNameLowerCase", "==", userName.toLowerCase()));
    const docs = await getDocs(q);
    let user;
    //only one element
    docs.forEach(doc => user = doc.data());
    if (!user) throw TypeError("Wrong User Name");
    await signInWithEmailAndPassword(auth, user.email, pass)
}

//log out from current user
export const logOutUser = async () => {
    await signOut(auth);
}