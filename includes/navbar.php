<nav id="dashboard-nav" class="fixed top-0 left-0 w-full bg-red-600/95 backdrop-blur-md shadow-md z-50">
  <div class="mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 w-full">

      <!-- University Title -->
      <a href="#" class="text-white text-xl font-bold">University of the East - Manila</a>

      <!-- Desktop Right Side -->
      <div class="hidden md:flex items-center space-x-6 text-white ml-auto">
        <!-- Profile Section -->
        <div id="profileSection" class="flex items-center space-x-3 bg-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 transition">
          <img id="dashboardProfilePic"
               src="assets/images/unknown.jpg"
               alt="Profile"
               class="w-8 h-8 rounded-full border-2 border-white object-cover" />
          <span id="dashboardUserName" class="font-medium">User Name</span>
        </div>

        <!-- Dark Mode Toggle -->
        <label class="relative inline-block w-14 h-8 -ml-1">
          <input type="checkbox" id="darkModeToggleDashboard" class="hidden">
          <span class="absolute inset-0 rounded-full bg-yellow-400 transition-colors duration-500 cursor-pointer flex items-center">
            <span id="sliderCircleDashboard"
              class="flex items-center justify-center w-6 h-6 ml-1 rounded-full shadow-md text-lg transition-transform duration-500">
              ☀️
            </span>
          </span>
        </label>

        <!-- Logout -->
        <button id="dashboardlogoutBtn" title="Log Out"
          class="p-2 rounded-full bg-white text-red-600 hover:bg-red-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </button>
      </div>

      <!-- Hamburger Menu (Mobile) -->
      <button id="menu-btn" class="md:hidden text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  <!-- MOBILE MENU -->
<div id="mobile-menu" class="hidden bg-white dark:bg-gray-900">
  <div id="mobileProfileSection" class="flex flex-col items-center py-4 cursor-pointer">
    <img id="mobileProfilePic" 
         src="assets/images/unknown.jpg" 
         alt="Profile Picture"
         class="w-16 h-16 rounded-full border-2 border-red-500 object-cover" />
    <p id="mobileUserName" 
       class="mt-2 text-gray-800 dark:text-white text-sm font-semibold">
       User Name
    </p>
  </div>

    <div class="flex justify-center items-center py-2 border-t border-gray-300">
      <label class="relative inline-block w-14 h-8">
        <input type="checkbox" id="darkModeToggleMobile" class="hidden">
        <span class="absolute inset-0 rounded-full bg-yellow-400 transition-colors duration-500 cursor-pointer flex items-center">
          <span id="sliderCircleMobile"
            class="flex items-center justify-center w-6 h-6 ml-1 rounded-full shadow-md text-lg transition-transform duration-500">
            ☀️
          </span>
        </span>
      </label>
    </div>

<div class="px-6 pb-6">
  <button id="dashboardlogoutBtn"
    class="relative w-full flex items-center justify-center gap-2 
           bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold 
           py-3 rounded-xl shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-600 
           active:scale-[0.98] transition-all duration-200 ease-in-out">
    
    <!-- Logout Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
         viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
         class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" 
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>

    <span>Logout</span>

    <!-- Decorative Pulse Effect -->
    <span class="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition"></span>
  </button>
</div>
  </div>
</nav>

<!-- VIEW / CHANGE PROFILE PICTURE MODAL -->
<div id="profileModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
  <div id="viewProfileModal" class="hidden fixed inset-0 bg-black/80 flex items-center justify-center z-[1100]">
  <div class="relative">
    <!-- Close Button -->
    <button id="closeViewProfileModal" 
            class="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-red-400 transition">
      &times;
    </button>

    <!-- Full Image Preview -->
    <img id="viewProfileImage" src="assets/images/unknown.jpg" 
         class="max-w-[90vw] max-h-[80vh] rounded-2xl border-4 border-white shadow-lg object-contain" 
         alt="Full Profile Picture">

         
  </div>
</div>
  <div class="bg-white rounded-2xl shadow-lg w-80 p-6 text-center relative">
    <button id="closeProfileModal" class="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl">&times;</button>

    <img id="modalProfilePic" src="assets/images/unknown.jpg" 
         class="w-24 h-24 mx-auto rounded-full border-4 border-red-600 object-cover mb-3 cursor-pointer" 
         alt="Profile Picture">

<h2 id="modalUserName" class="text-lg font-semibold mb-3 text-black !text-black">User Name</h2>


    <button id="changeProfilePicBtn" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
      Change Picture
    </button>

    <input id="editProfilePicInput" type="file" accept="image/*" hidden>
  </div>
</div>



<!-- ADMIN NAVBAR -->
<nav id="admin-nav" class="fixed top-0 left-0 w-full bg-red-600/95 backdrop-blur-md shadow-md z-50">
  <div class="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
    <a href="#" class="text-white font-bold text-lg sm:text-xl ">
      University of the East - Manila
    </a>

    

        <div class="flex items-center space-x-3">
      <!-- Notification Icon -->
      <div class="relative">
        <button id="notif-btn" class="relative focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span id="notif-count"
            class="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
            0
          </span>
        </button>

        <!-- Notification Dropdown -->
        <div id="notif-dropdown"
  class="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg overflow-hidden origin-top transform scale-y-0 opacity-0 pointer-events-none transition-all duration-300 ease-out">

          <div class="p-3 border-b border-gray-300 font-semibold text-red-600">
            Notifications
          </div>
          <ul id="notif-list" class="max-h-64 overflow-y-auto divide-y divide-gray-200"></ul>
        </div>
      </div>

    <!-- Dark Mode Toggle -->
    <label class="relative inline-block w-14 h-8">
      <input type="checkbox" id="darkModeToggleAdmin" class="hidden">
      <span class="absolute inset-0 rounded-full bg-yellow-400 transition-colors duration-500 cursor-pointer flex items-center">
        <span id="sliderCircleAdmin"
          class="flex items-center justify-center w-6 h-6 ml-1 rounded-full shadow-md text-lg transition-transform duration-500">
          ☀️
        </span>
      </span>
    </label>
            <!-- Logout Button -->
        <button id="adminlogoutBtn" title="Log Out" 
          class="p-2 rounded-full bg-white text-red-600 hover:bg-red-100 transition">
          <!-- Lucide Logout Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </button>
  </div>
</nav>

<script src="assets/js/script.js"></script>
