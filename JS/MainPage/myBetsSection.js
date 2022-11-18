//Header JavaScript
import { auth, getMatchesFromDB } from "../Firebase/usersFirebase.js";
import { addBetPerMatch, getArrayOfTeams, addOpeningBet } from "../Firebase/betsFirebase.js";
import { userNameHref } from "./general.js";

//My Bets

//create buttons nav
const createButtonsPageItem = (datesArray) => {
  const buttonsPageItemDiv = document.querySelector(".buttonsPage-Item");
  buttonsPageItemDiv.innerHTML = `
  <li class="page-item">
    <button class="backwardbtn page-link p-2 px-4 border-0 rounded">&laquo;</button>
  </li>`;
  let counter = 0;

  //for the opening bet
  buttonsPageItemDiv.innerHTML += `<li class="page-item"><button class="navBtn0 page-link p-2 active px-4 border-0 rounded"> 
  Opening Bet</button></li>`

  datesArray.forEach((date, index) => {
    date = date.substring(0, 5);
    if (counter < 2) {
      buttonsPageItemDiv.innerHTML += `<li class="page-item"><button class="navBtn${index + 1} page-link p-2 px-4 border-0 rounded"> Day ${index + 1
        } </button></li>`;
    } else {
      buttonsPageItemDiv.innerHTML += `<li class="page-item"><button class="navBtn${index + 1} page-link p-2 px-4 border-0 rounded d-none"> Day ${index + 1} </button></li>`;
    }
    counter++;
  });
  buttonsPageItemDiv.innerHTML += `<li class="page-item">
    <button class="forwardbtn page-link p-2 px-4 border-0 rounded">&raquo;</button>
  </li>`;
  addEvenetListenersToButtons();
};

//create Form per date
const createFormPerDate = (datesArray) => {
  const formsPerDate = document.querySelector(".formsPerDate");

  //for the opening bet
  createOpeningBet(formsPerDate);

  for (let i = 1; i < datesArray.length + 1; i++) {
    let date = datesArray[i - 1];
    formsPerDate.innerHTML += `
    <form class="formNumber${i} date_${date} d-none">
      <h3>Game Day ${i}
       <span class="text-muted fs-6 ms-1">${date}</span></h3>
      <hr class="mt-0 mb-4">
    </form>`;
  }

};

//add opening bet Form to dad form
const createOpeningBet = (form) => {
  form.innerHTML += `
  <form class="formNumber0">
  <h3>World Cup 2022 Winner</h3>
  <hr class="mt-0 mb-4">
  <select class="form-select mt-2 mb-5" size="4" aria-label="Winner select">
  </select>
  </form>`;
  getArrayOfTeams().
    then(arrayOfTeams => {
      const selectWinner = document.querySelector('.form-select');
      arrayOfTeams.forEach((team, index) => {
        if (!index) {
          selectWinner.innerHTML += `<option selected value="${team}">${team}</option>`;
        } else selectWinner.innerHTML += `<option value="${team}">${team}</option>`
      });


    })
    .catch(err => console.log(err));
}


//get array of dates matches
const getMatchesDatesArray = (arrayOfMatches) => {
  const datesSet = new Set();
  arrayOfMatches.forEach((match) => {
    datesSet.add(match.date);
  });
  let datesArray = Array.from(datesSet);
  datesArray = datesArray.sort((a, b) => {
    let arrayA = a.split("/");
    let arrayB = b.split("/");
    let sumA = Number(arrayA[0]) + Number(arrayA[1] * 30);
    let sumB = Number(arrayB[0]) + Number(arrayB[1] * 30);
    return sumA - sumB;
  });

  return datesArray;
};

//create matches elements
const addMatchToForm = (form, match, counter, index) => {
  //check if where to insert the match, first col or second col
  const rowName = `form${index}Row${Math.floor(counter / 2)}`;
  //if even first col, odd second col
  if (!(counter % 2)) {
    form.innerHTML += `
    <div id="${rowName}" class="row mt-2 mb-1">
     <div class="col-lg-6 col-md-7 mb-4">
      <h6 class="text-muted">${match.group} - ${match.date} - ${match.time}</h6>
      <p id="${match.api_ID}" class="gameNumber${counter} my-2">
       <img src="${match.iconHomeTeamURL}" alt="flagIcon"
         class="mb-1 flagIcon">
       <label class="homeTeamName fw-bold">${match.homeTeam}</label>
       <input type="number" id="homeTeamScore" min="0" max="10" required>
       :
       <input type="number" id="awayTeamScore" min="0" max="10" required>
       <label class="awayTeamName fw-bold">${match.awayTeam}</label>
       <img src="${match.iconAwayTeamURL}" alt="flagIcon"
         class="mb-1 flagIcon">
      </p>
     </div>
   </div>`;
  } else {
    const row = document.querySelector(`#${rowName}`);
    row.innerHTML += `
    <div class="col-lg-6 col-md-7 mb-4">
     <h6 class="text-muted">${match.group} - ${match.date} - ${match.time}</h6>
     <p id="${match.api_ID}" class="gameNumber${counter} my-2">
      <img src="${match.iconHomeTeamURL}" alt="flagIcon"
        class="mb-1 flagIcon">
      <label class="homeTeamName fw-bold">${match.homeTeam}</label>
       <input type="number" id="homeTeamScore" min="0" max="10" required>
       :
       <input type="number" id="awayTeamScore" min="0" max="10" required>
      <label class="awayTeamName fw-bold">${match.awayTeam}</label>
      <img src="${match.iconAwayTeamURL}" alt="flagIcon"
        class="mb-1 flagIcon">
     </p>
    </div>`;
  }
};

