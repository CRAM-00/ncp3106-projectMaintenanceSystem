<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student/Teacher Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="assets/style/style.css">
</head>

<body data-page="dashboard" class="light-mode transition-colors duration-500 font-sans">

  <!-- NAVBAR -->
  <div id="navbar-container"></div>

  <!-- Background -->
  <img src="assets/images/uelogo.png"
       alt="UE Logo"
       class="absolute inset-0 w-full h-full object-cover opacity-10 -z-10">

  <!-- DASHBOARD CONTENT -->
  <section id="dashboard-content"
           class="pt-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6 overflow-x-hidden">

    <!-- ANNOUNCEMENTS -->
<div id="announcements-section" class="flex flex-col w-full">
  <h1 class="text-4xl font-bold mb-6 text-center w-full">📢 Announcements</h1>

  <div
    id="announcements"
    class="flex flex-col items-center space-y-3 overflow-y-auto pr-2
           scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg w-full"
  >
    <h2 class="text-xl font-semibold text-red-700 mb-2 text-center">
      System Maintenance Notice
    </h2>
  </div>
</div>

    <!-- REPORT A PROBLEM -->
    <div id="report-section" class="w-full">
      <h1 class="text-4xl font-bold mb-6 text-center w-full">🛠 Report a Problem</h1>
      <form id="reportForm" class="card bg-white text-gray-900 p-6 rounded-2xl shadow flex flex-col gap-4 w-full">

        <label class="font-semibold">Problem Title</label>
        <input id="reportTitle" type="text" class="w-full border rounded-lg p-2 text-black" placeholder="Short description" required>

        <label class="font-semibold">Building Name</label>
        <select id="reportBldg" class="w-full border rounded-lg p-2 text-black" required>
          <option value="" disabled selected>Select Building</option>
          <option value="LB">LB</option>
          <option value="ED">ED</option>
          <option value="CIT">CIT</option>
          <option value="GYM">GYM</option>
          <option value="FD">FD</option>
        </select>

        <label class="font-semibold">Facility Type</label>
        <select id="facilityType" class="w-full border rounded-lg p-2 text-black" required>
          <option value="" disabled selected>Select Type</option>
          <option value="CR">Comfort Room (CR)</option>
          <option value="Room">Room</option>
          <option value="Elevator">Elevator</option>
          <option value="Escalator">Escalator</option>
          <option value="Library">Library</option>
        </select>

        <!-- Dynamic sections -->
        <div id="floorContainer" class="hidden">
          <label class="font-semibold">Floor</label>
          <select id="reportFloor" class="w-full border rounded-lg p-2 text-black"></select>
        </div>

        <div id="roomContainer" class="hidden">
          <label class="font-semibold">Room No.</label>
          <input id="reportRoom" type="text" class="w-full border rounded-lg p-2 text-black" placeholder="Enter room number">
        </div>

        <label class="font-semibold">Problem Description</label>
        <textarea id="reportDesc" class="w-full border rounded-lg p-2 text-black" rows="4" placeholder="Describe the issue" required></textarea>

        <label class="font-semibold">Attach Image</label>
        <input id="reportFile" type="file" accept="image/*" class="w-full border rounded-lg p-2 text-black" required>
        <p class="text-xs text-gray-500 mt-1">You can select an image or take a photo with your camera.</p>

        <button type="submit" class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          Submit Report
        </button>
      </form>
    </div>
  </section>

  <!-- About IT Department -->
  <section id="about" class="pt-24 px-6 pb-20">
    <h1 class="text-4xl font-bold text-center mb-6">💻 About the IT Department</h1>
    <div class="card max-w-3xl mx-auto bg-white text-gray-900 p-6 rounded-2xl shadow text-center mb-2">
      <p>
        The IT Department is responsible for maintaining the university’s technology infrastructure,
        supporting maintenance requests, and ensuring smooth operations of all digital services.
      </p>
    </div>
  </section>

  <!-- PROFILE SECTION -->
<div class="form-card profile-card hidden" id="profileSection">
  <div class="profile-container">
    <div class="profile-pic-wrapper">
      <img id="profilePreview" src="assets/images/default-profile.png" alt="Profile Picture" class="profile-pic" />
      <input type="file" id="profileUpload" accept="image/*" hidden />
      <button type="button" id="changePicBtn" class="change-pic-btn">Change Picture</button>
    </div>

    <div class="profile-details">
      <p id="profileName" class="profile-name">First Last</p>
    </div>
  </div>
</div>


  <!-- FOOTER -->
  <div id="footer-container"></div>

  <!-- SweetAlert2 -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <!-- Dynamic Script -->
  <script src="assets/js/script.js"></script>

</body>
</html>
