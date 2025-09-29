const correctUsername = {
  '20230131723': '11/22/2004',
  '20230137390': '03/26/2005',
  '20230114053' : '12/06/2004'
}

function login() {
  const enteredUsername = document.getElementById("username").value.trim();
  const enteredPassword = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");
  const loginButton = document.getElementById("loginButton");

  errorMessage.textContent = "";

  // Show loading state
  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  setTimeout(() => {
    // check if username exists and password matches
    if (correctUsername[enteredUsername] && correctUsername[enteredUsername] === enteredPassword) {
      window.location.href = "secondpage.html";
    } else {
      errorMessage.textContent = "Incorrect username or password!";
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


