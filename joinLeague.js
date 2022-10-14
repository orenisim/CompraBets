const addButton = document.querySelector("#addLeagueButton");
const addLeagueForm = document.querySelector("#createLeageForm");
const closeButton = document.querySelector("#closeAddLeagueForm");

// open the new league creator after clicking the plus button
addButton.addEventListener("click", () => {
  addLeagueForm.classList.remove("d-none");
});

// close the new league creator after clicking the exit button
closeButton.addEventListener("click", () => {
  addLeagueForm.classList.add("d-none");
});
