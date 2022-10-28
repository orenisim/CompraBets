//Header JavaScript
import { auth, logOutUser, getMatchesFromDB } from "./usersFireBase.js";
import { onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';

//change the deafult user name + get object
const userNameHref = document.querySelector('.userNameHref');
// Get user that already log in
onAuthStateChanged(auth, (user) => {
  if(user == null) {
    window.location = "./index.html";
  }
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

//create buttons nav
const createButtonsPageItem = datesArray => {
  const buttonsPageItemDiv = document.querySelector('.buttonsPage-Item');
  buttonsPageItemDiv.innerHTML = `
  <li class="page-item">
    <button class="backwardbtn page-link p-2 px-4 border-0 rounded">&laquo;</button>
  </li>`;
  let counter = 0;
  datesArray.forEach((date, index) => {
    date = date.substring(0,5);
    if (!counter) {
      buttonsPageItemDiv.innerHTML += `<li class="page-item"><button class="navBtn${index} page-link p-2 active px-4 border-0 rounded"> Day ${index+1} </button></li>`
    } else if (counter < 3) {
      buttonsPageItemDiv.innerHTML += `<li class="page-item"><button class="navBtn${index} page-link p-2 px-4 border-0 rounded"> Day ${index+1} </button></li>`
    } else {
      buttonsPageItemDiv.innerHTML += `<li class="page-item"><button class="navBtn${index} page-link p-2 px-4 border-0 rounded d-none"> Day ${index+1} </button></li>`
    }
    counter++;
  })
  buttonsPageItemDiv.innerHTML += 
  `<li class="page-item">
    <button class="forwardbtn page-link p-2 px-4 border-0 rounded">&raquo;</button>
  </li>`;
  addEvenetListenersToButtons();
}

//create Form per date
const createFormPerDate = datesArray => {
  const arrayOfFormsPerDate = [];
  const formsPerDate = document.querySelector('.formsPerDate');
  datesArray.forEach((date, index) => {
    formsPerDate.innerHTML += `
    <form class="formNumber${index}">
      <h3>Game Day ${index + 1} <span class="text-muted fs-6 ms-1">${date}</span></h3>
      <hr class="mt-0 mb-4">
    </form>`;
    if (index) document.querySelector(`.formNumber${index}`).classList.add('d-none');
  });
}

//get array of dates matches
const getMatchesDatesArray = arrayOfMatches => {
  const datesSet = new Set();
  arrayOfMatches.forEach(match => {
    datesSet.add(match.date);
  })
  let datesArray = Array.from(datesSet);
  datesArray = datesArray.sort((a, b) => {
    let arrayA = a.split('/');
    let arrayB = b.split('/');
    let sumA = Number(arrayA[0]) + Number(arrayA[1] * 30);
    let sumB = Number(arrayB[0]) + Number(arrayB[1] * 30);
    return sumA - sumB;
  })

  return datesArray;
}

//create matches elements
const addMatchToForm = (form, match, counter, index) => {
  //check if where to insert the match, first col or second col
  const rowName = `form${index}Row${Math.floor(counter / 2)}`;
  //if even first col, odd second col
  if (!(counter % 2)) {
    form.innerHTML += `
    <div id="${rowName}" class="row mt-3 mb-1">
     <div class="col-6 mb-4">
      <h6 class="text-muted">${match.group} - ${match.date} - ${match.time}</h6>
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
     <h6 class="text-muted">${match.group} - ${match.date} - ${match.time}</h6>
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

//create Bet submit buttons
const createBetButtons = numberOfdates => {
  for (let i = 0; i < numberOfdates; i++) {
    const form = document.querySelector(`.formNumber${i}`);
    form.innerHTML += `<input type="submit" class="submitFormNumber${i} btn btn-primary mt-3 col-12 fw-bold" value="Bet">`;
  }
}

//get matches form DataBase and create My Bets section
let numberOfdates;
getMatchesFromDB(auth).then(arrayOfMatches => {
  const datesArray = getMatchesDatesArray(arrayOfMatches);
  numberOfdates = datesArray.length;
  createButtonsPageItem(datesArray);
  createFormPerDate(datesArray);
  //array of counters how many games per day/form
  const arrayOfCountersPerRounds = new Array(numberOfdates).fill(0);
  arrayOfMatches.forEach(match => {
    const pos = datesArray.indexOf(match.date);
    const form = document.querySelector(`.formNumber${pos}`);
    addMatchToForm(form, match, arrayOfCountersPerRounds[pos], pos);
    arrayOfCountersPerRounds[pos]++;
  });
  createBetButtons(numberOfdates);
});


//Defalut position
let currentPosDisplay = 0;

// change display both form and button
const changeDisplayRound = newPosDisplay => {
  //change display buttons
  const currentButton = document.querySelector(`.navBtn${currentPosDisplay}`);
  const newButton = document.querySelector(`.navBtn${newPosDisplay}`);
  currentButton.classList.remove('active');
  newButton.classList.add('active');
  //change display Forms
  const currentForm = document.querySelector(`.formNumber${currentPosDisplay}`);
  const newForm = document.querySelector(`.formNumber${newPosDisplay}`);
  currentForm.classList.add('d-none');
  newForm.classList.remove('d-none');
  //moving foward or back to display new buttons
  if(newPosDisplay > currentPosDisplay && newPosDisplay > 2) {
    if(newButton.classList.contains('d-none')) {
      newButton.classList.remove('d-none');
      const displayNoneButton = document.querySelector(`.navBtn${newPosDisplay - 3}`);
      displayNoneButton.classList.add('d-none');
    }
  } else if(newPosDisplay < currentPosDisplay && newPosDisplay < numberOfdates - 2) {
    if(newButton.classList.contains('d-none')) {
      newButton.classList.remove('d-none');
      const displayNoneButton = document.querySelector(`.navBtn${newPosDisplay + 3}`);
      displayNoneButton.classList.add('d-none');
    }
  }

  //change pointer to current form and button
  currentPosDisplay = newPosDisplay;
}

//event listeners to all the nav buttons + back and foward buttons
const addEvenetListenersToButtons = () => {
  for (let i = 0; i < numberOfdates; i++) {
    const button = document.querySelector(`.navBtn${i}`);
    button.addEventListener('click', () => {
      changeDisplayRound(i);
    });
  }

  //foward and backward buttons
  const backButton = document.querySelector('.backwardbtn');
  const forwardButton = document.querySelector('.forwardbtn');
  backButton.addEventListener('click', () => {
    if (!currentPosDisplay) return;
    changeDisplayRound(currentPosDisplay - 1);
  })
  forwardButton.addEventListener('click', () => {
    if (currentPosDisplay === numberOfdates - 1) return;
    changeDisplayRound(currentPosDisplay + 1);
  })
}

//End of My Bets