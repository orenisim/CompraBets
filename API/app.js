import fetch from "node-fetch";

import { initializeApp } from 'firebase/app'
const firebaseConfig = {
  apiKey: "AIzaSyC_jSUTKeamVerqfTUzk6okNxEMuKwHCfc",
  authDomain: "comprabets.firebaseapp.com",
  projectId: "comprabets",
  storageBucket: "comprabets.appspot.com",
  messagingSenderId: "4808226814",
  appId: "1:4808226814:web:85f7766bf4afad0b7272af"
};
const app = initializeApp(firebaseConfig);

import { getFirestore, collection, addDoc } from 'firebase/firestore'
const db = getFirestore();
//collection name
const matchesColRef = collection(db, 'matches');

// getting the World Cup 2022 matches
const base = "https://api.football-data.org/v4/competitions/WC/matches";
const getMatchesFromAPI = async () => {
  const response = await fetch(base, {
    headers: {
      "X-Auth-Token": "4a7cd31681e04ac4ae31805f397eae26",
    },
  });
  const data = await response.json();
  return data;
};

const addMatch = match => {
  if (match.stage == 'GROUP_STAGE') {
    const date = match.utcDate.split('T');
    date[1] = date[1].substring(0, 8);
    addDoc(matchesColRef, {
      awayTeam: match.awayTeam.name,
      date: date[0],
      gameWeek: match.matchday,
      group: match.group,
      homeTeam: match.homeTeam.name,
      iconAwayTeamURL: match.awayTeam.crest,
      iconHomeTeamURL: match.homeTeam.crest,
      stage: match.stage,
      time: date[1]
    })
  }
}

const updateMatches = async () => {
  const data = await getMatchesFromAPI();
  data.matches.forEach(match => addMatch(match));
}


updateMatches()
  .then(() => console.log('Done!'))
  .catch((err) => console.log(err));


    // data.matches.forEach(match => {
    //   if (match.group == 'GROUP_A') {
    //     const date = match.utcDate.split('T');
    //     date[1] = date[1].substring(0, 8);
    //     console.log(`Day: #${match.matchday}, Stage: ${match.stage}, Group: ${match.group}`)
    //     console.log(`Date: ${date[0]}, Time: ${date[1]}`);
    //     console.log(`Home Team: ${match.homeTeam.name}`)
    //     console.log(`Icon URL : ${match.homeTeam.crest}`);
    //     console.log(`Away Team: ${match.awayTeam.name}`)
    //     console.log(`Icon URL : ${match.awayTeam.crest}`);
    //     console.log('///////////');
    //   }
    // });
  // })


/*PLAN B= Run using outside server.

fetch(
  `https://api.allorigins.win/get?url=${encodeURIComponent(
    "http://api.football-data.org/v4/competitions/"
  )}`
)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error("Network response was not ok.");
  })
  .then((data) => console.log(data.contents));
  
  */