//create Bet submit buttons
const createBetButtons = (numberOfdates) => {
  for (let i = 0; i < numberOfdates + 1; i++) {
    const form = document.querySelector(`.formNumber${i}`);
    form.innerHTML += `<input type="submit" id="submitFormNumber${i}" class="btn btn-primary mt-3 col-12 fw-bold" value="Bet">`;
  }
};

//get matches form DataBase and create My Bets section
let numberOfdates;
//number of games per day
let arrayOfCountersPerDay;
//array of dates
let datesArray;

//get matches from db and update web
getMatchesFromDB(auth).then((arrayOfMatches) => {
  datesArray = getMatchesDatesArray(arrayOfMatches);
  numberOfdates = datesArray.length;
  createButtonsPageItem(datesArray);
  createFormPerDate(datesArray);
  //array of counters how many games per day/form
  arrayOfCountersPerDay = new Array(numberOfdates + 1).fill(0);
  arrayOfMatches.forEach((match) => {
    const pos = datesArray.indexOf(match.date) + 1;
    const form = document.querySelector(`.formNumber${pos}`);
    addMatchToForm(form, match, arrayOfCountersPerDay[pos], pos);
    arrayOfCountersPerDay[pos]++;
  });
  createBetButtons(numberOfdates);
  addEvenetListenersToForms();
  updateDependOnDate();
});

//Defalut position
let currentPosDisplay = 0;

// change display both form and button
const changeDisplayRound = (newPosDisplay) => {
  //change display buttons
  const currentButton = document.querySelector(`.navBtn${currentPosDisplay}`);
  const newButton = document.querySelector(`.navBtn${newPosDisplay}`);
  currentButton.classList.remove("active");
  newButton.classList.add("active");
  //change display Forms
  const currentForm = document.querySelector(`.formNumber${currentPosDisplay}`);
  const newForm = document.querySelector(`.formNumber${newPosDisplay}`);
  currentForm.classList.add("d-none");
  newForm.classList.remove("d-none");
  //moving foward or back to display new buttons
  if (newPosDisplay > currentPosDisplay && newPosDisplay > 2) {
    if (newButton.classList.contains("d-none")) {
      newButton.classList.remove("d-none");
      const displayNoneButton = document.querySelector(
        `.navBtn${newPosDisplay - 3}`
      );
      displayNoneButton.classList.add("d-none");
    }
  } else if (
    newPosDisplay < currentPosDisplay &&
    newPosDisplay < numberOfdates - 2
  ) {
    if (newButton.classList.contains("d-none")) {
      newButton.classList.remove("d-none");
      const displayNoneButton = document.querySelector(
        `.navBtn${newPosDisplay + 3}`
      );
      displayNoneButton.classList.add("d-none");
    }
  }

  //change pointer to current form and button
  currentPosDisplay = newPosDisplay;
};

//event listeners to all the nav buttons + back and foward buttons
const addEvenetListenersToButtons = () => {
  for (let i = 0; i < numberOfdates + 1; i++) {
    const button = document.querySelector(`.navBtn${i}`);
    button.addEventListener("click", () => {
      changeDisplayRound(i);
    });
  }

  //foward and backward buttons
  const backButton = document.querySelector(".backwardbtn");
  const forwardButton = document.querySelector(".forwardbtn");
  backButton.addEventListener("click", () => {
    if (!currentPosDisplay) return;
    changeDisplayRound(currentPosDisplay - 1);
  });
  forwardButton.addEventListener("click", () => {
    if (currentPosDisplay === numberOfdates) return;
    changeDisplayRound(currentPosDisplay + 1);
  });
};

