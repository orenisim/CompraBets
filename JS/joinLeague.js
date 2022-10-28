//Header JavaScript
import { auth, logOutUser } from "./usersFireBase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

//change the deafult user name + get object
const userNameHref = document.querySelector(".userNameHref");
// Get user that already log in
onAuthStateChanged(auth, (user) => {
  if(user == null) {
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

//indicators to the relebent html for the add new league option
const createNewLeagueButton = document.querySelector("#createNewLeagueButton");
const newLeagueForm = document.querySelector(".newLeagueForm");

//idicators to the relevent html for the search league method
const searchLeague = document.querySelector("#searchLeagueInput");
const listLeagues = document.querySelector("#listOfLeagues");

// open the new league creator after clicking the "Create New League" button
createNewLeagueButton.addEventListener("click", () => {
  newLeagueForm.classList.toggle("d-none");
});

//filtering the correct league during the search
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

const myDropdown = document.querySelector("#myDropdown");
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

const leaguesList = Array.from(myDropdown.children);

leaguesList.forEach((league) => {
  league.addEventListener("click", (e) => {
    searchLeagueInput.value = e.target.innerHTML;
  });
});






