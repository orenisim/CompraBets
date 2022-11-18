import { db, getUserObjectFromUserName } from "./usersFirebase.js";

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
  doc,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

//Add bet to collection user->Bets
export const addBetPerMatch = async (userName, betDetailsObject) => {
  const user = await getUserObjectFromUserName(userName);
  const userBetsColRef = await collection(db, `users/${user.id}/Bets`);
  const q = query(
    userBetsColRef,
    where("api_ID", "==", betDetailsObject.api_ID)
  );
  //return number of doc depand on query
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count) {
    const docs = await getDocs(q);
    let bet;
    //only one element bet
    docs.forEach((doc) => (bet = { ...doc.data(), id: doc.id }));
    const docRef = await doc(db, `users/${user.id}/Bets`, bet.id);
    await updateDoc(docRef, {
      finalScore: betDetailsObject.finalScore,
      winner: betDetailsObject.winner,
    });
  } else await addDoc(userBetsColRef, { ...betDetailsObject });
};

//Add bet to collection user->Bets
export const addOpeningBet= async (userName, winnerName) => {
  const user = await getUserObjectFromUserName(userName);
  const userBetsColRef = await collection(db, `users/${user.id}/Bets`);
  const q = query(
    userBetsColRef,
    where("api_ID", "==", 'OpeningBet')
  );
  //return number of doc depand on query
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count) {
    const docs = await getDocs(q);
    let bet;
    //only one element bet
    docs.forEach((doc) => (bet = { ...doc.data(), id: doc.id }));
    const docRef = await doc(db, `users/${user.id}/Bets`, bet.id);
    await updateDoc(docRef, { winner: winnerName });
  }
};

//getting array of Bets IDS:
export const getArrayOfBets = async (userID) => {
  const betsColRef = collection(db, `users/${userID}/Bets`);
  const docSnap = await getDocs(betsColRef);
  let arrayOfBets = [];
  docSnap.forEach((doc) => arrayOfBets.push({ ...doc.data(), id: doc.id }));
  return arrayOfBets;
};

//return array of all teams include in the competition
export const getArrayOfTeams = async () => {
  const set = new Set();
  const matchesColRef = collection(db, `matches`);
  const docSnap = await getDocs(matchesColRef);
  docSnap.forEach(doc => set.add(doc.data().homeTeam));
  return Array.from(set);
}