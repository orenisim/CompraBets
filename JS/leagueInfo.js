import { auth, logOutUser, getUserObjectFromUserName } from "./Firebase/usersFirebase.js";
import { getLeagueInfo, joinLeague } from "./Firebase/leaguesFirebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

//Header JavaScript

//change the deafult user name + get object
const userNameHref = document.querySelector(".userNameHref");
// Get user that already log in
onAuthStateChanged(auth, user => {
  if (user == null) {
    window.location = "../index.html";
  }
  const userObject = getUserObjectFromUserName(user.displayName)
    .then(userObject => {
      if (userObject.league) {
        window.location = "./mainPage.html"
      }
      userNameHref.textContent = user.displayName;
    });
  });

  //log out from user
  const logOutButton = document.querySelector(".logOutButton");
  logOutButton.addEventListener("click", () => {
    logOutUser().then(() => {
      alert("log out");
      window.location = "../index.html";
    });
  });

  //Update html page form league information
  const leagueNameElement = document.querySelector("#leagueName");
  const numOfPlayersElement = document.querySelector("#numOfPlayers");

  const leagueName = localStorage.getItem("leagueName");

  getLeagueInfo(leagueName)
    .then((leagueDoc) => {
      leagueNameElement.textContent = leagueDoc.name;
      numOfPlayersElement.textContent = leagueDoc.numOfPlayers;
    })
    .catch((err) => console.log(err));

  ///join a new league
  const joinLeagueForm = document.querySelector('#joinLeagueForm');
  const passToLeague = joinLeagueForm.passToLeague;
  const errmsgElement = document.querySelector('#errmsg');

  joinLeagueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    joinLeague(userNameHref.textContent, leagueName, passToLeague.value)
      .then(() => {
        window.location = "./mainPage.html";
      })
      .catch(err => {
        errmsgElement.textContent = err.message;
      });
  })