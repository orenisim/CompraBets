//FireStore App
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyC_jSUTKeamVerqfTUzk6okNxEMuKwHCfc",
  authDomain: "comprabets.firebaseapp.com",
  projectId: "comprabets",
  storageBucket: "comprabets.appspot.com",
  messagingSenderId: "4808226814",
  appId: "1:4808226814:web:85f7766bf4afad0b7272af",
};
const app = initializeApp(firebaseConfig);

//DB
import {
  getFirestore,
  collection,
  getDocs, //init
  addDoc, //add
  query,
  where,
  getDoc, //QUERIES
  orderBy,
  serverTimestamp,
  updateDoc,
  getCountFromServer,
  doc,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
export const db = getFirestore();

//Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
export const auth = getAuth(app);

//user Collection Ref
const usersColRef = collection(db, "users");

//create user with auth and insert to DB with uniqe user name
export const createUser = async (
  firstName,
  lastName,
  userName,
  email,
  pass
) => {
  //check if exist this user name in DB --> collection users
  const q = query(
    usersColRef,
    where("displayNameLowerCase", "==", userName.toLowerCase())
  );
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
        email,
        firstName,
        lastName,
        league: "",
        score: 0,
      });
      await addBetsCollection(userName);
    }
  }
};

//add bets collection to users collection
const addBetsCollection = async (userName) => {
  const userObject = await getUserObjectFromUserName(userName);
  const userID = userObject.id;
  const userBetsColRef = collection(db, `users/${userID}/Bets`);
  await addDoc(userBetsColRef, {
    winner: "",
    secondPlace: "" 
  });
};
//getting array of users ID
export const getArrayOfIDfromUsers = async () => {
  const docSnap = await getDocs(usersColRef);
  let arrayOfID = [];
  docSnap.forEach((doc) => arrayOfID.push(doc.id));
  return arrayOfID;
};

//log in into Auth with display name
export const getUserObjectFromUserName = async (userName) => {
  const q = query(
    usersColRef,
    where("displayNameLowerCase", "==", userName.toLowerCase())
  );
  const docs = await getDocs(q);
  let user;
  //only one elementuser = ...doc.data(), id: doc.id
  docs.forEach((doc) => (user = { ...doc.data(), id: doc.id }));
  if (!user) throw TypeError("Wrong User Name");
  return user;
};

//log in to current user
export const logInUser = async (userName, pass) => {
  const user = await getUserObjectFromUserName(userName);
  await signInWithEmailAndPassword(auth, user.email, pass);
  return user;
};

//log out from current user
export const logOutUser = async () => {
  await signOut(auth);
};

//Email verification
export const EmailVerification = async (auth) => {
  await sendEmailVerification(auth.currentUser);
};

//Pass reset
export const PassReset = async (auth, email) => {
  await sendPasswordResetEmail(auth, email);
};

//update users collection --> league in DB
export const updateLeagueInUserCollection = async (userName, leagueName) => {
  const userObj = await getUserObjectFromUserName(userName);
  const userID = userObj.id;
  const docRef = await doc(db, "users", userID);
  await updateDoc(docRef, {
    league: leagueName,
  });
};

//matches collection Ref
const matchesColRef = collection(db, "matches");
//get array of matches from DB-->Collection matches
export const getMatchesFromDB = async (auth) => {
  const data = await getDocs(matchesColRef);
  const arrayOfData = data.docs;
  let arrayOfMatches = [];
  arrayOfData.forEach((matchData) => arrayOfMatches.push(matchData.data()));
  return arrayOfMatches;
};

