document.addEventListener("DOMContentLoaded", () => {
  const body = document.body
  const navbarContainer = document.getElementById("navbar-container")
  const footerContainer = document.getElementById("footer-container")

  // =================== LOGIN / SIGNUP ===================
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  window.showSignup = () => {
    loginForm?.classList.remove("active")
    setTimeout(() => signupForm?.classList.add("active"), 200)
  }

  window.showLogin = () => {
    signupForm?.classList.remove("active")
    setTimeout(() => loginForm?.classList.add("active"), 200)
  }

  window.handleLogin = () => {
    const email = document.getElementById("loginEmail")
    const password = document.getElementById("loginPassword")
    const loginButton = loginForm?.querySelector("button")
    const errorMessage = document.getElementById("error-message")

    if (!email?.checkValidity()) {
      email?.reportValidity()
      return
    }
    if (!password?.checkValidity()) {
      password?.reportValidity()
      return
    }

    if (loginButton) {
      loginButton.disabled = true
      loginButton.textContent = "Logging in..."
    }
    if (errorMessage) errorMessage.textContent = ""

    setTimeout(() => {
      const loginSuccess = false // Replace with real auth logic
      if (loginSuccess) {
        window.location.href = "dashboard.html"
      } else {
        if (errorMessage) errorMessage.textContent = "Incorrect email or password!"
        if (loginButton) {
          loginButton.disabled = false
          loginButton.textContent = "Login"
        }
      }
    }, 1000)
  }

  window.handleSignup = () => {
    const role = document.getElementById("signupRole")
    const first = document.getElementById("firstName")
    const last = document.getElementById("lastName")
    const email = document.getElementById("signupEmail")
    const password = document.getElementById("signupPassword")
    const registerButton = signupForm?.querySelector("button")

    if (
      !role?.checkValidity() ||
      !first?.checkValidity() ||
      !last?.checkValidity() ||
      !email?.checkValidity() ||
      !password?.checkValidity()
    ) {
      role?.checkValidity() || role?.reportValidity()
      first?.checkValidity() || first?.reportValidity()
      last?.checkValidity() || last?.reportValidity()
      email?.checkValidity() || email?.reportValidity()
      password?.checkValidity() || password?.reportValidity()
      return
    }

    if (registerButton) {
      registerButton.disabled = true
      registerButton.textContent = "Registering..."
    }

    setTimeout(() => {
      const Swal = window.Swal // Declare the Swal variable
      Swal.fire({
        title: "You are now registered!",
        text: `${first?.value} ${last?.value}, Welcome to UE Maintenance Services!`,
        icon: "success",
        confirmButtonText: "Cool!",
        confirmButtonColor: "#E43636",
      }).then(() => {
        window.showLogin()
        if (registerButton) {
          registerButton.disabled = false
          registerButton.textContent = "Register"
        }
        if (role) role.value = ""
        if (first) first.value = ""
        if (last) last.value = ""
        if (email) email.value = ""
        if (password) password.value = ""
      })
    }, 1000)
  }

  // =================== NAVBAR ===================
  if (navbarContainer) {
    fetch("includes/navbar.html")
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
        } else if (page === "admin") {
          adminNav?.classList.remove("hidden")
          dashboardNav?.classList.add("hidden")
          setupDarkMode("admin")
          setupNotifications()
        }
      })
      .catch((err) => console.error("Error loading navbar:", err))
  }

  // =================== DARK MODE ===================
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

    if (darkToggleDesktop) {
      darkToggleDesktop.addEventListener("change", (e) => {
        const isDark = e.target.checked
        setDarkMode(isDark)
        localStorage.setItem(darkKey, isDark)
        if (darkToggleMobile) darkToggleMobile.checked = isDark
      })
    }

    if (darkToggleMobile) {
      darkToggleMobile.addEventListener("change", (e) => {
        const isDark = e.target.checked
        setDarkMode(isDark)
        localStorage.setItem(darkKey, isDark)
        if (darkToggleDesktop) darkToggleDesktop.checked = isDark
      })
    }
  }

  // =================== MOBILE MENU ===================
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

  // =================== NOTIFICATIONS (ADMIN) ===================
  function setupNotifications() {
    const notifBtn = document.getElementById("notif-btn")
    const notifDropdown = document.getElementById("notif-dropdown")
    const notifCount = document.getElementById("notif-count")
    const notifList = document.getElementById("notif-list")
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

    function loadNotifications() {
      const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
      const activeReports = reports.filter((r) => r.status !== "Completed")
      notifCount.textContent = activeReports.length
      notifCount.classList.toggle("hidden", activeReports.length === 0)
      notifList.innerHTML = ""

      activeReports
        .slice()
        .reverse()
        .forEach((r) => {
          const li = document.createElement("li")
          li.id = `notif-${r.id}`
          li.className =
            "p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ease-in-out w-full select-none"

          let roomHTML = ""
          let floorHTML = ""
          if (r.facilityType === "Room") {
            roomHTML = `<p class="text-sm">Room No.: ${r.roomNumber || "N/A"}</p>`
          } else if (["CR", "Elevator", "Library", "Escalator"].includes(r.facilityType)) {
            floorHTML = `<p class="text-sm">Floor: ${r.floor || "N/A"}</p>`
          }

          li.innerHTML = `
          <p class="font-semibold text-red-600">${r.title}</p>
          <p class="text-sm">Building: ${r.buildingName || "N/A"}</p>
          <p class="text-sm">Facility Type: ${r.facilityType || "N/A"}</p>
          ${roomHTML}
          ${floorHTML}
          <p class="text-sm">${r.description || "N/A"}</p>
          <p class="text-xs text-gray-500 mt-1">${r.status}</p>
        `
          notifList.appendChild(li)
        })
    }

    loadNotifications()
    window.addEventListener("storage", (e) => {
      if (e.key === "maintenanceReports") loadNotifications()
    })
    setInterval(loadNotifications, 2000)
  }

  // FACILITY / FLOOR / ROOM LOGIC
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

  // REPORT SUBMISSION (DASHBOARD)
  const reportForm = document.getElementById("reportForm")
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const title = document.getElementById("reportTitle")?.value.trim()
      const building = document.getElementById("reportBldg")?.value.trim()
      const facility = document.getElementById("facilityType")?.value.trim()
      const room = document.getElementById("reportRoom")?.value.trim()
      const floor = document.getElementById("reportFloor")?.value.trim()
      const desc = document.getElementById("reportDesc")?.value.trim()
      const fileInput = document.getElementById("reportFile")

      if (!title || !building || !desc) return
      if (facility === "Room" && !room) return
      if ((facility === "CR" || facility === "Comfort Room") && !floor) return

      const file = fileInput?.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        const newReport = {
          id: Date.now(),
          title,
          buildingName: building,
          facilityType: facility,
          floor: facility === "CR" || facility === "Comfort Room" ? floor : null,
          roomNumber: facility === "Room" ? room : null,
          description: desc,
          fileName: file?.name || null,
          fileData: file ? reader.result : null,
          status: "Pending",
          dateSubmitted: new Date().toLocaleString(),
          name: "Unknown",
        }

        const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
        reports.push(newReport)
        localStorage.setItem("maintenanceReports", JSON.stringify(reports))

        const Swal = window.Swal
        Swal.fire({
          title: "Report Submitted!",
          text: `Your report "${title}" has been submitted successfully.`,
          icon: "success",
          confirmButtonText: "OK!",
          confirmButtonColor: "#E43636",
        }).then(() => reportForm.reset())
      }

      if (file) reader.readAsDataURL(file)
      else reader.onload()
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

  if (body.dataset.page === "admin") loadAdminReports()

  // ADMIN REQUEST LIST DISPLAY 
  const requestsList = document.getElementById("requestsList")
  if (requestsList) {
    window.loadReports = (currentFilter = "All") => {
      const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
      requestsList.innerHTML = ""

      let pending = 0,
        inProgress = 0,
        completed = 0

      reports.forEach((r) => {
        if (r.status === "Pending") pending++
        else if (r.status === "In Progress") inProgress++
        else if (r.status === "Completed") completed++

        if (currentFilter !== "All" && r.status !== currentFilter) return

        const li = document.createElement("li")
        li.className = "bg-white text-black p-3 rounded-lg flex justify-between items-center"

        let roomFloorHTML = ""
        if (r.facilityType === "Room") {
          roomFloorHTML = `<p class="text-sm">Room No. : ${r.roomNumber || "N/A"}</p>`
        } else if (["CR", "Elevator", "Library", "Escalator"].includes(r.facilityType)) {
          roomFloorHTML = `<p class="text-sm">Floor : ${r.floor || "N/A"}</p>`
        }

        li.innerHTML = `
          <div>
            <p class="font-semibold text-red-600">${r.title}</p>
            <p class="text-sm">Bldg Name : ${r.buildingName || "N/A"}</p>
            <p class="text-sm">Facility Type : ${r.facilityType || "N/A"}</p>
            ${roomFloorHTML}
            <p class="text-sm">${r.description || "N/A"}</p>
            ${r.fileData ? `<a href="${r.fileData}" download="${r.fileName}" class="text-sm text-blue-600 underline">Attached File</a>` : ""}
            <p class="text-xs text-gray-600">Reported by: ${r.name || "Unknown"}</p>
            <p class="text-xs text-gray-500">Date: ${r.dateSubmitted || "N/A"}</p>
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
      const totalEl = document.getElementById("totalRequests")
      const pendingEl = document.getElementById("pendingCount")
      const inProgEl = document.getElementById("inProgressCount")
      const complEl = document.getElementById("completedCount")

      if (totalEl) totalEl.textContent = reports.length
      if (pendingEl) pendingEl.textContent = pending
      if (inProgEl) inProgEl.textContent = inProgress
      if (complEl) complEl.textContent = completed

      // Status change listener
      document.querySelectorAll(".statusSelect").forEach((select) => {
        select.addEventListener("change", (e) => {
          const id = Number(e.target.dataset.id)
          const reports = JSON.parse(localStorage.getItem("maintenanceReports") || "[]")
          const report = reports.find((r) => r.id === id)
          if (report) report.status = e.target.value
          localStorage.setItem("maintenanceReports", JSON.stringify(reports))
          window.loadReports(currentFilter)
        })
      })

      // Filter dropdown
      const statusFilter = document.getElementById("statusFilter")
      if (statusFilter) {
        statusFilter.value = currentFilter
        statusFilter.addEventListener("change", () => {
          window.loadReports(statusFilter.value)
        })
      }
    }

    if (window.loadReports) window.loadReports()

    window.addEventListener("storage", (event) => {
      if (event.key === "maintenanceReports" && window.loadReports) {
        window.loadReports()
      }
    })
  }

  // FOOTER
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
  const announceList = document.getElementById("announcementList")
  const announceTitle = document.getElementById("announceTitle")
  const announceDesc = document.getElementById("announceDesc")

  window.toggleAnnouncementForm = () => {
    const form = document.getElementById("announcementForm")
    if (form) form.classList.toggle("hidden")
  }

  window.addAnnouncement = () => {
    if (!announceTitle?.checkValidity()) {
      announceTitle?.reportValidity()
      return
    }
    if (!announceDesc?.checkValidity()) {
      announceDesc?.reportValidity()
      return
    }

    const title = announceTitle.value.trim()
    const desc = announceDesc.value.trim()

    const newAnnouncement = {
      id: Date.now(),
      title,
      desc,
      date: new Date().toLocaleString(),
    }

    const announcements = JSON.parse(localStorage.getItem("announcements") || "[]")
    announcements.push(newAnnouncement)
    localStorage.setItem("announcements", JSON.stringify(announcements))

    if (announceTitle) announceTitle.value = ""
    if (announceDesc) announceDesc.value = ""
    window.toggleAnnouncementForm()
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

  // ANNOUNCEMENTS (DASHBOARD)
  const dashboardAnnouncements = document.getElementById("announcements")

  if (dashboardAnnouncements) {
    function renderAnnouncements() {
      const announcements = JSON.parse(localStorage.getItem("announcements") || "[]")
      dashboardAnnouncements.innerHTML = ""

      if (announcements.length === 0) {
        dashboardAnnouncements.innerHTML = `
          <div class="card w-full sm:w-80 md:w-96 lg:w-[28rem] p-6 bg-white text-gray-900 rounded-2xl shadow">
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
            "card w-full sm:w-80 md:w-96 lg:w-[28rem] p-6 bg-white text-gray-900 rounded-2xl shadow hover:shadow-lg transition"
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
