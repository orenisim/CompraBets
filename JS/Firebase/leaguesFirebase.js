import { db, updateLeagueInUserCollection } from "./usersFirebase.js";
import {
  getFirestore,
  collection,
  getDocs, //init
  addDoc, //add
  query,
  where, //QUERIES
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  getCountFromServer,
  doc
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

//adding legues to the leagues Collection
const leaguesColRef = collection(db, "leagues");

export const addLeague = async (league) => {
  const e = await addDoc(leaguesColRef, {
    name: league.name.toLowerCase(),
    password: league.password,
    numOfPlayers: 1
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
  data.forEach((doc) => leagueData = { ...doc.data(), id: doc.id });
  if (!leagueData) throw TypeError("Wrong league Name");
  return leagueData;
};

//check if the password right
const checkLeaguePass = async (leagueName, pass) => {
  const leagueObject = await getLeagueInfo(leagueName);
  return (leagueObject.password == pass);
}

//add one to counter of players in DB leagues
const addOneToNumberOfPlayers = async leagueName => {
  const leagueObj = await getLeagueInfo(leagueName);
  const leagueID = leagueObj.id;
  const docRef = await doc(db, 'leagues', leagueID);
  await updateDoc(docRef, {
    numOfPlayers: leagueObj.numOfPlayers + 1
  });
}

export const joinLeague = async (userName, legaueName, pass) => {
  if (await checkLeaguePass(legaueName, pass)) {
    await updateLeagueInUserCollection(userName, legaueName);
    await addOneToNumberOfPlayers(legaueName);
  } else {
    throw TypeError("Wrong league password");
  }
}
