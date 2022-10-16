const createNewLeagueButton = document.querySelector("#createNewLeagueButton");
const newLeagueForm = document.querySelector(".newLeagueForm");
let clickForm = 0;

// open the new league creator after clicking the "Create New League" button
createNewLeagueButton.addEventListener("click", () => {
  clickForm++;
  if (clickForm % 2) {
    newLeagueForm.classList.remove("d-none");
  } else {
    newLeagueForm.classList.add("d-none");
  }
});
