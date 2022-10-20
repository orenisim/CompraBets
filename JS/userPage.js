import { auth, logOutUser, EmailVerification, PassReset } from "./usersFireBase.js";
import { onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';


//change the deafult user name + get object
const userNameHref = document.querySelector('.userNameHref');
const userNameP = document.querySelector('.userNameP');
const userEmailP = document.querySelector('.userEmailP');
// Get user that already log in
onAuthStateChanged(auth, (user) => {
  userNameHref.textContent = user.displayName;
  userNameP.textContent = user.displayName;
  userEmailP.textContent = user.email;
});

//log out from user
const logOutButton = document.querySelector('.logOutButton');
logOutButton.addEventListener('click', () => {
  logOutUser().then(() => {
    alert("log out");
    window.location = "./index.html";
  })
});

//Send Email Verification
const emailVerButton = document.querySelector('.emailVerButton');
emailVerButton.addEventListener('click', () => {
  EmailVerification(auth)
    .then(() => emailVerButton.setAttribute('value', 'Done!'))
    .catch(err => console.log(err));
});

//Send Email Password Reset
const passResetButton = document.querySelector('.passResetButton');
passResetButton.addEventListener('click', () => {
  PassReset(auth, auth.currentUser.email)
    .then(() => passResetButton.setAttribute('value', 'Email Sent!'))
    .catch(err => console.log(err));
});