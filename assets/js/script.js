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


// Admin Dashboard


    // SAMPLE DATA
    const requests = [
      { id: 1, title: "Electrical Issue - Room 105", reporter: "John Doe", date: "10/07/2025", status: "Pending", comment: "" },
      { id: 2, title: "Plumbing Issue - CR 2nd Floor", reporter: "Maria Cruz", date: "10/06/2025", status: "In Progress", comment: "" },
    ];

    const announcements = [
      { id: 1, title: "Scheduled Maintenance: Engineering Building", desc: "AC maintenance on floors 3–5 this weekend." },
      { id: 2, title: "Elevator Repair Completed", desc: "The main building elevator is now operational." },
    ];

    function updateDashboard() {
      document.getElementById("totalRequests").textContent = requests.length;
      document.getElementById("pendingCount").textContent = requests.filter(r => r.status === "Pending").length;
      document.getElementById("inProgressCount").textContent = requests.filter(r => r.status === "In Progress").length;
      document.getElementById("completedCount").textContent = requests.filter(r => r.status === "Completed").length;
    }

    function renderRequests() {
      const list = document.getElementById("requestsList");
      list.innerHTML = "";
      requests.forEach(r => {
        const li = document.createElement("li");
        li.className = "border-l-4 bg-white/10 p-3 rounded";
        li.innerHTML = `
          <p class="font-semibold">${r.title}</p>
          <p class="text-sm text-gray-200">Reported by: ${r.reporter} | ${r.date}</p>
          <div class="flex items-center mt-2 gap-2">
            <select onchange="changeStatus(${r.id}, this.value)" class="text-black px-2 py-1 rounded">
              <option ${r.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${r.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${r.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </div>
          <textarea id="comment-${r.id}" placeholder="Write a response..." class="w-full mt-2 p-2 text-black rounded" rows="2">${r.comment}</textarea>
          <button onclick="saveComment(${r.id})" class="mt-2 bg-white text-[#E43636] px-3 py-1 rounded font-semibold hover:bg-gray-200">Send Response</button>
        `;
        list.appendChild(li);
      });
      updateDashboard();
    }

    function changeStatus(id, newStatus) {
      const req = requests.find(r => r.id === id);
      if (req) req.status = newStatus;
      updateDashboard();
    }

    function saveComment(id) {
      const req = requests.find(r => r.id === id);
      const textarea = document.getElementById(`comment-${id}`);
      if (req && textarea) {
        req.comment = textarea.value.trim();
        alert(`Response saved for "${req.title}"`);
      }
    }

    function renderAnnouncements() {
      const list = document.getElementById("announcementList");
      list.innerHTML = "";
      announcements.forEach(a => {
        const div = document.createElement("div");
        div.className = "p-3 border-l-4 border-yellow-300 bg-white/10 rounded flex justify-between items-start";
        div.innerHTML = `
          <div>
            <p class="font-semibold">${a.title}</p>
            <p class="text-sm text-gray-200">${a.desc}</p>
          </div>
          <button onclick="deleteAnnouncement(${a.id})" class="bg-white text-[#E43636] px-2 py-1 rounded hover:bg-gray-200">✕</button>
        `;
        list.appendChild(div);
      });
    }

    function toggleAnnouncementForm() {
      const form = document.getElementById("announcementForm");
      form.classList.toggle("hidden");
    }

    function addAnnouncement() {
      const title = document.getElementById("announceTitle").value.trim();
      const desc = document.getElementById("announceDesc").value.trim();

      if (!title || !desc) {
        alert("Please fill out both fields.");
        return;
      }

      announcements.push({ id: Date.now(), title, desc });
      document.getElementById("announceTitle").value = "";
      document.getElementById("announceDesc").value = "";
      toggleAnnouncementForm();
      renderAnnouncements();
    }

    function deleteAnnouncement(id) {
      const index = announcements.findIndex(a => a.id === id);
      if (index !== -1) announcements.splice(index, 1);
      renderAnnouncements();
    }

    // INITIAL LOAD
    renderRequests();
    renderAnnouncements();
    updateDashboard();

   // Navbar mobile toggle
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");

    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");

      // Toggle between hamburger and X icon
      if (mobileMenu.classList.contains("hidden")) {
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16" />`;
      } else {
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M6 18L18 6M6 6l12 12" />`;
      }
    });


    // Report Form Submit
    document.getElementById('reportForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Your report has been submitted successfully!');
      e.target.reset();
    });