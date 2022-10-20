import { auth, createUser, EmailVerification, } from "./usersFirebase.js";

const signInForm = document.querySelector('.registerForm');
const firstNameElement = signInForm.registerFirstName;
const lastNameElement = signInForm.registerLastName;
const userNameElement = signInForm.registerUserName;
const emailElement = signInForm.registerEmail;
const passElement = signInForm.registerPassword;

const addClassIsInVaild = element => {
    element.classList.remove('is-valid');
    element.classList.add('is-invalid');
}

const addClassIsVaild = element => {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
}

//First Name Check  + event listener
const firstNameCheck = () => {
    if (firstNameElement.value.length < 2 || /[0-9]/.test(firstNameElement.value)) {
        addClassIsInVaild(firstNameElement);
        return false;
    }
    else {
        addClassIsVaild(firstNameElement);
        return true;
    }
}
firstNameElement.addEventListener('keydown', firstNameCheck);

//Last Name Check + event listener
const lastNameCheck = () => {
    if (lastNameElement.value.length < 2 || /[0-9]/.test(lastNameElement.value)) {
        addClassIsInVaild(lastNameElement);
        return false;
    }
    else {
        addClassIsVaild(lastNameElement);
        return true;
    }
}
lastNameElement.addEventListener('keydown', lastNameCheck);


//User Name Check + event listener
const userNameCheck = () => {
    if (userNameElement.value.length < 3) {
        addClassIsInVaild(userNameElement);
        return false;
    }
    else {
        addClassIsVaild(userNameElement);
        return true;
    }
}
userNameElement.addEventListener('keydown', userNameCheck);

//Email Check + event listener
const emailCheck = () => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(emailElement.value)) {
        addClassIsInVaild(emailElement);
        return false;
    }
    else {
        addClassIsVaild(emailElement);
        return true;
    }
}
emailElement.addEventListener('keydown', emailCheck);


//Password Check + event listener
const passCheck = () => {
    if (passElement.value.length < 6) {
        addClassIsInVaild(passElement);
        return false;
    }
    else {
        addClassIsVaild(passElement);
        return true;
    }
}
passElement.addEventListener('keydown', passCheck);

//Form event listener
signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const errmsg = document.querySelector('.errmsg');
    if (firstNameCheck() && lastNameCheck() && userNameCheck() && emailCheck() && passCheck()) {
        createUser(firstNameElement.value, lastNameElement.value, userNameElement.value,
            emailElement.value, passElement.value)
            .then(() => {
                errmsg.textContent = '';
                signInForm.reset();
                //Send Email Verification
                EmailVerification(auth);

                //just fot test!! 
                alert('Done!');

                window.location = "./joinLeague.html";
            })
            .catch(err => {
                errmsg.textContent = `* ${err.message} *`;
            });
    }
})



