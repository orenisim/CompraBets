
//My League

export const updateMyLeague = leagueObject => {
  const leageNameSpan = document.querySelector('#leageNameSpan');
  leageNameSpan.textContent = leagueObject.name;
  const numOfPlayersSpan = document.querySelector('#numOfPlayersSpan');
  numOfPlayersSpan.textContent = leagueObject.numOfPlayers;
}


//End of My League