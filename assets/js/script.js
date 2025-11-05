document.addEventListener("DOMContentLoaded", () => {
  const body = document.body
  const navbarContainer = document.getElementById("navbar-container")
  const footerContainer = document.getElementById("footer-container")
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  // LOGIN / SIGNUP FORM TOGGLE
  window.showSignup = () => {
    loginForm?.classList.remove("active")
    setTimeout(() => signupForm?.classList.add("active"), 200)
  }

  window.showLogin = () => {
    signupForm?.classList.remove("active")
    setTimeout(() => loginForm?.classList.add("active"), 200)
  }

  // LOGIN HANDLER
  window.handleLogin = () => {
    const email = document.getElementById("loginEmail")
    const password = document.getElementById("loginPassword")
    const loginButton = loginForm?.querySelector("button")
    const Swal = window.Swal

    if (!email?.checkValidity() || !password?.checkValidity()) {
      email?.reportValidity()
      password?.reportValidity()
      return
    }

    if (loginButton) {
      loginButton.disabled = true
      loginButton.textContent = "Logging in..."
    }

    fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        loginEmail: email.value,
        loginPassword: password.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
  const userName =
    data.name && data.name.trim() !== ""
      ? data.name
      : data.first_name && data.last_name
      ? `${data.first_name} ${data.last_name}`
      : "Unknown";

  const userEmail = email.value.trim().toLowerCase();

  const savedPicKey = `profilePic_${userEmail}`;
  const savedPic = localStorage.getItem(savedPicKey);

  // ✅ Store user info
  localStorage.setItem("currentUserName", userName);
  localStorage.setItem("currentUserEmail", userEmail);
  localStorage.setItem("currentUserRole", data.role || "");
  localStorage.setItem("sessionToken", data.session_token);

  // ✅ Start a new 1-hour session when user logs in
  const sessionDuration = 3 * 60 * 1000; 
  const expiry = Date.now() + sessionDuration;
  localStorage.setItem("sessionExpiry", expiry.toString());

  // ✅ Save or load profile picture
  if (data.profile_pic) {
    localStorage.setItem("currentUserProfilePic", data.profile_pic);
    const picKey = `profilePic_${userEmail}`;
    localStorage.setItem(picKey, data.profile_pic);
  } else {
    localStorage.setItem("currentUserProfilePic", "assets/images/unknown.jpg");
  }

  // ✅ Apply dark mode from database on login
  const darkModeKeyDashboard = `darkMode_dashboard_${userEmail}`;
  const darkModeKeyAdmin = `darkMode_admin_${userEmail}`;
  const isDarkFromDB = data.dark_mode === "1";

  // Save to localStorage so navbar toggles read it
  localStorage.setItem(darkModeKeyDashboard, isDarkFromDB);
  localStorage.setItem(darkModeKeyAdmin, isDarkFromDB);

  // Apply dark/light mode immediately
  if (isDarkFromDB) {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  }

  // Update navbar switches (desktop + mobile)
  setTimeout(() => {
    const darkDesktop =
      document.getElementById("darkModeToggleDashboard") ||
      document.getElementById("darkModeToggleAdmin");
    const darkMobile = document.getElementById("darkModeToggleMobile");
    if (darkDesktop) darkDesktop.checked = isDarkFromDB;
    if (darkMobile) darkMobile.checked = isDarkFromDB;
  }, 300);

  // ✅ Success alert + redirect based on role
  Swal.fire({
    title: "Login Successful!",
    text: `Welcome back, ${userName}!`,
    icon: "success",
    confirmButtonText: "Continue",
    confirmButtonColor: "#E43636",
  }).then(() => {
    const role = (data.role || "").toLowerCase();

    if (role === "maintenance personnel") {
      window.location.href = "admin.php";
    } else if (role === "complainant") {
      window.location.href = "dashboard.php";
    } else {
      window.location.href = "index.php";
    }
          })
        } else {
          Swal.fire({
            title: "Login Failed",
            text: data.message || "Invalid email or password.",
            icon: "error",
            confirmButtonColor: "#E43636",
          })
        }
      })
      .catch((err) => {
        console.error("Login error:", err)
        Swal.fire({
          title: "Error",
          text: "Unable to connect to the server.",
          icon: "error",
          confirmButtonColor: "#E43636",
        })
      })
      .finally(() => {
        if (loginButton) {
          loginButton.disabled = false
          loginButton.textContent = "Login"
        }
      })
  }

  // SIGNUP HANDLER
  window.handleSignup = () => {
    const role = document.getElementById("signupRole")
    const first = document.getElementById("firstName")
    const last = document.getElementById("lastName")
    const email = document.getElementById("signupEmail")
    const password = document.getElementById("signupPassword")
    const registerButton = signupForm?.querySelector("button")
    const Swal = window.Swal

    if (
      !role?.checkValidity() ||
      !first?.checkValidity() ||
      !last?.checkValidity() ||
      !email?.checkValidity() ||
      !password?.checkValidity()
    ) {
      role?.reportValidity()
      first?.reportValidity()
      last?.reportValidity()
      email?.reportValidity()
      password?.reportValidity()
      return
    }

    if (registerButton) {
      registerButton.disabled = true
      registerButton.textContent = "Registering..."
    }

    fetch("signup.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        signupRole: role.value,
        firstName: first.value,
        lastName: last.value,
        signupEmail: email.value,
        signupPassword: password.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const fullName = `${data.first_name} ${data.last_name}`
          localStorage.setItem("currentUserName", fullName)
          localStorage.setItem("currentUserRole", data.role)

          Swal.fire({
            title: "Account Created!",
            text: `${fullName}, Welcome to UE Maintenance Services!`,
            icon: "success",
            confirmButtonText: "Cool!",
            confirmButtonColor: "#E43636",
          }).then(() => {
            window.showLogin()
            if (role) role.value = ""
            if (first) first.value = ""
            if (last) last.value = ""
            if (email) email.value = ""
            if (password) password.value = ""
          })
        } else {
          Swal.fire({
            title: "Signup Failed",
            text: data.message || "Something went wrong.",
            icon: "error",
            confirmButtonColor: "#E43636",
          })
        }
      })
      .catch((err) => {
        console.error("Signup error:", err)
        Swal.fire({
          title: "Error",
          text: "Unable to connect to the server.",
          icon: "error",
          confirmButtonColor: "#E43636",
        })
      })
      .finally(() => {
        if (registerButton) {
          registerButton.disabled = false
          registerButton.textContent = "Register"
        }
      })
  }

  // NAVBAR
  if (navbarContainer) {
    fetch("includes/navbar.php")
      .then((res) => res.text())
      .then((data) => {
        navbarContainer.innerHTML = data

        const page = body.dataset.page
        const dashboardNav = document.getElementById("dashboard-nav")
        const adminNav = document.getElementById("admin-nav")

        if (page === "dashboard") {
          dashboardNav?.classList.remove("hidden")
          adminNav?.classList.add("hidden")
          setupDarkMode("dashboard")
          setupMobileMenu()
          setupDashboardLogout()
          setupDashboardProfile()
          setTimeout(() => {
            const userName = localStorage.getItem("currentUserName") || "User Name"
            const userPic = localStorage.getItem("currentUserProfilePic") || "assets/images/unknown.jpg"
            const mobileName = document.getElementById("mobileUserName")
            const desktopName = document.getElementById("dashboardUserName")
            const mobilePic = document.getElementById("mobileProfilePic")
            const desktopPic = document.getElementById("dashboardProfilePic")

            if (mobileName) mobileName.textContent = userName
            if (desktopName) desktopName.textContent = userName
            if (mobilePic) mobilePic.src = userPic
            if (desktopPic) desktopPic.src = userPic
          }, 300)
        } else if (page === "admin") {
          adminNav?.classList.remove("hidden")
          dashboardNav?.classList.add("hidden")
          setupDarkMode("admin")
          setupNotifications()
          setupAdminLogout()
        }
      })
      .catch((err) => console.error("Error loading navbar:", err))
  }

  // DASHBOARD LOGOUT 
