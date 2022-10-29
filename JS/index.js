import { auth, logInUser, PassReset, getUserObjectFromUserName } from "./Firebase/usersFirebase.js";

const logInForm = document.querySelector(".logInForm");
const userNameElement = logInForm.logInUserName;
const passElement = logInForm.logInPassword;

const errmsg = document.querySelector('.errmsg');

//log in form
logInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  logInUser(userNameElement.value, passElement.value)
    .then((userObject) => {
      logInForm.classList.add("was-validated");
      errmsg.textContent = '';

      //just fot test!! 
      alert('Log in');

      logInForm.reset();

      if (userObject.league) window.location = "./mainPage.html";
      else window.location = "./joinLeague.html";
    })
    .catch(err => {
      if (err.message == 'Firebase: Error (auth/wrong-password).') {
        errmsg.textContent = `* Wrong Password *`;
      } else {
        errmsg.textContent = `* ${err.message} *`;
      }
    })
});

//Send Email Password reset
const passResetButton = document.querySelector('.passResetButton');
passResetButton.addEventListener('click', async () => {
  if (!userNameElement.value.length) return;
  const user = await getUserObjectFromUserName(userNameElement.value);
  const email = user.email;
  PassReset(auth, email)
    .then(() => passResetButton.setAttribute('value', 'Email Sent!'))
    .catch(err => console.log(err));
});