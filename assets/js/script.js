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
    fetch('includes/navbar.html')
      .then(res => res.text())
      .then(data => {
        navbarContainer.innerHTML = data;

        // DESKTOP & MOBILE TOGGLES
        const darkToggleDesktop = document.getElementById("darkModeToggle");
        const darkToggleMobile = document.getElementById("darkModeToggleMobile");
        const sliderCircleDesktop = document.getElementById("sliderCircle");
        const sliderCircleMobile = document.querySelector('#mobile-menu span span');

        // MOBILE MENU
        const menuBtn = document.getElementById("menu-btn");
        const mobileMenu = document.getElementById("mobile-menu");

        // DARK MODE FUNCTION
        function setDarkMode(isDark) {
          if (isDark) {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            if (sliderCircleDesktop) sliderCircleDesktop.textContent = "🌙";
            if (sliderCircleMobile) sliderCircleMobile.textContent = "🌙";
          } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            if (sliderCircleDesktop) sliderCircleDesktop.textContent = "☀️";
            if (sliderCircleMobile) sliderCircleMobile.textContent = "☀️";
          }
        }

        if (darkToggleDesktop) {
          darkToggleDesktop.addEventListener("change", e => {
            setDarkMode(e.target.checked);
            if (darkToggleMobile) darkToggleMobile.checked = e.target.checked;
            localStorage.setItem('darkMode', e.target.checked);
          });
        }

        if (darkToggleMobile) {
          darkToggleMobile.addEventListener("change", e => {
            setDarkMode(e.target.checked);
            if (darkToggleDesktop) darkToggleDesktop.checked = e.target.checked;
            localStorage.setItem('darkMode', e.target.checked);
          });
        }

        // MOBILE MENU TOGGLE WITH SLIDE
        if (menuBtn && mobileMenu) {
          menuBtn.addEventListener("click", () => {
            if (mobileMenu.classList.contains("show")) {

              const height = mobileMenu.scrollHeight;
              mobileMenu.style.height = height + "px";
              mobileMenu.style.paddingTop = "12px";
              mobileMenu.style.paddingBottom = "12px";

              requestAnimationFrame(() => {
                mobileMenu.style.height = "0";
                mobileMenu.style.paddingTop = "0";
                mobileMenu.style.paddingBottom = "0";
              });

              mobileMenu.addEventListener(
                "transitionend",
                () => {
                  mobileMenu.classList.remove("show");
                  mobileMenu.style.height = "";
                },
                { once: true }
              );
            } else {
              mobileMenu.classList.add("show");
              const height = mobileMenu.scrollHeight + "px";

              mobileMenu.style.height = "0";
              mobileMenu.style.paddingTop = "0";
              mobileMenu.style.paddingBottom = "0";

              requestAnimationFrame(() => {
                mobileMenu.style.height = height;
                mobileMenu.style.paddingTop = "12px";
                mobileMenu.style.paddingBottom = "12px";
              });

              mobileMenu.addEventListener(
                "transitionend",
                () => {
                  mobileMenu.style.height = ""
                },
                { once: true }
              );
            }
          });
        }

        const darkModePref = localStorage.getItem('darkMode') === 'true';
        if (darkToggleDesktop) darkToggleDesktop.checked = darkModePref;
        if (darkToggleMobile) darkToggleMobile.checked = darkModePref;
        setDarkMode(darkModePref);
      })
      .catch(err => console.error("Error loading navbar:", err));
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