function setupDashboardLogout() {
  setInterval(async () => {
  const email = localStorage.getItem("currentUserEmail");
  const token = localStorage.getItem("sessionToken");

  if (!email || !token) return;

  const res = await fetch("verify_session.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, token }),
  });

  const data = await res.json();

  if (data.status === "invalid") {
    Swal.fire({
      title: "Logged Out",
      text: "Your account was logged in from another device.",
      icon: "info",
      confirmButtonColor: "#E43636",
    }).then(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("index.php");
    });
  }
}, 5000); 


  if (document.body.dataset.page === "dashboard") {
    const expiry = Number(localStorage.getItem("sessionExpiry") || "0");
    const now = Date.now();

    if (!expiry || now > expiry) {
      const preservedPics = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("profilePic_")) {
          preservedPics[key] = localStorage.getItem(key);
        }
      });

      localStorage.clear();
      Object.entries(preservedPics).forEach(([k, v]) => localStorage.setItem(k, v));

      // Prevent back navigation
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });

      // Redirect instantly to login
      window.location.replace("index.php");
      return; // Stop any further execution
    }
  }

  const logoutBtns = document.querySelectorAll("#dashboardlogoutBtn, #mobileLogoutBtn");
  if (!logoutBtns.length) return;

  logoutBtns.forEach((logoutBtn) => {
    logoutBtn.addEventListener("click", async () => {
      const Swal = window.Swal || {
        fire: (opts) => {
          alert(opts?.title || "Alert");
          return Promise.resolve({ isConfirmed: true });
        },
      };

      const result = await Swal.fire({
        title: "Log Out?",
        text: "Are you sure you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Log Out",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#E43636",
      });

      if (result.isConfirmed) performLogout(false);
    });
  });

  if (document.body.dataset.page === "dashboard") {
    const sessionDuration = 3 * 60 * 1000; 
    let sessionTimer;
    let logoutInProgress = false;

    function resetSessionTimer() {
      if (logoutInProgress) return; 
      clearTimeout(sessionTimer);
      const expiry = Date.now() + sessionDuration;
      localStorage.setItem("sessionExpiry", expiry.toString());
      sessionTimer = setTimeout(() => performLogout(true), sessionDuration);
    }

   
    function performLogout(isExpired) {
      if (logoutInProgress) return; 
      logoutInProgress = true;

      // Preserve profile pictures
      const preservedPics = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("profilePic_")) {
          preservedPics[key] = localStorage.getItem(key);
        }
      });

      // Clear session data
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserRole");
      localStorage.removeItem("currentUserEmail");
      localStorage.removeItem("currentUserProfilePic");
      localStorage.removeItem("sessionExpiry");
      sessionStorage.clear();

      // Restore profile pics
      Object.entries(preservedPics).forEach(([k, v]) => localStorage.setItem(k, v));

      // Disable back navigation
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });

      fetch("logout.php").catch(() => {});

      const Swal = window.Swal;
      Swal.fire({
        title: isExpired ? "Session Expired" : "Logged Out",
        text: isExpired
          ? "You were inactive for too long. Please log in again."
          : "You have been successfully logged out.",
        icon: isExpired ? "info" : "success",
        confirmButtonColor: "#E43636",
      }).then(() => {
        window.location.replace("index.php");
      });
    }

    // Reset timer on user activity
    ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((event) =>
      window.addEventListener(event, resetSessionTimer)
    );

    // Tab inactive/AFK detection
    document.addEventListener("visibilitychange", () => {
      if (logoutInProgress) return;
      if (document.hidden) {
        localStorage.setItem("lastInactive", Date.now().toString());
      } else {
        const lastInactive = Number(localStorage.getItem("lastInactive") || "0");
        if (Date.now() - lastInactive > sessionDuration) performLogout(true);
        else resetSessionTimer();
      }
    });

    resetSessionTimer();
  }
}


  // ADMIN LOGOUT
