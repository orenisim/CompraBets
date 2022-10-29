import {
  auth, logOutUser, EmailVerification, PassReset,
  getUserObjectFromUserName
} from "./Firebase/usersFirebase.js";
import { getLeagueInfo } from "./Firebase/leaguesFirebase.js";
import { onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';



//change the deafult user name + get object
const userNameHref = document.querySelector('.userNameHref');
const userNameP = document.querySelector('.userNameP');
const userEmailP = document.querySelector('.userEmailP');
// Get user that already log in
onAuthStateChanged(auth, async (user) => {
  userNameHref.textContent = user.displayName;
  userNameP.textContent = user.displayName;
  userEmailP.textContent = user.email;

  const userObject = await getUserObjectFromUserName(user.displayName)
  if (userObject.league) {
    const leagueObject = await getLeagueInfo(userObject.league);
    updateLegauediv(leagueObject);
  }
});

//log out from user
const logOutButton = document.querySelector('.logOutButton');
logOutButton.addEventListener('click', () => {
  logOutUser().then(() => {
    alert("log out");
    window.location = "./index.html";
  })
});

//Send Email Verification
const emailVerButton = document.querySelector('.emailVerButton');
emailVerButton.addEventListener('click', () => {
  EmailVerification(auth)
    .then(() => emailVerButton.setAttribute('value', 'Done!'))
    .catch(err => console.log(err));
});

//Send Email Password Reset
const passResetButton = document.querySelector('.passResetButton');
passResetButton.addEventListener('click', () => {
  PassReset(auth, auth.currentUser.email)
    .then(() => passResetButton.setAttribute('value', 'Email Sent!'))
    .catch(err => console.log(err));
});

//update league div
const updateLegauediv = leagueObject => {
  const leagueNameP = document.querySelector('#leagueName');
  leagueNameP.textContent = leagueObject.name;
  const numberOfPlayersP = document.querySelector('#numberOfPlayers');
  numberOfPlayersP.textContent = leagueObject.numOfPlayers;
} 