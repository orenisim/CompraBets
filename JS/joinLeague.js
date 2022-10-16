const createNewLeagueButton = document.querySelector("#createNewLeagueButton");
const newLeagueForm = document.querySelector(".newLeagueForm");

// open the new league creator after clicking the "Create New League" button
createNewLeagueButton.addEventListener("click", () => {
  newLeagueForm.classList.toggle("d-none");
});

const array = [122345, 634221, 473890, 330981 ];