function setupAdminLogout() {
  setInterval(async () => {
  const email = localStorage.getItem("currentUserEmail");
  const token = localStorage.getItem("sessionToken");

  if (!email || !token) return;

  const res = await fetch("verify_session.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, token }),
  });

  const data = await res.json();

  if (data.status === "invalid") {
    Swal.fire({
      title: "Logged Out",
      text: "Your account was logged in from another device.",
      icon: "info",
      confirmButtonColor: "#E43636",
    }).then(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("index.php");
    });
  }
}, 5000); 

  if (document.body.dataset.page === "admin") {
    const userRole = localStorage.getItem("currentUserRole");
    const expiry = Number(localStorage.getItem("sessionExpiry") || "0");
    const now = Date.now();

    if (userRole !== "maintenance personnel" || (expiry && now > expiry)) {
      // Preserve profile pictures
      const preservedPics = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("profilePic_")) {
          preservedPics[key] = localStorage.getItem(key);
        }
      });

      // Clear sensitive data
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserRole");
      localStorage.removeItem("currentUserEmail");
      localStorage.removeItem("currentUserProfilePic");
      localStorage.removeItem("sessionExpiry");
      sessionStorage.clear();

      Object.entries(preservedPics).forEach(([k, v]) => localStorage.setItem(k, v));

      // Prevent back navigation
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });

      // Redirect instantly
      window.location.replace("index.php");
      return; 
    }
  }

  const logoutBtn = document.getElementById("adminlogoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    const Swal = window.Swal || {
      fire: (opts) => {
        alert(opts?.title || "Alert");
        return Promise.resolve({ isConfirmed: true });
      },
    };

    const result = await Swal.fire({
      title: "Log Out?",
      text: "Are you sure you want to log out from the admin panel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#E43636",
    });

    if (result.isConfirmed) {
      // Preserve profile pics
      const preservedPics = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("profilePic_")) {
          preservedPics[key] = localStorage.getItem(key);
        }
      });

      // Clear data
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserRole");
      localStorage.removeItem("currentUserEmail");
      localStorage.removeItem("currentUserProfilePic");
      localStorage.removeItem("sessionExpiry");
      sessionStorage.clear();

      Object.entries(preservedPics).forEach(([k, v]) => localStorage.setItem(k, v));

      // Block back navigation
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });

      await fetch("logout.php").catch(() => {});

      Swal.fire({
        title: "Logged Out",
        text: "You have been successfully logged out.",
        icon: "success",
        confirmButtonColor: "#E43636",
      }).then(() => {
        window.location.replace("index.php");
      });
    }
  });


  if (document.body.dataset.page === "admin") {
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
  }
}

  // DARK MODE
