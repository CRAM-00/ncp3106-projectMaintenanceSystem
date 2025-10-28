document.addEventListener("DOMContentLoaded", () => {
  const body = document.body
  const navbarContainer = document.getElementById("navbar-container")
  const footerContainer = document.getElementById("footer-container")

  // LOGIN / SIGNUP SWITCHING
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  window.showSignup = () => {
    loginForm.classList.remove("active")
    setTimeout(() => signupForm.classList.add("active"), 200)
  }

  window.showLogin = () => {
    signupForm.classList.remove("active")
    setTimeout(() => loginForm.classList.add("active"), 200)
  }

  // LOGIN FUNCTION
  window.handleLogin = () => {
    const email = document.getElementById("loginEmail")
    const password = document.getElementById("loginPassword")
    const loginButton = loginForm.querySelector("button")
    const errorMessage = document.getElementById("error-message")

    if (!email.checkValidity()) {
      email.reportValidity()
      return
    }
    if (!password.checkValidity()) {
      password.reportValidity()
      return
    }

    loginButton.disabled = true
    loginButton.textContent = "Logging in..."
    errorMessage.textContent = ""

    setTimeout(() => {
      const loginSuccess = false

      if (loginSuccess) {
        window.location.href = "dashboard.html"
      } else {
        errorMessage.textContent = "Incorrect email or password!"
        loginButton.disabled = false
        loginButton.textContent = "Login"
      }
    }, 1000)
  }

  // SIGNUP FUNCTION
  window.handleSignup = () => {
    const role = document.getElementById("signupRole")
    const first = document.getElementById("firstName")
    const last = document.getElementById("lastName")
    const email = document.getElementById("signupEmail")
    const password = document.getElementById("signupPassword")
    const registerButton = signupForm.querySelector("button")

    if (!role.checkValidity()) {
      role.reportValidity()
      return
    }
    if (!first.checkValidity()) {
      first.reportValidity()
      return
    }
    if (!last.checkValidity()) {
      last.reportValidity()
      return
    }
    if (!email.checkValidity()) {
      email.reportValidity()
      return
    }
    if (!password.checkValidity()) {
      password.reportValidity()
      return
    }

    registerButton.disabled = true
    registerButton.textContent = "Registering..."

    setTimeout(() => {
      const Swal = window.Swal // Declare Swal variable
      Swal.fire({
        title: "You are now registered!",
        text: `${first.value} ${last.value}, Welcome to UE Maintenance Services!`,
        icon: "success",
        confirmButtonText: "Cool!",
        confirmButtonColor: "#E43636",
      }).then(() => {
        window.showLogin() // Declare showLogin variable
        registerButton.disabled = false
        registerButton.textContent = "Register"

        role.value = ""
        first.value = ""
        last.value = ""
        email.value = ""
        password.value = ""
      })
    }, 1000)
  }

  // NAVBAR
  if (navbarContainer) {
    fetch("includes/navbar.html")
      .then((res) => res.text())
      .then((data) => {
        navbarContainer.innerHTML = data

        const page = body.dataset.page
        const dashboardNav = document.getElementById("dashboard-nav")
        const adminNav = document.getElementById("admin-nav")

        // Show navbar based on page
        if (page === "dashboard") {
          dashboardNav.classList.remove("hidden")
          setupDarkMode("dashboard")
          setupMobileMenu()
        } else if (page === "admin") {
          adminNav.classList.remove("hidden")
          setupDarkMode("admin")
          

          //ADMIN NOTIFICATIONS 
          const notifBtn = document.getElementById("notif-btn")
          const notifDropdown = document.getElementById("notif-dropdown")
          const notifCount = document.getElementById("notif-count")
          const notifList = document.getElementById("notif-list")

          if (notifBtn && notifDropdown && notifList) {
            //  Toggle dropdown visibility 
            notifBtn.addEventListener("click", () => {
              notifDropdown.classList.toggle("hidden")
            })

            //  Function to refresh notifications 
            function loadNotifications() {
              const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
              notifList.innerHTML = ""

              // Filter only reports that are not completed
              const activeReports = reports.filter((r) => r.status !== "Completed")

              if (activeReports.length === 0) {
                notifList.innerHTML = `<li class="p-3 text-sm text-gray-500">No pending or in-progress reports</li>`
                notifCount.classList.add("hidden")
                return
              }

              // Show count for pending/in-progress reports
              notifCount.textContent = activeReports.length
              notifCount.classList.remove("hidden")

              // Display list (latest first)
              activeReports
                .slice()
                .reverse()
                .forEach((r) => {
                  const statusColor =
                    r.status === "Pending"
                      ? "text-yellow-500"
                      : r.status === "In Progress"
                        ? "text-blue-500"
                        : "text-gray-500"

                  const li = document.createElement("li")
                  li.className = "p-3 hover:bg-gray-100 transition"
                  li.innerHTML = `
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-red-600">${r.title}</p>
                    <p class="text-sm text-gray-700">${r.desc}</p>
                    <p class="text-xs text-gray-500 mt-1">By ${r.name} • ${r.date}</p>
                    <p class="text-xs mt-1 font-semibold ${statusColor}">${r.status}</p>
                  </div>
                </div>
              `
                  notifList.appendChild(li)
                })
            }

            loadNotifications()

            window.addEventListener("storage", (e) => {
              if (e.key === "maintenanceReports") loadNotifications()
            })

          
            setInterval(() => {
              loadNotifications()
            }, 100)
          }
        }
      })
      .catch((err) => console.error("Error loading navbar:", err))
  }



  // DARK MODE
  function setupDarkMode(pageType) {
    let darkKey, darkToggleDesktop, sliderCircleDesktop, darkToggleMobile, sliderCircleMobile

    if (pageType === "dashboard") {
      darkKey = "darkMode_dashboard"
      darkToggleDesktop = document.getElementById("darkModeToggleDashboard")
      sliderCircleDesktop = document.getElementById("sliderCircleDashboard")
      darkToggleMobile = document.getElementById("darkModeToggleMobile")
      sliderCircleMobile = document.getElementById("sliderCircleMobile")
    } else if (pageType === "admin") {
      darkKey = "darkMode_admin"
      darkToggleDesktop = document.getElementById("darkModeToggleAdmin")
      sliderCircleDesktop = document.getElementById("sliderCircleAdmin")
    }

    function setDarkMode(isDark) {
      if (isDark) {
        body.classList.add("dark-mode")
        body.classList.remove("light-mode")

        if (sliderCircleDesktop) {
          sliderCircleDesktop.textContent = "🌙"
          sliderCircleDesktop.classList.add("translate-x-6")
          sliderCircleDesktop.classList.remove("translate-x-0")
        }

        if (sliderCircleMobile) {
          sliderCircleMobile.textContent = "🌙"
          sliderCircleMobile.classList.add("translate-x-6")
          sliderCircleMobile.classList.remove("translate-x-0")
        }
      } else {
        body.classList.add("light-mode")
        body.classList.remove("dark-mode")

        if (sliderCircleDesktop) {
          sliderCircleDesktop.textContent = "☀️"
          sliderCircleDesktop.classList.add("translate-x-0")
          sliderCircleDesktop.classList.remove("translate-x-6")
        }

        if (sliderCircleMobile) {
          sliderCircleMobile.textContent = "☀️"
          sliderCircleMobile.classList.add("translate-x-0")
          sliderCircleMobile.classList.remove("translate-x-6")
        }
      }
    }

    const savedDark = localStorage.getItem(darkKey) === "true"
    setDarkMode(savedDark)
    if (darkToggleDesktop) darkToggleDesktop.checked = savedDark
    if (darkToggleMobile) darkToggleMobile.checked = savedDark

    // Desktop toggle event
    if (darkToggleDesktop) {
      darkToggleDesktop.addEventListener("change", (e) => {
        const isDark = e.target.checked
        setDarkMode(isDark)
        localStorage.setItem(darkKey, isDark)
        if (darkToggleMobile) darkToggleMobile.checked = isDark
      })
    }

    // Mobile toggle event (only dashboard)
    if (darkToggleMobile) {
      darkToggleMobile.addEventListener("change", (e) => {
        const isDark = e.target.checked
        setDarkMode(isDark)
        localStorage.setItem(darkKey, isDark)
        if (darkToggleDesktop) darkToggleDesktop.checked = isDark
      })
    }
  }

  //  MOBILE MENU FUNCTION
  function setupMobileMenu() {
    const menuBtn = document.getElementById("menu-btn")
    const mobileMenu = document.getElementById("mobile-menu")

    if (!menuBtn || !mobileMenu) return

    menuBtn.addEventListener("click", () => {
      if (mobileMenu.classList.contains("show")) {
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
      } else {
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
    })
  }

  //FOOTER
  if (footerContainer) {
    fetch("includes/footer.html")
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
          const gotItBtn = currentFooter.querySelector(".got-it-btn")
          const moreInfoBtn = currentFooter.querySelector("#moreInfoBtn")
          const moreInfoContent = document.getElementById("moreInfoContent")
          const closeModalBtns = moreInfoContent ? moreInfoContent.querySelectorAll(".close-modal-btn") : []

          if (gotItBtn) gotItBtn.addEventListener("click", () => currentFooter.classList.remove("show"))
          if (moreInfoBtn && moreInfoContent)
            moreInfoBtn.addEventListener("click", () => moreInfoContent.classList.add("show"))
          if (closeModalBtns.length > 0)
            closeModalBtns.forEach((btn) =>
              btn.addEventListener("click", () => moreInfoContent.classList.remove("show")),
            )
        }
      })
      .catch((err) => console.error("Error loading footer:", err))
  }

  // REPORT FORM SUBMISSION (dashboard.html)
  const reportForm = document.getElementById("reportForm")
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const title = document.getElementById("reportTitle").value.trim()
      const bldg  = document.getElementById("reportBldg").value.trim()
      const room = document.getElementById("reportRoom").value.trim()
      const desc = document.getElementById("reportDesc").value.trim()

      if (!title || !bldg || !room || !desc) {
        alert("Please fill out all fields!")
        return
      }

      // Create a new report object
      const newReport = {
        id: Date.now(),
        title,
        bldg,
        room,
        desc,
        status: "Pending",
        date: new Date().toLocaleString(),
      }

      // Load existing reports
      const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
      reports.push(newReport)
      localStorage.setItem("maintenanceReports", JSON.stringify(reports))

      alert("✅ Report submitted successfully!")
      reportForm.reset()
    })
  }

  // ADMIN PAGE REPORT DISPLAY
  const requestsList = document.getElementById("requestsList")

  if (requestsList) {
    window.loadReports = () => {
      // Declare loadReports function
      const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
      requestsList.innerHTML = ""

      let pending = 0,
        inProgress = 0,
        completed = 0

      reports.forEach((r) => {
        if (r.status === "Pending") pending++
        else if (r.status === "In Progress") inProgress++
        else if (r.status === "Completed") completed++

        const li = document.createElement("li")
        li.className = "bg-white text-black p-3 rounded-lg flex justify-between items-center"

        li.innerHTML = `
        <div>
          <p class="font-semibold text-red-600">${r.title}</p>
          <p class="text-sm">Bldg Name : ${r.bldg}</p>
          <p class="text-sm">Room No. : ${r.room}</p>
          <p class="text-sm">${r.desc}</p>
          <p class="text-xs text-gray-600">Reported by: ${r.name}</p>
          <p class="text-xs text-gray-500">Date: ${r.date}</p>
        </div>
        <select data-id="${r.id}" class="statusSelect border rounded px-2 py-1">
          <option value="Pending" ${r.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${r.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${r.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      `
        requestsList.appendChild(li)
      })

      // Update counts
      document.getElementById("totalRequests").textContent = reports.length
      document.getElementById("pendingCount").textContent = pending
      document.getElementById("inProgressCount").textContent = inProgress
      document.getElementById("completedCount").textContent = completed

      // Add event listeners for each dropdown (status update)
      document.querySelectorAll(".statusSelect").forEach((select) => {
        select.addEventListener("change", (e) => {
          const id = Number.parseInt(e.target.dataset.id)
          const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
          const report = reports.find((r) => r.id === id)
          if (report) report.status = e.target.value
          localStorage.setItem("maintenanceReports", JSON.stringify(reports))
          window.loadReports() // Call loadReports function
        })
      })

      // FILTER FUNCTIONALITY
      const statusFilter = document.getElementById("statusFilter")
      if (statusFilter) {
        statusFilter.addEventListener("change", () => {
          const selectedStatus = statusFilter.value
          const requestItems = requestsList.querySelectorAll("li")

          requestItems.forEach((item) => {
            const statusSelect = item.querySelector(".statusSelect")
            const currentStatus = statusSelect ? statusSelect.value : ""

            if (selectedStatus === "All" || currentStatus === selectedStatus) {
              item.classList.remove("hidden")
            } else {
              item.classList.add("hidden")
            }
          })
        })
      }
    }

    // Initial load
    if (window.loadReports) window.loadReports()

    // Refresh when data changes
    window.addEventListener("storage", (event) => {
      if (event.key === "maintenanceReports" && window.loadReports) {
        window.loadReports()
      }
    })
  }

  // ADMIN PAGE
  const announceList = document.getElementById("announcementList")
  const announceTitle = document.getElementById("announceTitle")
  const announceDesc = document.getElementById("announceDesc")

  window.toggleAnnouncementForm = () => {
    // Declare toggleAnnouncementForm function
    const form = document.getElementById("announcementForm")
    if (form) form.classList.toggle("hidden")
  }

  window.addAnnouncement = () => {
    // Declare addAnnouncement function
    const title = announceTitle.value.trim()
    const desc = announceDesc.value.trim()

    if (!title || !desc) return alert("Please fill out all fields!")

    const newAnnouncement = {
      id: Date.now(),
      title,
      desc,
      date: new Date().toLocaleString(),
    }

    const announcements = JSON.parse(localStorage.getItem("announcements") || "[]")
    announcements.push(newAnnouncement)
    localStorage.setItem("announcements", JSON.stringify(announcements))

    announceTitle.value = ""
    announceDesc.value = ""
    window.toggleAnnouncementForm() // Call toggleAnnouncementForm function
    loadAnnouncementsAdmin()
  }

  function loadAnnouncementsAdmin() {
    if (!announceList) return
    const announcements = JSON.parse(localStorage.getItem("announcements") || "[]")
    announceList.innerHTML = ""

    if (announcements.length === 0) {
      announceList.innerHTML = `<p class="text-sm opacity-80">No announcements yet.</p>`
      return
    }

    announcements
      .slice()
      .reverse()
      .forEach((a) => {
        const div = document.createElement("div")
        div.className = "bg-white text-black p-3 rounded-lg shadow flex justify-between items-start"
        div.innerHTML = `
        <div>
          <h3 class="font-bold text-red-600">${a.title}</h3>
          <p class="text-sm">${a.desc}</p>
          <p class="text-xs text-gray-500 mt-1">${a.date}</p>
        </div>
        <button class="text-red-600 font-bold hover:text-red-800" data-id="${a.id}">✕</button>
      `
        announceList.appendChild(div)
      })

    // Delete button
    announceList.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number.parseInt(e.target.dataset.id)
        let announcements = JSON.parse(localStorage.getItem("announcements") || "[]")
        announcements = announcements.filter((a) => a.id !== id)
        localStorage.setItem("announcements", JSON.stringify(announcements))
        loadAnnouncementsAdmin()
      })
    })
  }

  if (announceList) loadAnnouncementsAdmin()

  // DASHBOARD PAGE
  const dashboardAnnouncements = document.getElementById("announcements")

  if (dashboardAnnouncements) {
    function renderAnnouncements() {
      const announcements = JSON.parse(localStorage.getItem("announcements") || "[]")
      dashboardAnnouncements.innerHTML = ""

      if (announcements.length === 0) {
        dashboardAnnouncements.innerHTML = `
          <div class="w-full sm:w-80 md:w-96 lg:w-[28rem] p-6 bg-white text-gray-900 rounded-2xl shadow">
            <h2 class="text-xl font-semibold text-red-700 mb-2">No Announcements Yet</h2>
            <p>Announcements from admin will appear here.</p>
          </div>
        `
        return
      }

      announcements
        .slice()
        .reverse()
        .forEach((a) => {
          const card = document.createElement("div")
          card.className =
            "w-full sm:w-80 md:w-96 lg:w-[28rem] p-6 bg-white text-gray-900 rounded-2xl shadow hover:shadow-lg transition"
          card.innerHTML = `
          <h2 class="text-xl font-semibold text-red-700 mb-2">${a.title}</h2>
          <p>${a.desc}</p>
          <p class="text-xs text-gray-500 mt-2">Posted on ${a.date}</p>
        `
          dashboardAnnouncements.appendChild(card)
        })
    }

    renderAnnouncements()

    window.addEventListener("storage", (event) => {
      if (event.key === "announcements") {
        renderAnnouncements()
      }
    })
  }
})
