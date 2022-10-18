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
