import { db, getArrayOfIDfromUsers } from "../JS/Firebase/usersFirebase.js";
import { getArrayOfBets } from "../JS/Firebase/betsFirebase.js";
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
  onSnapshot,
} from "firebase/firestore";

const matchesColRef = collection(db, "matches");

//getting the game by ID:
const getGameObject = async (apiID) => {
  const q = query(matchesColRef, where("api_ID", "==", apiID));
  const data = await getDocs(q);
  let matchObject;
  data.forEach((doc) => (matchObject = { ...doc.data(), id: doc.id }));
  return matchObject;
};

//getting the user game bet by id:
const getBetObject = async (apiID, userID) => {
  const betsColRef = collection(db, `users/${userID}/Bets`);
  const q = query(betsColRef, where("api_ID", "==", apiID));
  const data = await getDocs(q);
  let matchObject;
  data.forEach((doc) => (matchObject = { ...doc.data(), id: doc.id }));
  return matchObject;
};

//getting the current score from the user
const getCurrentScore = async (userID) => {
  const docRef = await doc(db, "users", userID);
  const docData = await getDoc(docRef);
  return docData.data().score;
};

//getting the current superScore from the user
const getCurrentsuperScore = async (userID) => {
  const docRef = await doc(db, "users", userID);
  const docData = await getDoc(docRef);
  return docData.data().superScore;
};

//checking the score and return the amount of points that the user earned.
const checkingScore = async (apiID, userID) => {
  const gameObject = await getGameObject(apiID);
  const realScore = gameObject.finalScore;
  const realWinner = gameObject.winner;
  const betObject = await getBetObject(apiID, userID);
  const betScore = betObject.finalScore;
  const betWinner = betObject.winner;

  //super score = 3
  if (realScore == betScore) return 3;
  //regular score = 1
  else if (realWinner == betWinner) return 1;
  //false guess = 0
  else return 0;
};

//updating the score field in the user document
const updateScore = async () => {
  const arrayOfUsersID = await getArrayOfIDfromUsers();
  for (let i = 0; i < arrayOfUsersID.length; i++) {
    const userID = arrayOfUsersID[i];
    let currentSuperScore = getCurrentsuperScore(userID);
    let currentPoints = await getCurrentScore(userID);
    const userColRef = await doc(db, "users", userID);
    const arrayOfUserBets = await getArrayOfBets(userID);
    let totalPoints = currentPoints;
    for (const bet of arrayOfUserBets) {
      let api_ID = bet.api_ID;
      //needs to check only in case to ignore of empty documents --> inside the if is only tests right now...
      let addPoints = await checkingScore(api_ID, userID);
      let totalSuperScore;
      if (addPoints == 3) totalSuperScore++;
      totalPoints += addPoints;
    }
    console.log(`user ${userID} earned: ${totalPoints}`);
    if (totalPoints > currentPoints) {
      await updateDoc(userColRef, {
        score: totalPoints,
      });
    }
    if (totalSuperScore > currentSuperScore) {
      await updateDoc(userColRef, {
        superScore: totalSuperScore,
      });
    }
  }
};

updateScore()
  .then(() => console.log("Score is been updated!"))
  .catch((err) => console.log(err));