function setupDarkMode(pageType) {
  const currentUserEmail = localStorage.getItem("currentUserEmail") || "guest";
  const darkKey = `darkMode_${pageType}_${currentUserEmail}`;

  let darkToggleDesktop, sliderCircleDesktop, darkToggleMobile, sliderCircleMobile;

  if (pageType === "dashboard") {
    darkToggleDesktop = document.getElementById("darkModeToggleDashboard");
    sliderCircleDesktop = document.getElementById("sliderCircleDashboard");
    darkToggleMobile = document.getElementById("darkModeToggleMobile");
    sliderCircleMobile = document.getElementById("sliderCircleMobile");
  } else if (pageType === "admin") {
    darkToggleDesktop = document.getElementById("darkModeToggleAdmin");
    sliderCircleDesktop = document.getElementById("sliderCircleAdmin");
  }

  function setDarkMode(isDark) {
    const body = document.body;
    if (isDark) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
      if (sliderCircleDesktop) {
        sliderCircleDesktop.textContent = "🌙";
        sliderCircleDesktop.classList.add("translate-x-6");
      }
      if (sliderCircleMobile) {
        sliderCircleMobile.textContent = "🌙";
        sliderCircleMobile.classList.add("translate-x-6");
      }
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
      if (sliderCircleDesktop) {
        sliderCircleDesktop.textContent = "☀️";
        sliderCircleDesktop.classList.remove("translate-x-6");
      }
      if (sliderCircleMobile) {
        sliderCircleMobile.textContent = "☀️";
        sliderCircleMobile.classList.remove("translate-x-6");
      }
    }
  }

  const savedDark = localStorage.getItem(darkKey) === "true";
  setDarkMode(savedDark);
  if (darkToggleDesktop) darkToggleDesktop.checked = savedDark;
  if (darkToggleMobile) darkToggleMobile.checked = savedDark;

  if (darkToggleDesktop) {
    darkToggleDesktop.addEventListener("change", (e) => {
      const isDark = e.target.checked;
      setDarkMode(isDark);
      localStorage.setItem(darkKey, isDark);
      if (darkToggleMobile) darkToggleMobile.checked = isDark;

      const email = localStorage.getItem("currentUserEmail");
      if (email) {
        fetch("update_preferences.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: email,
            dark_mode: isDark ? "1" : "0",
          }),
        }).then(() => console.log("✅ Dark mode saved to DB"));
      }
    });
  }

  if (darkToggleMobile) {
    darkToggleMobile.addEventListener("change", (e) => {
      const isDark = e.target.checked;
      setDarkMode(isDark);
      localStorage.setItem(darkKey, isDark);
      if (darkToggleDesktop) darkToggleDesktop.checked = isDark;

      const email = localStorage.getItem("currentUserEmail");
      if (email) {
        fetch("update_preferences.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: email,
            dark_mode: isDark ? "1" : "0",
          }),
        }).then(() => console.log("✅ Dark mode saved to DB"));
      }
    });
  }
}


  // MOBILE MENU
  function setupMobileMenu() {
    const menuBtn = document.getElementById("menu-btn")
    const mobileMenu = document.getElementById("mobile-menu")
    if (!menuBtn || !mobileMenu) return

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (mobileMenu.classList.contains("show")) {
        closeMenu()
      } else {
        openMenu()
      }
    })

    document.addEventListener("click", (e) => {
      if (mobileMenu.classList.contains("show") && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
        closeMenu()
      }
    })

    function openMenu() {
      mobileMenu.classList.add("show")
      const height = mobileMenu.scrollHeight + "px"
      mobileMenu.style.height = "0"
      requestAnimationFrame(() => {
        mobileMenu.style.height = height
      })
      mobileMenu.addEventListener(
        "transitionend",
        () => {
          mobileMenu.style.height = ""
        },
        { once: true },
      )
    }

    function closeMenu() {
      const height = mobileMenu.scrollHeight
      mobileMenu.style.height = height + "px"
      requestAnimationFrame(() => {
        mobileMenu.style.height = "0"
      })
      mobileMenu.addEventListener(
        "transitionend",
        () => {
          mobileMenu.classList.remove("show")
          mobileMenu.style.height = ""
        },
        { once: true },
      )
    }
  }

  // NOTIFICATIONS
  function setupNotifications() {
    const notifBtn = document.getElementById("notif-btn")
    const notifDropdown = document.getElementById("notif-dropdown")
    const notifCount = document.getElementById("notif-count")
    const notifList = document.getElementById("notif-list")
    const Swal = window.Swal
    if (!notifBtn || !notifDropdown || !notifList) return

    notifBtn.addEventListener("click", (event) => {
      event.stopPropagation()
      const isShown = notifDropdown.classList.contains("show")

      if (isShown) {
        notifDropdown.classList.remove("show")
        setTimeout(() => notifDropdown.classList.add("hidden"), 250)
      } else {
        notifDropdown.classList.remove("hidden")
        requestAnimationFrame(() => notifDropdown.classList.add("show"))
      }
    })

    notifDropdown.addEventListener("click", (e) => e.stopPropagation())
    document.addEventListener("click", () => {
      if (notifDropdown.classList.contains("show")) {
        notifDropdown.classList.remove("show")
        notifDropdown.classList.add("hidden")
      }
    })

    async function loadNotifications() {
  try {
    const response = await fetch("fetch_reports.php?time=" + new Date().getTime());
    const reports = await response.json();


    const activeReports = reports.filter((r) => r.status !== "Completed");

    notifCount.textContent = activeReports.length;
    notifCount.classList.toggle("hidden", activeReports.length === 0);
    notifList.innerHTML = "";

    activeReports.slice().reverse().forEach((r) => {
      const li = document.createElement("li");
      li.id = `notif-${r.id}`;
      li.className =
        "p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ease-in-out w-full select-none";

      let roomHTML = "";
      let floorHTML = "";
      if (r.facility_type === "Room") {
        roomHTML = `<p class="text-sm">Room No.: ${r.room || "N/A"}</p>`;
      } else if (["CR", "Elevator", "Library", "Escalator"].includes(r.facility_type)) {
        floorHTML = `<p class="text-sm">Floor: ${r.floor || "N/A"}</p>`;
      }

      const statusColor =
        r.status === "Pending"
          ? "bg-[#EAB308] text-white"
          : r.status === "In Progress"
          ? "bg-[#3B82F6] text-white"
          : "bg-[#16A34A] text-white";

      li.innerHTML = `
        <p class="font-semibold text-red-600">${r.title}</p>
        <p class="text-sm">Building: ${r.building || "N/A"}</p>
        <p class="text-sm">Facility Type: ${r.facility_type || "N/A"}</p>
        ${roomHTML}
        ${floorHTML}
        <p class="text-sm">${r.description || "N/A"}</p>
        <span class="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColor}">
          ${r.status}
        </span>
      `;

      notifList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading notifications:", err);
  }
}


    loadNotifications()
    window.addEventListener("storage", (e) => {
      if (e.key === "maintenanceReports") loadNotifications()
    })
    setInterval(loadNotifications, 2000)
  }

  // FACILITY / FLOOR / ROOM
  const bldgSelect = document.getElementById("reportBldg")
  const facilitySelect = document.getElementById("facilityType")
  const floorContainer = document.getElementById("floorContainer")
  const roomContainer = document.getElementById("roomContainer")
  const floorSelect = document.getElementById("reportFloor")
  const roomInput = document.getElementById("reportRoom")

  const facilityOptions = {
    LB: ["CR", "Room", "Elevator", "Escalator", "Library"],
    ED: ["CR", "Room", "Elevator"],
    CIT: ["CR", "Room", "Elevator", "Library"],
    GYM: ["CR", "Room"],
    FD: ["CR", "Room"],
  }

  const facilityLabels = {
    CR: "Comfort Room (CR)",
    Room: "Room",
    Elevator: "Elevator",
    Escalator: "Escalator",
    Library: "Library",
  }

  function populateFacilities(building) {
    if (!facilitySelect) return
    facilitySelect.innerHTML = '<option value="" disabled selected>Select Type</option>'
    if (!building || !facilityOptions[building]) return
    facilityOptions[building].forEach((fac) => {
      const opt = document.createElement("option")
      opt.value = fac
      opt.textContent = facilityLabels[fac]
      facilitySelect.appendChild(opt)
    })
  }

  function updateFields() {
    if (!bldgSelect || !facilitySelect || !floorContainer || !roomContainer) return

    const bldg = bldgSelect.value
    const facility = facilitySelect.value
    floorContainer.classList.add("hidden")
    roomContainer.classList.add("hidden")
    if (floorSelect) floorSelect.innerHTML = ""

    if (!bldg || !facility) return

    const createFloors = (start, end) => {
      if (!floorSelect) return
      floorSelect.innerHTML = '<option value="">Select Floor</option>'
      for (let i = start; i <= end; i++) {
        const opt = document.createElement("option")
        opt.value = i
        opt.textContent = `${i}F`
        floorSelect.appendChild(opt)
      }
      floorContainer.classList.remove("hidden")
    }

    if (bldg === "LB") {
      if (facility === "CR") createFloors(1, 9)
      else if (facility === "Room") {
        if (roomInput) roomInput.placeholder = "Enter room number (e.g., 305)"
        roomContainer.classList.remove("hidden")
      } else if (facility === "Escalator") {
        if (floorSelect) {
          floorSelect.innerHTML = `
            <option value="">Select Range</option>
            <option value="1-3">1F–3F</option>
            <option value="3-5">3F–5F</option>
            <option value="5-7">5F–7F</option>
            <option value="7-9">7F–9F</option>`
        }
        floorContainer.classList.remove("hidden")
      }
    } else if (bldg === "ED") {
      if (facility === "CR") createFloors(1, 5)
      else if (facility === "Room") {
        if (roomInput) roomInput.placeholder = "Enter room number (e.g., 204)"
        roomContainer.classList.remove("hidden")
      }
    } else if (bldg === "CIT") {
      if (facility === "CR") createFloors(1, 7)
      else if (facility === "Room") {
        if (roomInput) roomInput.placeholder = "Enter room/lab (e.g., LAB701)"
        roomContainer.classList.remove("hidden")
      } else if (facility === "Library") createFloors(2, 4)
    } else if (bldg === "GYM") {
      if (facility === "CR") {
        if (floorSelect) {
          floorSelect.innerHTML = `
            <option value="">Select Floor</option>
            <option value="3">3F</option>
            <option value="4">4F</option>`
        }
        floorContainer.classList.remove("hidden")
      } else if (facility === "Room") {
        if (roomInput) roomInput.placeholder = "Format: A1 (1 letter + 1 number)"
        roomContainer.classList.remove("hidden")
      }
    } else if (bldg === "FD") {
      if (facility === "CR") createFloors(1, 6)
      else if (facility === "Room") {
        if (roomInput) roomInput.placeholder = "Enter 3-digit room number (e.g., 305)"
        roomContainer.classList.remove("hidden")
      }
    }
  }

  if (bldgSelect)
    bldgSelect.addEventListener("change", () => {
      populateFacilities(bldgSelect.value)
      updateFields()
    })
  if (facilitySelect) facilitySelect.addEventListener("change", updateFields)

  // REPORT SUBMISSION
  const reportForm = document.getElementById("reportForm")

  if (reportForm) {
    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      console.log("✅ Report form submitted")

      const title = document.getElementById("reportTitle")?.value.trim()
      const building = document.getElementById("reportBldg")?.value.trim()
      const facility = document.getElementById("facilityType")?.value.trim()
      const room = document.getElementById("reportRoom")?.value.trim()
      const floor = document.getElementById("reportFloor")?.value.trim()
      const desc = document.getElementById("reportDesc")?.value.trim()
      const fileInput = document.getElementById("reportFile")
      const Swal = window.Swal

      if (!title || !building || !desc) {
        Swal.fire("Missing Fields", "Please complete all required fields.", "warning")
        return
      }
      if (facility === "Room" && !room) {
        Swal.fire("Missing Room", "Please enter the room number.", "warning")
        return
      }
      if ((facility === "CR" || facility === "Comfort Room") && !floor) {
        Swal.fire("Missing Floor", "Please select the floor.", "warning")
        return
      }

      const file = fileInput?.files[0]
      const currentUserName = localStorage.getItem("currentUserName") || "Unknown"

      if (file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/pjpeg"]
        const maxSize = 5 * 1024 * 1024
        const fileExt = file.name.split(".").pop().toLowerCase()

        console.log("File selected:", file.name, file.type, file.size, fileExt)

        const validByType = allowedTypes.includes(file.type)
        const validByExt = ["png", "jpg", "jpeg"].includes(fileExt)

        if (!(validByType || validByExt)) {
          Swal.fire({
            title: "Invalid File Type",
            text: "Please upload only PNG, JPG, or JPEG images.",
            icon: "warning",
            confirmButtonColor: "#E43636",
          })
          fileInput.value = ""
          return
        }

        if (file.size > maxSize) {
          Swal.fire({
            title: "File Too Large",
            text: "Please upload an image smaller than 5 MB.",
            icon: "warning",
            confirmButtonColor: "#E43636",
          })
          fileInput.value = ""
          return
        }
      }

      const toBase64 = (file) =>
        new Promise((resolve) => {
          if (!file) return resolve(null)
          const reader = new FileReader()
          reader.onload = () => {
            console.log("FileReader success ✅")
            resolve(reader.result)
          }
          reader.onerror = (err) => {
            console.error("FileReader error ❌:", err)
            resolve(null)
          }
          reader.readAsDataURL(file)
        })

      try {
        const fileData = await toBase64(file)

        const newReport = {
          id: Date.now(),
          title,
          buildingName: building,
          facilityType: facility,
          floor: facility === "CR" || facility === "Comfort Room" ? floor : null,
          roomNumber: facility === "Room" ? room : null,
          description: desc,
          fileName: file?.name || null,
          fileData,
          status: "Pending",
          dateSubmitted: new Date().toLocaleString(),
          name: currentUserName,
        }

        console.log("Saving report to localStorage:", newReport)

        const response = await fetch("submit_report.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: localStorage.getItem("currentUserEmail") || "",
            title,
            building,
            facilityType: facility,
            floor,
            room,
            description: desc,
            imageData: fileData || "",
            name: localStorage.getItem("currentUserName") || "Unknown",  // ✅ send name instead
            email: localStorage.getItem("currentUserEmail") || "",
          }),
        })

        const result = await response.json()
        if (result.status === "success") {
          await Swal.fire({
            title: "Report Submitted!",
            text: `Your report "${title}" has been submitted successfully.`,
            icon: "success",
            confirmButtonText: "OK!",
            confirmButtonColor: "#E43636",
          })
        } else {
          Swal.fire("Error", result.message || "Failed to submit report.", "error")
        }

        reportForm.reset()
        fileInput.value = ""
      } catch (err) {
        console.error("❌ Unexpected submission error:", err)
        Swal.fire({
          title: "Error",
          text: "Failed to submit your report. Please try again.",
          icon: "error",
          confirmButtonColor: "#E43636",
        })
      }
    })
  }

  // ADMIN REPORT DISPLAY
  function loadAdminReports() {
    const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
    const reportList = document.getElementById("report-list")
    if (!reportList) return
    reportList.innerHTML = ""

    reports
      .slice()
      .reverse()
      .forEach((r) => {
        const item = document.createElement("div")
        item.className =
          "bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4"

        let detailsHTML = `<p><strong>Problem Title:</strong> ${r.title || "N/A"}</p>`
        detailsHTML += `<p><strong>Building Name:</strong> ${r.buildingName || "N/A"}</p>`
        detailsHTML += `<p><strong>Facility Type:</strong> ${r.facilityType || "N/A"}</p>`

        if (r.facilityType === "Room") {
          detailsHTML += `<p><strong>Room No.:</strong> ${r.roomNumber || "N/A"}</p>`
        } else if (["CR", "Elevator", "Library", "Escalator"].includes(r.facilityType)) {
          detailsHTML += `<p><strong>Floor:</strong> ${r.floor || "N/A"}</p>`
        }

        detailsHTML += `<p><strong>Problem Description:</strong> ${r.description || "N/A"}</p>`

        const imageHTML = r.fileData
          ? `<img src="${r.fileData}" alt="Attached Image" class="mt-2 w-40 h-40 object-cover rounded-md border" />`
          : `<p class="text-gray-500 italic mt-2">No image attached</p>`
        detailsHTML += `<div><strong>Attached Image:</strong><br>${imageHTML}</div>`

        detailsHTML += `<p class="text-xs text-gray-600 mt-2">Reported by: ${r.name || "Unknown"}</p>`
        detailsHTML += `<p class="text-xs text-gray-500">Date: ${r.dateSubmitted || "N/A"}</p>`

        item.innerHTML = detailsHTML
        reportList.appendChild(item)
      })
  }

  // REAL-TIME MAINTENANCE REQUEST LIST
  let cachedReports = []

  async function loadReportsFromServer(initialLoad = false) {
    try {
      if (initialLoad) console.log("🔁 Fetching reports at", new Date().toLocaleTimeString())

      const response = await fetch("fetch_reports.php?time=" + new Date().getTime());
const data = await response.json();

cachedReports = Array.isArray(data) ? data : data.reports || [];
renderReportList("All");

    } catch (err) {
      console.error("Error loading reports:", err)
    }
  }

  function renderReportList(currentFilter = "All") {
    const requestsList = document.getElementById("requestsList")
    if (!requestsList) return
    requestsList.innerHTML = ""

    let pending = 0,
      inProgress = 0,
      completed = 0

    cachedReports.forEach((r) => {
      if (r.status === "Pending") pending++
      else if (r.status === "In Progress") inProgress++
      else if (r.status === "Completed") completed++
    })

    const filteredReports = cachedReports.filter((r) => {
      return currentFilter === "All" || r.status === currentFilter
    })

    filteredReports.forEach((r) => {
      const li = document.createElement("li")
      li.className = "bg-white text-black p-3 rounded-lg flex justify-between items-center"

      let roomFloorHTML = ""
      if (r.facility_type === "Room") {
        roomFloorHTML = `<p class="text-sm">Room No. : ${r.room || "N/A"}</p>`
      } else if (["CR", "Elevator", "Library", "Escalator"].includes(r.facility_type)) {
        roomFloorHTML = `<p class="text-sm">Floor : ${r.floor || "N/A"}</p>`
      }

      li.innerHTML = `
        <div>
          <p class="font-semibold text-red-600">${r.title}</p>
          <p class="text-sm">Bldg Name : ${r.building || "N/A"}</p>
          <p class="text-sm">Facility Type : ${r.facility_type || "N/A"}</p>
          ${roomFloorHTML}
          <p class="text-sm">${r.description || "N/A"}</p>
          ${
            r.image
              ? `<a href="${r.image}" target="_blank" class="text-sm text-blue-600 underline">Attached File</a>`
              : `<p class="text-sm text-gray-500 italic">No image attached</p>`
          }
          <p class="text-xs text-gray-600">Reported by: ${r.complainant_email || "Unknown"}</p>
          <p class="text-xs text-gray-500">Date: ${r.date_submitted || "N/A"}</p>
        </div>
        <select data-id="${r.id}" class="statusSelect border rounded px-2 py-1 text-sm ml-3 self-center">
          <option value="Pending" ${r.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${r.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${r.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      `

      requestsList.appendChild(li)
    })

    document.getElementById("totalRequests").textContent = cachedReports.length
    document.getElementById("pendingCount").textContent = pending
    document.getElementById("inProgressCount").textContent = inProgress
    document.getElementById("completedCount").textContent = completed

    document.querySelectorAll(".statusSelect").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const reportId = e.target.dataset.id
        const newStatus = e.target.value

        await fetch("update_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ id: reportId, status: newStatus }),
        })

        const target = cachedReports.find((r) => r.id == reportId)
        if (target) target.status = newStatus
        renderReportList(currentFilter)
      })
    })
  }

  const statusFilter = document.getElementById("statusFilter")
  if (statusFilter) {
    statusFilter.onchange = () => renderReportList(statusFilter.value)
  }

  if (body.dataset.page === "admin") {
    console.log("✅ Admin smart live-updating request list enabled")

    let lastHash = ""

    async function checkForUpdates() {
      try {
        const response = await fetch("fetch_reports.php?time=" + new Date().getTime())
        const newReports = await response.json()

        const newHash = JSON.stringify(newReports)

        if (newHash !== lastHash) {
          lastHash = newHash
          cachedReports = newReports
          renderReportList(document.getElementById("statusFilter")?.value || "All")
          console.log("🔄 Maintenance requests updated:", new Date().toLocaleTimeString())
        }
      } catch (err) {
        console.error("Error checking updates:", err)
      }
    }

    loadReportsFromServer(true)

    setInterval(checkForUpdates, 3000)
  }

  // FOOTER
  if (footerContainer) {
    fetch("includes/footer.php")
      .then((res) => res.text())
      .then((data) => {
        footerContainer.innerHTML = data

        const page = body.dataset.page
        const allFooters = footerContainer.querySelectorAll(".footer")
        allFooters.forEach((f) => f.classList.remove("show"))

        const currentFooter = footerContainer.querySelector(`#${page}-footer`)
        if (currentFooter) {
          setTimeout(() => currentFooter.classList.add("show"), 200)
        }

        if (page === "index") {
          const gotItBtn = currentFooter?.querySelector(".got-it-btn")
          const moreInfoBtn = currentFooter?.querySelector("#moreInfoBtn")
          const moreInfoContent = document.getElementById("moreInfoContent")
          const closeModalBtns = moreInfoContent?.querySelectorAll(".close-modal-btn") || []

          if (gotItBtn) gotItBtn.addEventListener("click", () => currentFooter?.classList.remove("show"))
          if (moreInfoBtn && moreInfoContent)
            moreInfoBtn.addEventListener("click", () => moreInfoContent.classList.add("show"))
          closeModalBtns.forEach((btn) =>
            btn.addEventListener("click", () => moreInfoContent?.classList.remove("show")),
          )
        }
      })
      .catch((err) => console.error("Error loading footer:", err))
  }

  
  // ANNOUNCEMENTS (ADMIN)
