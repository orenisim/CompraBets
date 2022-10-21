import fetch from "node-fetch";

// getting the World Cup 2022 matches
const base = "https://api.football-data.org/v4/competitions/WC/matches";
const getCompet = async () => {
  const response = await fetch(base, {
    headers: {
      "X-Auth-Token": "4a7cd31681e04ac4ae31805f397eae26",
    },
  });
  const data = await response.json();
  return data;
};

getCompet()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

/*PLAN B= Run using outside server.

fetch(
  `https://api.allorigins.win/get?url=${encodeURIComponent(
    "http://api.football-data.org/v4/competitions/"
  )}`
)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error("Network response was not ok.");
  })
  .then((data) => console.log(data.contents));
  
  */
