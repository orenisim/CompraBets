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
    doc
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
        docs.forEach(doc => bet = { ...doc.data(), id: doc.id });
        const docRef = await doc(db, `users/${user.id}/Bets`, bet.id);
        await updateDoc(docRef, {
            finalScore: betDetailsObject.finalScore,
            winner: betDetailsObject.winner
        });
    } else await addDoc(userBetsColRef, { ...betDetailsObject });
}


