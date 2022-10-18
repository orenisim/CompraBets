import { logInUser } from "./usersFireBase.js";

const logInForm = document.querySelector(".logInForm");
const userNameElement = logInForm.logInUserName;
const passElement = logInForm.logInPassword;

const errmsg = document.querySelector('.errmsg');

//log in form
logInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  logInUser(userNameElement.value, passElement.value)
    .then(() => {
      logInForm.classList.add("was-validated");
      errmsg.textContent = '';

      //just fot test!! 
      alert('Log in');
  
      logInForm.reset();
      window.location = "./joinLeague.html";
    })
    .catch(err => {
      if (err.message == 'Firebase: Error (auth/wrong-password).') {
        errmsg.textContent = `* Wrong Password *`;
      } else {
        errmsg.textContent = `* ${err.message} *`;
      }
    })
});
