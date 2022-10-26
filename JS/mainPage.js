//Header JavaScript
import { auth, logOutUser, getMatchesFromDB } from "./usersFireBase.js";
import { onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';

//change the deafult user name + get object
const userNameHref = document.querySelector('.userNameHref');
// Get user that already log in
onAuthStateChanged(auth, (user) => {
  userNameHref.textContent = user.displayName;
});

//log out from user
const logOutButton = document.querySelector('.logOutButton');
logOutButton.addEventListener('click', () => {
  logOutUser().then(() => {
    alert("log out");
    window.location = "./index.html";
  })
});

//My League

// the indicators to the nav buttons in the top of the page

const myLeagueLink = document.querySelector("#navMyLeague");
const myBetsLink = document.querySelector("#navMyBets");
const friendsBetsLink = document.querySelector("#navFriendsBets");
const rulesLink = document.querySelector("#navRules");

// the indicators to the different pages in the main page
const myLeagueDiv = document.querySelector("#myLeagueDiv");
const myBetsDiv = document.querySelector("#myBetsDiv");
const friendsBetsDiv = document.querySelector("#friendsBetsDiv");
const rulesDiv = document.querySelector("#rulesDiv");

let currentActiveNav = myLeagueLink;
let currentActiveDisplay = myLeagueDiv;

//function that gets the nav button that clicked and reload the page to the correct page
const changeDisplay = (navlink, displayDiv) => {
  currentActiveNav.classList.remove("active");
  currentActiveDisplay.classList.add("d-none");
  navlink.classList.add("active");
  displayDiv.classList.remove("d-none");
  currentActiveNav = navlink;
  currentActiveDisplay = displayDiv;
};

//for each nav button calling the function that will diaplay the correct page
myLeagueLink.addEventListener("click", () => {
  changeDisplay(myLeagueLink, myLeagueDiv);
});

myBetsLink.addEventListener("click", () => {
  changeDisplay(myBetsLink, myBetsDiv);
});

friendsBetsLink.addEventListener("click", () => {
  changeDisplay(friendsBetsLink, friendsBetsDiv);
});

rulesLink.addEventListener("click", () => {
  changeDisplay(rulesLink, rulesDiv);
});

//End of My League


//My Bets

//create matches elements
const addMatchToForm = (form, match, firstORsecond) => {
  //check if where to insert the match, first col or second col
  const rowName = `round${match.gameWeek}rowNumber${Math.floor(firstORsecond / 2)}`
  //if even first col, odd second col
  if (!(firstORsecond % 2)) {
    form.innerHTML += `
    <div id="${rowName}" class="row pt-2">
     <div class="col-6 mb-4">
      <h6 class="text-muted ms-1">${match.group} - ${match.date} - ${match.time}</h6>
      <p class="my-2">
       <img src="${match.iconHomeTeamURL}" alt="flagIcon"
         class="mb-1 flagIcon">
       <label class="fw-bold">${match.homeTeam}</label>
       <input type="number" id="homeTeamScore" min="0" max="10" required>
       :
       <input type="number" id="awayTeamScore" min="0" max="10" required>
       <label class="fw-bold">${match.awayTeam}</label>
       <img src="${match.iconAwayTeamURL}" alt="flagIcon"
         class="mb-1 flagIcon">
      </p>
     </div>
   </div>`
  } else {
    const row = document.querySelector(`#${rowName}`);
    row.innerHTML += `
    <div class="col-6 mb-4">
     <h6 class="text-muted ms-1">${match.group} - ${match.date} - ${match.time}</h6>
     <p class="my-2">
      <img src="${match.iconHomeTeamURL}" alt="flagIcon"
        class="mb-1 flagIcon">
      <label class="fw-bold">${match.homeTeam}</label>
      <input type="number" id="homeTeamScore" min="0" max="10" required>
      :
      <input type="number" id="awayTeamScore" min="0" max="10" required>
      <label class="fw-bold">${match.awayTeam}</label>
      <img src="${match.iconAwayTeamURL}" alt="flagIcon"
        class="mb-1 flagIcon">
     </p>
    </div>`
  }
}

//query selectors to all buttons and forms of my bets
const arrayOfRoundsForms = [
  document.querySelector('.roundOneForm'),
  document.querySelector('.roundTwoForm'),
  document.querySelector('.roundThreeForm'),
  document.querySelector('.round16Form')
]
const arrayOfRoundsButtons = [
  document.querySelector('.round1btn'),
  document.querySelector('.round2btn'),
  document.querySelector('.round3btn'),
  document.querySelector('.roundOf16btn')
]
const backButton = document.querySelector('.backwardbtn');
const forwardButton = document.querySelector('.forwardbtn');

//Defalut position
let currentPosDisplay = 0;

getMatchesFromDB(auth).then(arrayOfMatches => {
  //array to know where to display the next game in col 1 or 2
  const arrayOfCoundersPerRounds = [0, 0, 0, 0];
  arrayOfMatches.forEach(match => {
    if (match.gameWeek === 1) {
      addMatchToForm(arrayOfRoundsForms[0], match, arrayOfCoundersPerRounds[0]);
      arrayOfCoundersPerRounds[0]++;
    } else if (match.gameWeek === 2) {
      addMatchToForm(arrayOfRoundsForms[1], match, arrayOfCoundersPerRounds[1]);
      arrayOfCoundersPerRounds[1]++;
    } else if (match.gameWeek === 3) {
      addMatchToForm(arrayOfRoundsForms[2], match, arrayOfCoundersPerRounds[2]);
      arrayOfCoundersPerRounds[2]++;
    }
  });
  arrayOfRoundsForms.forEach(form => {
    form.innerHTML += `<input type="submit" class="btn btn-primary mt-3 col-12 fw-bold" value="Bet">`
  })
})

//change display both form and button
const changeDisplayRound = newPosDisplay => {
  //change display buttons
  arrayOfRoundsButtons[currentPosDisplay].classList.remove('active');
  arrayOfRoundsButtons[newPosDisplay].classList.add('active');
  //change display Forms
  arrayOfRoundsForms[currentPosDisplay].classList.add('d-none');
  arrayOfRoundsForms[newPosDisplay].classList.remove('d-none');
  //moving foward or back to display new buttons
  console.log(arrayOfRoundsButtons[newPosDisplay].classList.contains('d-none'));
  if (newPosDisplay > 2) {
    arrayOfRoundsButtons[newPosDisplay - 3].classList.add('d-none');
    arrayOfRoundsButtons[newPosDisplay].classList.remove('d-none');
  } else if (arrayOfRoundsButtons[newPosDisplay].classList.contains('d-none')) {
    arrayOfRoundsButtons[newPosDisplay + 3].classList.add('d-none');
    arrayOfRoundsButtons[newPosDisplay].classList.remove('d-none');
  }
  //change pointer to current form and button
  currentPosDisplay = newPosDisplay;
}

//nav
//event listeners to all the nav buttons + back and foward buttons
for (let i = 0; i < arrayOfRoundsButtons.length; i++) {
  arrayOfRoundsButtons[i].addEventListener('click', () => {
    changeDisplayRound(i);
  });
}
backButton.addEventListener('click', () => {
  if (!currentPosDisplay) return;
  changeDisplayRound(currentPosDisplay - 1);
})
forwardButton.addEventListener('click', () => {
  if (currentPosDisplay === arrayOfRoundsForms.length - 1) return;
  changeDisplayRound(currentPosDisplay + 1);
})

//End of My Bets