//add event listeners to forms
const addEvenetListenersToForms = () => {
  for (let i = 0; i < numberOfdates + 1; i++) {
    let nameOfForm = `formNumber${i}`;
    const formElement = document.querySelector("." + nameOfForm);
    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!i) {
        //add opening bet event listener
        const selectWinner = document.querySelector('.form-select');
        addOpeningBet(userNameHref.textContent, selectWinner.value);
      } else {
        const numberOfGames = arrayOfCountersPerDay[i];
        for (let j = 0; j < numberOfGames; j++) {
          const pElement = document.querySelector(
            `.${nameOfForm} .gameNumber${j}`
          );
          const api_ID = pElement.getAttribute("id");
          const homeTeamScore = document.querySelector(
            `.${nameOfForm} .gameNumber${j} #homeTeamScore`
          ).value;
          const awayTeamScore = document.querySelector(
            `.${nameOfForm} .gameNumber${j} #awayTeamScore`
          ).value;
          const homeTeamName = document.querySelector(
            `.${nameOfForm} .gameNumber${j} .homeTeamName`
          ).textContent;
          const awayTeamName = document.querySelector(
            `.${nameOfForm} .gameNumber${j} .awayTeamName`
          ).textContent;
          const winner = getWinner(
            homeTeamScore,
            homeTeamName,
            awayTeamName,
            awayTeamScore
          );
          const finalScore = homeTeamScore + ":" + awayTeamScore;
          const betDetailsObject = { api_ID: Number(api_ID), finalScore, winner };
          addBetPerMatch(userNameHref.textContent, betDetailsObject).catch(
            (err) => console.log(err)
          );
        }
      }
    });
  }
};

//get winner of the game form score
const getWinner = (
  homeTeamScore,
  homeTeamName,
  awayTeamName,
  awayTeamScore
) => {
  if (homeTeamScore > awayTeamScore) return homeTeamName;
  else if (homeTeamScore < awayTeamScore) return awayTeamName;
  else return "Tie"; //maybe needs to change depand on the API
};

//get current Time and Date Israel Time Zone
const getCurrentTime = () => {
  let fullDate = new Date().toLocaleString("en-US", { timeZone: "Israel" });
  fullDate = fullDate.split(", ");
  const day = fullDate[0].split("/")[1];
  const month = fullDate[0].split("/")[0];
  const year = fullDate[0].split("/")[2];

  let hour = fullDate[1].split(":")[0];
  if (fullDate[1].split(":")[2].includes("PM")) hour = Number(hour) + 12;
  const minute = fullDate[1].split(":")[1];

  return {
    date: {
      day: Number(day),
      month: Number(month),
      year: Number(year),
    },
    time: {
      hour: Number(hour),
      minute: Number(minute),
    },
  };
};

// calculate sum of Hours form full date
const calculatorSumOfHours = (dateAndTimeObject) => {
  const sum =
    dateAndTimeObject.date.year * 8760 +
    dateAndTimeObject.date.month * 730.5 +
    dateAndTimeObject.date.day * 24 +
    dateAndTimeObject.time.hour +
    dateAndTimeObject.time.minute / 60;
  return sum;
};

//check if the bet date is over
const updateDependOnDate = () => {
  const dateAndTimeObj = getCurrentTime();
  for (let i = 0; i < numberOfdates + 1; i++) {
    let formDateAndTimeObject;
    if (!i) {
      const arrayOfDate = datesArray[0].split("/");
      formDateAndTimeObject = {
        date: {
          day: arrayOfDate[0],
          month: arrayOfDate[1],
          year: arrayOfDate[2],
        },
        time: {
          hour: 12,
          minute: 0,
        },
      };
    } else {
      const arrayOfDate = datesArray[i - 1].split("/");
      //create time and date object
      formDateAndTimeObject = {
        date: {
          day: arrayOfDate[0],
          month: arrayOfDate[1],
          year: arrayOfDate[2],
        },
        time: {
          hour: 12,
          minute: 0,
        },
      };
    }
    const currentSumOfHours = calculatorSumOfHours(dateAndTimeObj);
    const formSumOfHours = calculatorSumOfHours(formDateAndTimeObject);
    const form = document.querySelector(`.formNumber${i}`);
    updateDependOnDateDisplay(currentSumOfHours, formSumOfHours, form, i);
  }
};


//if current date and time is higher then form date and time disabled the form
const updateDependOnDateDisplay = (currentSumOfHours, formSumOfHours, form, i) => {
  if (currentSumOfHours > formSumOfHours) {
    if (i != numberOfdates - 1) {
      changeDisplayRound(currentPosDisplay + 1);
    }
    const button = document.querySelector(`.navBtn${i}`);
    button.classList.add("disabled");
    if (!i) {
      form.innerHTML = `
      <h3>World Cup 2022 Winner <span class="text-muted fs-6 ms-1">${datesArray[i]
        }</span></h3>
      <hr class="mt-0 mb-4">
      <h1 class="text-muted">Bet Over!</h1>`;
    } else {
      form.innerHTML = `
      <h3>Game Day ${i} <span class="text-muted fs-6 ms-1">${datesArray[i]
        }</span></h3>
      <hr class="mt-0 mb-4">
      <h1 class="text-muted">Bet Over!</h1>`;
    }
  } else {
    form.innerHTML += `<h6 class="text-center text-muted mb-0 pb-0">${Math.floor(
      (formSumOfHours - currentSumOfHours) / 24
    )} day, 
      ${Math.floor((formSumOfHours - currentSumOfHours) % 24)} Hours and 
      ${Math.floor(((formSumOfHours - currentSumOfHours) * 60) % 60)} Minutes
      until end of bet!</h6>`;
  }
}

//End of My Bets
