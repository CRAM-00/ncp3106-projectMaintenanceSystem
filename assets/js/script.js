document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbarContainer = document.getElementById("navbar-container");
  const footerContainer = document.getElementById("footer-container");

  // LOGIN / SIGNUP SWITCHING
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  window.showSignup = () => {
    loginForm.classList.remove("active");
    setTimeout(() => signupForm.classList.add("active"), 200);
  };

  window.showLogin = () => {
    signupForm.classList.remove("active");
    setTimeout(() => loginForm.classList.add("active"), 200);
  };

  // LOGIN FUNCTION
  window.handleLogin = () => {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    const loginButton = loginForm.querySelector("button");
    const errorMessage = document.getElementById("error-message");

    if (!email.checkValidity()) { email.reportValidity(); return; }
    if (!password.checkValidity()) { password.reportValidity(); return; }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";
    errorMessage.textContent = "";

    setTimeout(() => {
      const loginSuccess = false; 

      if (loginSuccess) {
        window.location.href = "dashboard.html";
      } else {
        errorMessage.textContent = "Incorrect email or password!";
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    }, 1000);
  };

  // SIGNUP FUNCTION
  window.handleSignup = () => {
    const role = document.getElementById("signupRole");
    const first = document.getElementById("firstName");
    const last = document.getElementById("lastName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const registerButton = signupForm.querySelector("button");

    if (!role.checkValidity()) { role.reportValidity(); return; }
    if (!first.checkValidity()) { first.reportValidity(); return; }
    if (!last.checkValidity()) { last.reportValidity(); return; }
    if (!email.checkValidity()) { email.reportValidity(); return; }
    if (!password.checkValidity()) { password.reportValidity(); return; }

    registerButton.disabled = true;
    registerButton.textContent = "Registering...";

    setTimeout(() => {
      Swal.fire({
        title: "You are now registered!",
        text: `${first.value} ${last.value}, Welcome to UE Maintenance Services!`,
        icon: "success",
        confirmButtonText: "Cool!",
        confirmButtonColor: "#E43636",
      }).then(() => {
        showLogin();
        registerButton.disabled = false;
        registerButton.textContent = "Register";

        role.value = "";
        first.value = "";
        last.value = "";
        email.value = "";
        password.value = "";
      });
    }, 1000);
  };

  // NAVBAR
if (navbarContainer) {
  fetch("includes/navbar.html")
    .then(res => res.text())
    .then(data => {
      navbarContainer.innerHTML = data;

      const page = body.dataset.page;
      const dashboardNav = document.getElementById("dashboard-nav");
      const adminNav = document.getElementById("admin-nav");

      // Show navbar based on page
      if (page === "dashboard") {
        dashboardNav.classList.remove("hidden");
        setupDarkMode("dashboard");
        setupMobileMenu();
      } else if (page === "admin") {
        adminNav.classList.remove("hidden");
        setupDarkMode("admin");
      }
    })
    .catch(err => console.error("Error loading navbar:", err));
}

// --- DARK MODE FUNCTION PER PAGE ---
function setupDarkMode(pageType) {
  let darkKey, darkToggleDesktop, sliderCircleDesktop, darkToggleMobile, sliderCircleMobile;

  if (pageType === "dashboard") {
    darkKey = "darkMode_dashboard";
    darkToggleDesktop = document.getElementById("darkModeToggleDashboard");
    sliderCircleDesktop = document.getElementById("sliderCircleDashboard");
    darkToggleMobile = document.getElementById("darkModeToggleMobile");
    sliderCircleMobile = document.getElementById("sliderCircleMobile");
  } else if (pageType === "admin") {
    darkKey = "darkMode_admin";
    darkToggleDesktop = document.getElementById("darkModeToggleAdmin");
    sliderCircleDesktop = document.getElementById("sliderCircleAdmin");
  }

function setDarkMode(isDark) {
  if (isDark) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");

    if (sliderCircleDesktop) {
      sliderCircleDesktop.textContent = "🌙";
      sliderCircleDesktop.classList.add("translate-x-6"); 
      sliderCircleDesktop.classList.remove("translate-x-0");
    }

    if (sliderCircleMobile) {
      sliderCircleMobile.textContent = "🌙";
      sliderCircleMobile.classList.add("translate-x-6");
      sliderCircleMobile.classList.remove("translate-x-0");
    }

  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");

    if (sliderCircleDesktop) {
      sliderCircleDesktop.textContent = "☀️";
      sliderCircleDesktop.classList.add("translate-x-0");
      sliderCircleDesktop.classList.remove("translate-x-6");
    }

    if (sliderCircleMobile) {
      sliderCircleMobile.textContent = "☀️";
      sliderCircleMobile.classList.add("translate-x-0");
      sliderCircleMobile.classList.remove("translate-x-6");
    }
  }
}

  const savedDark = localStorage.getItem(darkKey) === "true";
  setDarkMode(savedDark);
  if (darkToggleDesktop) darkToggleDesktop.checked = savedDark;
  if (darkToggleMobile) darkToggleMobile.checked = savedDark;

  // Desktop toggle event
  if (darkToggleDesktop) {
    darkToggleDesktop.addEventListener("change", e => {
      const isDark = e.target.checked;
      setDarkMode(isDark);
      localStorage.setItem(darkKey, isDark);
      if (darkToggleMobile) darkToggleMobile.checked = isDark;
    });
  }

  // Mobile toggle event (only dashboard)
  if (darkToggleMobile) {
    darkToggleMobile.addEventListener("change", e => {
      const isDark = e.target.checked;
      setDarkMode(isDark);
      localStorage.setItem(darkKey, isDark);
      if (darkToggleDesktop) darkToggleDesktop.checked = isDark;
    });
  }
}

// --- MOBILE MENU FUNCTION ---
function setupMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    if (mobileMenu.classList.contains("show")) {
      const height = mobileMenu.scrollHeight;
      mobileMenu.style.height = height + "px";
      requestAnimationFrame(() => {
        mobileMenu.style.height = "0";
      });
      mobileMenu.addEventListener("transitionend", () => {
        mobileMenu.classList.remove("show");
        mobileMenu.style.height = "";
      }, { once: true });
    } else {
      mobileMenu.classList.add("show");
      const height = mobileMenu.scrollHeight + "px";
      mobileMenu.style.height = "0";
      requestAnimationFrame(() => {
        mobileMenu.style.height = height;
      });
      mobileMenu.addEventListener("transitionend", () => {
        mobileMenu.style.height = "";
      }, { once: true });
    }
  });
}

  //FOOTER
