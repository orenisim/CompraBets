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
  deleteDoc,
  doc, //del
  onSnapshot, // realtime
  query,
  where, //QUERIES
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
const db = getFirestore();

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
      });
    }
  }
};

//log in into Auth with display name
export const getUserObjectFromUserName = async (userName) => {
  const q = query(
    usersColRef,
    where("displayNameLowerCase", "==", userName.toLowerCase())
  );
  const docs = await getDocs(q);
  let user;
  //only one element
  docs.forEach((doc) => (user = doc.data()));
  if (!user) throw TypeError("Wrong User Name");
  return user;
};
export const logInUser = async (userName, pass) => {
  const user = await getUserObjectFromUserName(userName);
  await signInWithEmailAndPassword(auth, user.email, pass);
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

//adding legues to the leagues Collection
const leaguesColRef = collection(db, "leagues");

export const addLeague = async (league) => {
  const e = await addDoc(leaguesColRef, {
    name: league.name,
    password: league.password,
    numOfPlayers: 1,
  });
  return e;
};

//getting the leagues list from the firebase for the dropown list
export const getLeagues = async () => {
  const data = await getDocs(leaguesColRef);
  const leagueList = data.docs;
  let arrayOfLeagues = [];
  leagueList.forEach((league) => arrayOfLeagues.push(league.data()));
  return arrayOfLeagues;
};

//getting the info of some league for the leagueInfo page
export const getLeagueInfo = async (leagueName) => {
  const q = query(leaguesColRef, where("name", "==", leagueName.toLowerCase()));
  const data = await getDocs(q);
  let leagueData;
  data.forEach((doc) => (leagueData = doc.data()));
  if (!leagueData) throw TypeError("Wrong league Name");
  return leagueData;
};
