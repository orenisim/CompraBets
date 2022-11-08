import { db, getArrayOfIDfromUsers, getCurrentScore } from "./usersFirebase.js";
import { getArrayOfBets } from "./betsFirebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc, //init
  addDoc, //add
  query,
  where, //QUERIES
  orderBy,
  serverTimestamp,
  updateDoc,
  getCountFromServer,
  doc,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

const usersColRef = collection(db, "users");
const matchesColRef = collection(db, "matches");

//getting the game score by ID:
const getGameScoreByID = async (apiID) => {
  const q = query(matchesColRef, where("api_ID", "==", apiID));
  const data = await getDocs(q);
  let matchObject;
  data.forEach((doc) => (matchObject = { ...doc.data(), id: doc.id }));
  return matchObject.finalScore;
};

//getting the reall winning team by ID
const getGameWinnerByID = async (apiID) => {
  const q = query(matchesColRef, where("api_ID", "==", apiID));
  const data = await getDocs(q);
  let matchObject;
  data.forEach((doc) => (matchObject = { ...doc.data(), id: doc.id }));
  return matchObject.winner;
};

//getting the user game bet by id:
const getBetScoreByID = async (apiID, userID) => {
  const betsColRef = collection(db, `users/${userID}/Bets`);
  const q = query(betsColRef, where("api_ID", "==", apiID));
  const data = await getDocs(q);
  let matchObject;
  data.forEach((doc) => (matchObject = { ...doc.data(), id: doc.id }));
  return matchObject.finalScore;
};

//getting the user winnig team by id:
const getBetWinnerByID = async (apiID, userID) => {
  const betsColRef = collection(db, `users/${userID}/Bets`);
  const q = query(betsColRef, where("api_ID", "==", apiID));
  const data = await getDocs(q);
  let matchObject;
  data.forEach((doc) => (matchObject = { ...doc.data(), id: doc.id }));
  return matchObject.winner;
};

//checking the score and return the amount of points that the user earned.
export const checkingScore = async (apiID, userID) => {
  const reallScore = await getGameScoreByID(apiID);
  const betScore = await getBetScoreByID(apiID, userID);
  const reallWinner = await getGameWinnerByID(apiID);
  const betWiner = await getBetWinnerByID(apiID, userID);
  //super score = 10
  if (reallScore == betScore) return 10;
  //regular score = 5
  else if (reallWinner == betWiner) return 5;
  //false guess = 0
  else return 0;
};

//updating the score field in the user document
export const updateScore = async () => {
  const arrayOfUsersID = await getArrayOfIDfromUsers();
  arrayOfUsersID.forEach(async (userID) => {
    const userColRef = await doc(db, "users", userID);
    const arrayOfUserBets = await getArrayOfBets(userID);
    console.log(arrayOfUserBets);
    arrayOfUserBets.forEach(async (bet) => {
      const api_ID = bet.api_ID;
      //needs to check only in case to ignore of empty documents
      if (api_ID) {
        await checkingScore(api_ID, userID).then((data) => console.log(data));
      }

      // await updateDoc(userColRef, {
      //   score: (await getCurrentScore(userID)) + (await checkingScore(api_ID)),
      // });
    });
  });
};

updateScore();
