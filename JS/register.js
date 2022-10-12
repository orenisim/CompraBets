const signInForm = document.querySelector('.registerForm');
const firstNameElement = signInForm.registerFirstName;
const lastNameElement = signInForm.registerLastName;
const userNameElement = signInForm.registerUserName;
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
    if (lastNameElement.value.length < 2 || /[0-9]/.test(lastNameElement.value)){
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
    if (userNameElement.value.length < 3){
        addClassIsInVaild(userNameElement);
        return false;
    }
    else {
        addClassIsVaild(userNameElement);
        return true;
    } 
}
userNameElement.addEventListener('keydown', userNameCheck);

//Password Check + event listener
const passCheck = () => {
    if (passElement.value.length < 4){
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
    if(firstNameCheck() && lastNameCheck() && userNameCheck() && passCheck()) {
        signInForm.reset();
        alert("Done!")
    } 
})