const announceList = document.getElementById("announcementList");
const announceTitle = document.getElementById("announceTitle");
const announceDesc = document.getElementById("announceDesc");
const Swal = window.Swal;

// Toggle Add Form
window.toggleAnnouncementForm = () => {
  const form = document.getElementById("announcementForm");
  if (form) form.classList.toggle("hidden");
};

// Add Announcement
window.addAnnouncement = async (event) => {
  if (event) event.preventDefault();

  const title = announceTitle.value.trim();
  const desc = announceDesc.value.trim();

  if (!title || !desc) {
    Swal.fire("Missing Fields", "Please fill out both title and description.", "warning");
    return;
  }

  try {
    const res = await fetch("add_announcement.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ title, desc }),
    });
    const data = await res.json();

    if (data.status === "success") {
      Swal.fire({
        title: "Announcement Posted!",
        text: "All users can now see your announcement.",
        icon: "success",
        confirmButtonColor: "#E43636",
      });
      announceTitle.value = "";
      announceDesc.value = "";
      window.toggleAnnouncementForm();

      // Broadcast update to all tabs/dashboards
      localStorage.setItem("announcementUpdate", Date.now().toString());

      loadAnnouncementsAdmin();
    } else {
      Swal.fire("Error", data.message || "Failed to add announcement.", "error");
    }
  } catch (err) {
    console.error("Error adding announcement:", err);
    Swal.fire("Error", "Could not connect to the server.", "error");
  }
};

