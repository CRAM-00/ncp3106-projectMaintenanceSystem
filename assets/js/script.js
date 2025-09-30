const correctUsername = {
  '20230131723': '11/22/2004',
  '20230137390': '03/26/2005',
  '20230114053' : '12/06/2004'
}

function login() {
  const enteredUsername = document.getElementById("email").value.trim();
  const enteredPassword = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");
  const loginButton = document.getElementById("loginButton");

  errorMessage.textContent = "";

  // Show loading state
  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  setTimeout(() => {
    if (correctUsername[enteredUsername] && correctUsername[enteredUsername] === enteredPassword) {
      window.location.href = "secondpage.html";
    } else {
      errorMessage.textContent = "Incorrect email or password!";
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  }, 2000);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    login();
  }
});

const toggle = document.getElementById("darkModeToggle");
const slider = document.getElementById("slider");
const sliderCircle = document.getElementById("sliderCircle");

toggle.addEventListener("change", function () {
document.body.classList.toggle("dark-mode", this.checked);
document.body.classList.toggle("light-mode", !this.checked);

  if (this.checked) {
      slider.classList.replace("bg-yellow-400", "bg-gray-800");
      sliderCircle.style.transform = "translateX(26px)";
      sliderCircle.textContent = "🌙";
  } else {
      slider.classList.replace("bg-gray-800", "bg-yellow-400");
      sliderCircle.style.transform = "translateX(0)";
      sliderCircle.textContent = "☀️";
  }
});

const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const loginForm = document.getElementById('login');
const signUpForm = document.getElementById('signup');
const registerButton = document.getElementById('registerButton');

// Show Register
signUpButton.addEventListener('click', function () {
  loginForm.style.display = "none";
  signUpForm.style.display = "flex";
});

// Back to Login
signInButton.addEventListener('click', function () {
  signUpForm.style.display = "none";
  loginForm.style.display = "flex";
});



function register(event) {
  event.preventDefault();

  const enteredUsername = document.getElementById("regEmail").value.trim();
  const enteredPassword = document.getElementById("regPassword").value.trim();
  const userType = document.getElementById("userType").value.trim();
  const firstName = document.getElementById("fName").value.trim();
  const lastName = document.getElementById("lName").value.trim();

  if (!firstName || !lastName || !enteredUsername || !enteredPassword || userType === "") {
      alert("Please fill all fields and select a role.");
    return;
  }

  registerButton.disabled = true;
  registerButton.textContent = "Registering...";

  setTimeout(() => {
    registerButton.disabled = false;
    registerButton.textContent = "Register";

    localStorage.setItem(enteredUsername, JSON.stringify({
      firstName,
      lastName,
      password: enteredPassword,
      role: userType
    }));

    alert("Registration successful! Please login.");

    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
    document.getElementById("userType").value = "";
    document.getElementById("fName").value = "";
    document.getElementById("lName").value = "";

    signUpForm.style.display = "none";
    loginForm.style.display = "flex";
  }, 2000);
}



