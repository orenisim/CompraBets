import { auth, logOutUser } from "./usersFireBase.js";
import { onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';


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
const filterLeaguea = (term) => {
  Array.from(listLeagues.children)
    .filter((league) => !league.textContent.includes(term))
    .forEach((league) => league.classList.add("filterd"));

  Array.from(listLeagues.children)
    .filter((league) => league.textContent.includes(term))
    .forEach((league) => league.classList.remove("filterd"));
};

searchLeague.addEventListener("keyup", () => {
  const term = searchLeague.value.trim();
  filterLeaguea(term);
});



//change the deafult user name
const userDiv = document.querySelector('.userSection');

// Get user that already log in
onAuthStateChanged(auth, (user) => {
  userDiv.textContent = `Hello ${user.displayName}, Welcome back!`;
});

//log out from user
const logOutButton = document.querySelector('.logOutButton');
logOutButton.addEventListener('click', () => {
  logOutUser().then(() => {
    alert("log out");
    window.location = "./index.html";
  })
});
