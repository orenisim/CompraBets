const logInForm = document.querySelector('.logInForm');

logInForm.addEventListener('submit', e => {
    e.preventDefault();
    logInForm.classList.add('was-validated');
    logInForm.reset();
})