// Load Admin Announcements
async function loadAnnouncementsAdmin() {
  if (!announceList) return;

  try {
    const res = await fetch("fetch_announcements.php");
    const announcements = await res.json();

    announceList.innerHTML = "";
    if (announcements.length === 0) {
      announceList.innerHTML = `<p class="text-sm opacity-80">No announcements yet.</p>`;
      return;
    }

    announcements.forEach((a) => {
      const div = document.createElement("div");
      div.className =
        "bg-white text-black p-3 rounded-lg shadow flex justify-between items-start";
      div.innerHTML = `
        <div>
          <h3 class="font-bold text-red-600">${a.title}</h3>
          <p class="text-sm">${a.desc}</p>
          <p class="text-xs text-gray-500 mt-1">${a.date}</p>
        </div>
        <button class="text-red-600 font-bold hover:text-red-800" data-id="${a.id}">✕</button>
      `;
      announceList.appendChild(div);
    });

    // Delete Announcement Handler
    announceList.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        const confirm = await Swal.fire({
          title: "Delete Announcement?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#E43636",
          confirmButtonText: "Yes, Delete",
        });

        if (confirm.isConfirmed) {
          const res = await fetch("delete_announcement.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ id }),
          });
          const result = await res.json();

          if (result.status === "success") {
            Swal.fire("Deleted!", "Announcement removed successfully.", "success");
            loadAnnouncementsAdmin();
            // Notify all dashboards
            localStorage.setItem("announcementUpdate", Date.now().toString());
          } else {
            Swal.fire("Error", result.message || "Failed to delete announcement.", "error");
          }
        }
      });
    });
  } catch (err) {
    console.error("Error loading announcements:", err);
  }
}

