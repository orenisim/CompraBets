//Header JavaScript
import { auth, logOutUser, addLeague, getLeagues } from "./usersFireBase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

// Get user that already log in
onAuthStateChanged(auth, (user) => {
  if (user == null) {
    window.location = "./index.html";
  }
  userNameHref.textContent = user.displayName;
});

//log out from user
const logOutButton = document.querySelector(".logOutButton");
logOutButton.addEventListener("click", () => {
  logOutUser().then(() => {
    alert("log out");
    window.location = "./index.html";
  });
});

//change the deafult user name + get object
const userNameHref = document.querySelector(".userNameHref");

//indicators to the relevent html for the add new league option
const createNewLeagueButton = document.querySelector("#createNewLeagueButton");
const newLeagueForm = document.querySelector(".newLeagueForm");

//idicators to the relevent html for the search league method
const searchLeague = document.querySelector("#searchLeagueInput");
const listLeagues = document.querySelector("#listOfLeagues");

//indicators for the relevent html for the add new league method
const myDropdown = document.querySelector("#myDropdown");

// open the new league creator after clicking the "Create New League" button
createNewLeagueButton.addEventListener("click", () => {
  newLeagueForm.classList.toggle("d-none");
});

//filtering the correct league during the search
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

searchLeague.addEventListener("click", () => {
  myDropdown.classList.toggle("show");
  const term = searchLeagueInput.value.trim().toLowerCase();
  filterLeague(term);
});

const searchLeagueInput = document.querySelector("#searchLeagueInput");

const filterLeague = (term) => {
  // add filtered class
  Array.from(myDropdown.children)
    .filter((league) => !league.textContent.toLowerCase().includes(term))
    .forEach((league) => league.classList.add("filtered"));

  // remove filtered class
  Array.from(myDropdown.children)
    .filter((league) => league.textContent.toLowerCase().includes(term))
    .forEach((league) => league.classList.remove("filtered"));
};
searchLeagueInput.addEventListener("keyup", () => {
  const term = searchLeagueInput.value.trim().toLowerCase();
  filterLeague(term);
});
//storing the league ID in the local storage for the next page of leagueInfo
const storeLeagueName = () => {
  const leaguesList = Array.from(myDropdown.children);
  leaguesList.forEach((league) => {
    league.addEventListener("click", (e) => {
      localStorage.setItem("leagueName", e.target.innerHTML.toLowerCase());
    });
  });
};

//Adding new league from the form
const leagueName = document.querySelector("#leagueName");
const password = document.querySelector("#password");
const submitButton = document.querySelector("#submitButton");

submitButton.addEventListener("click", () => {
  const league = {
    name: leagueName.value,
    password: password.value,
  };
  addLeague(league)
    .then((e) =>
      alert(`your league has created and your League ID is: ${e.id}`)
    )
    .catch((err) => console.log(err));
});

getLeagues()
  .then((arrayOfLeagues) => {
    arrayOfLeagues.forEach((league) => {
      myDropdown.innerHTML += `<a class="leagueName" href="../html/leagueInfo.html">${league.name}</a>`;
    });
    storeLeagueName();
  })
  .catch((err) => console.log(err));
