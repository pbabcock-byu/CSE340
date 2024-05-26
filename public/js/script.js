let passwordInput = document.getElementById('account_password'),
    toggle = document.getElementById('btnToggle'),
    icon =  document.getElementById('showpassword');
 
function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.add("showpasswordh");
    //toggle.innerHTML = 'hide';
  } else {
    passwordInput.type = 'password';
    icon.classList.remove("showpassword");
    //toggle.innerHTML = 'show';
  }
}
 
function checkInput() {
  //if (passwordInput.value === '') {
  //toggle.style.display = 'none';
  //toggle.innerHTML = 'show';
  //  passwordInput.type = 'password';
  //} else {
  //  toggle.style.display = 'block';
  //}
}
 
toggle.addEventListener('click', togglePassword, false);
passwordInput.addEventListener('keyup', checkInput, false);