if (announceList) {
  loadAnnouncementsAdmin();
  // Auto-refresh every 3 seconds
  setInterval(loadAnnouncementsAdmin, 3000);
  // Listen for updates from other tabs
  window.addEventListener("storage", (e) => {
    if (e.key === "announcementUpdate") loadAnnouncementsAdmin();
  });
}

  function adjustAnnouncementHeight() {
    const container = document.getElementById("announcements");
    if (!container) return;

    // Check actual screen width
    if (window.innerWidth < 768) {
      container.style.maxHeight = "18rem"; // mobile → 2 announcements
    } else {
      container.style.maxHeight = "43rem"; // desktop → 4 announcements
    }
  }

  // Run on load & resize
  window.addEventListener("load", adjustAnnouncementHeight);
  window.addEventListener("resize", adjustAnnouncementHeight);

// DASHBOARD (Complaints Page)
const dashboardAnnouncements = document.getElementById("announcements");

if (dashboardAnnouncements) {
  async function loadDashboardAnnouncements() {
    const res = await fetch("fetch_announcements.php");
    const announcements = await res.json();

    dashboardAnnouncements.innerHTML = "";

    if (announcements.length === 0) {
      dashboardAnnouncements.innerHTML = `
        <div class="card w-full sm:w-80 md:w-96 lg:w-[28rem] p-6 bg-white text-gray-900 rounded-2xl shadow">
          <h2 class="text-xl font-semibold text-red-700 mb-2">No Announcements Yet</h2>
          <p>Announcements from admin will appear here.</p>
        </div>`;
      return;
    }

    announcements.forEach((a) => {
      const card = document.createElement("div");
      card.className =
        "card w-full sm:w-80 md:w-96 lg:w-[28rem] p-6 bg-white text-gray-900 rounded-2xl shadow hover:shadow-lg transition";
      card.innerHTML = `
        <h2 class="text-xl font-semibold text-red-700 mb-2">${a.title}</h2>
        <p>${a.desc}</p>
        <p class="text-xs text-gray-500 mt-2">Posted on ${a.date}</p>`;
      dashboardAnnouncements.appendChild(card);
    });
  }

  loadDashboardAnnouncements();
  setInterval(loadDashboardAnnouncements, 3000);

  window.addEventListener("storage", (e) => {
    if (e.key === "announcementUpdate") loadDashboardAnnouncements();
  });
}


  // PROFILE VIEW & CHANGE SYSTEM
  function setupDashboardProfile() {
    const defaultPic = "assets/images/unknown.jpg"
    const desktopPic = document.getElementById("dashboardProfilePic")
    const mobilePic = document.getElementById("mobileProfilePic")
    const desktopName = document.getElementById("dashboardUserName")
    const mobileName = document.getElementById("mobileUserName")
    const profileSection = document.getElementById("profileSection")
    const mobileProfileSection = document.getElementById("mobileProfileSection")

    const modal = document.getElementById("profileModal")
    const modalPic = document.getElementById("modalProfilePic")
    const modalName = document.getElementById("modalUserName")
    const closeModal = document.getElementById("closeProfileModal")
    const changeBtn = document.getElementById("changeProfilePicBtn")
    const fileInput = document.getElementById("editProfilePicInput")

    const viewModal = document.getElementById("viewProfileModal")
    const viewImg = document.getElementById("viewProfileImage")
    const closeViewModal = document.getElementById("closeViewProfileModal")

    if (!profileSection || !modal) return

    const storedName = localStorage.getItem("currentUserName") || "User Name"
    const storedPic = localStorage.getItem("currentUserProfilePic") || defaultPic
    ;[desktopPic, mobilePic, modalPic].forEach((el) => el && (el.src = storedPic))
    ;[desktopName, mobileName, modalName].forEach((el) => el && (el.textContent = storedName))

    const openProfileModal = () => {
      modal.classList.remove("hidden")
      modalPic.src = localStorage.getItem("currentUserProfilePic") || defaultPic
      modalName.textContent = localStorage.getItem("currentUserName") || "User Name"
    }

    profileSection.addEventListener("click", openProfileModal)
    mobileProfileSection.addEventListener("click", openProfileModal)

    closeModal.addEventListener("click", () => modal.classList.add("hidden"))
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden")
    })

    changeBtn.addEventListener("click", () => fileInput.click())
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0]
      if (!file) return

      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File",
          text: "Please upload a PNG or JPG image.",
          icon: "warning",
          confirmButtonColor: "#E43636",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
  const base64 = reader.result;
  const currentUserEmail = localStorage.getItem("currentUserEmail");

  if (currentUserEmail) {
    const picKey = `profilePic_${currentUserEmail}`;
    localStorage.setItem(picKey, base64);
    localStorage.setItem("currentUserProfilePic", base64);

    // ✅ Upload to server for cross-device sync
    fetch("update_profile_pic.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: currentUserEmail,
        imageData: base64,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire({
            title: "Profile Picture Updated!",
            text: "Your profile picture is now synced across devices.",
            icon: "success",
            confirmButtonColor: "#E43636",
          });
        } else {
          Swal.fire("Error", data.message || "Failed to update on server.", "error");
        }
      })
      .catch((err) => console.error("Profile sync error:", err));
  }

  [modalPic, desktopPic, mobilePic].forEach((el) => el && (el.src = base64));
};

      reader.readAsDataURL(file)
    })

    modalPic.addEventListener("click", () => {
      const src = modalPic.src || defaultPic
      viewImg.src = src
      viewModal.classList.remove("hidden")
    })

    closeViewModal.addEventListener("click", () => viewModal.classList.add("hidden"))
    viewModal.addEventListener("click", (e) => {
      if (e.target === viewModal) viewModal.classList.add("hidden")
    })
  }
})