if (footerContainer) {
  fetch('includes/footer.html')
    .then(res => res.text())
    .then(data => {
      footerContainer.innerHTML = data;

      const page = body.dataset.page; 

      const allFooters = footerContainer.querySelectorAll('.footer');
      allFooters.forEach(f => f.classList.remove('show'));

      const currentFooter = footerContainer.querySelector(`#${page}-footer`);
      if (currentFooter) {
        setTimeout(() => currentFooter.classList.add('show'), 200);
      }

      if (page === "index") {
        const gotItBtn = currentFooter.querySelector('.got-it-btn');
        const moreInfoBtn = currentFooter.querySelector('#moreInfoBtn');
        const moreInfoContent = document.getElementById('moreInfoContent');
        const closeModalBtns = moreInfoContent ? moreInfoContent.querySelectorAll('.close-modal-btn') : [];

        if (gotItBtn) gotItBtn.addEventListener('click', () => currentFooter.classList.remove('show'));
        if (moreInfoBtn && moreInfoContent) moreInfoBtn.addEventListener('click', () => moreInfoContent.classList.add('show'));
        if (closeModalBtns.length > 0) closeModalBtns.forEach(btn => btn.addEventListener('click', () => moreInfoContent.classList.remove('show')));
      }
    })
    .catch(err => console.error('Error loading footer:', err));
}

});
