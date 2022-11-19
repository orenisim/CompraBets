import { auth, getArrayOfUsersByLeagueName, getUserObjectFromUserName } from "../Firebase/usersFirebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

const userNameHref = document.querySelector(".userNameHref");
// Get user that already log in
onAuthStateChanged(auth, user => {
  getUserObjectFromUserName(user.displayName)
    .then(userObject => {
      userNameHref.textContent = userObject.displayName;
      printTable(userObject);

    });
});

//My League
export const updateMyLeague = leagueObject => {
  const leageNameSpan = document.querySelector('#leageNameSpan');
  leageNameSpan.textContent = leagueObject.name;
  const numOfPlayersSpan = document.querySelector('#numOfPlayersSpan');
  numOfPlayersSpan.textContent = leagueObject.numOfPlayers;
}

const printTable = async (userObject) => {
  const currentUserLeague = userObject.league;
  const arrayOfUsers = await getArrayOfUsersByLeagueName(currentUserLeague);
  arraySort(arrayOfUsers);
  createTable(arrayOfUsers);
}

const arraySort = (arrayOfUsers) => {
  arrayOfUsers = arrayOfUsers.sort((a, b) => (a.score < b.score) ? 1 : -1 );
} 

const createTable = (arrayOfUsers) => {
  const leagueTableElement = document.querySelector('.leagueTable');
  for (let i = 0; i < arrayOfUsers.length; i++) {
      leagueTableElement.innerHTML += `
      <tr class="table-light">
      <td>#${i + 1}</td>
      <td>${arrayOfUsers[i].displayName}</td>
      <td>${arrayOfUsers[i].score}</td>
      <td>${arrayOfUsers[i].winner}</td>
      <td>${arrayOfUsers[i].superScore}</td>
    </tr>
      `
  }
}


//End of My League