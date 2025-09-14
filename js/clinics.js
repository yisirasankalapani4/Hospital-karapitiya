// Clinics page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeClinicsPage();
});

function initializeClinicsPage() {
  displayClinics();
  setupModalHandlers();

  // Update display every minute to simulate real-time updates
  setInterval(updateClinicsDisplay, 60000);
}

function displayClinics() {
  const clinicsGrid = document.getElementById("clinicsGrid");
  if (!clinicsGrid) return;

  const clinics = hospitalAPI.getClinics();

  clinicsGrid.innerHTML = clinics
    .map((clinic) => {
      const doctors = clinic.doctors;
      const totalPatients = doctors.reduce((total, doctor) => {
        const queue = hospitalAPI.getQueue(doctor.id);
        return total + queue.length;
      }, 0);

      const isAvailable = clinic.available;
      const status = isAvailable
        ? totalPatients > 15
          ? "busy"
          : "available"
        : "closed";

      return `
      <div class="clinic-card" data-clinic-id="${
        clinic.id
      }" onclick="showClinicModal(${clinic.id})">
        <div class="clinic-type">${clinic.name}</div>
        <div class="clinic-description">${clinic.description}</div>
        <div class="clinic-doctors">
          <strong>Available Doctors:</strong>
          ${doctors
            .map(
              (doctor) =>
                `<div class="doctor-item">${doctor.name} (${doctor.day})</div>`
            )
            .join("")}
        </div>
        <div class="clinic-status">
          <div class="status-indicator status-${status}">
            <div class="status-dot"></div>
            <span>${getStatusText(status)}</span>
          </div>
          <div class="queue-count">${totalPatients} total patients</div>
        </div>
      </div>
    `;
    })
    .join("");
}

function updateClinicsDisplay() {
  displayClinics();

  // If modal is open, update it too
  const modal = document.getElementById("queueModal");
  if (modal && modal.classList.contains("show")) {
    const doctorId = modal.getAttribute("data-current-doctor");
    if (doctorId) {
      updateQueueModal(parseInt(doctorId));
    }
  }
}

function getStatusText(status) {
  switch (status) {
    case "available":
      return "Available";
    case "busy":
      return "Busy";
    case "closed":
      return "Closed";
    default:
      return "Unknown";
  }
}

function showClinicModal(clinicId) {
  const modal = document.getElementById("queueModal");
  const clinic = hospitalAPI.getClinics().find((c) => c.id === clinicId);

  if (!modal || !clinic) return;

  // Instead of showing modal, show weekly schedule for the clinic
  showWeeklySchedule(clinicId);
}

function showWeeklySchedule(clinicId) {
  const clinicsGrid = document.getElementById("clinicsGrid");
  const clinic = hospitalAPI.getClinics().find((c) => c.id === clinicId);

  if (!clinic || !clinicsGrid) return;

  // Create back button and weekly schedule display
  const weeklyScheduleHTML = `
    <div class="weekly-schedule-container">
      <div class="schedule-header">
        <button class="btn btn-secondary" onclick="displayClinics()" id="backToClinicBtn">
          ← Back to Clinics
        </button>
        <h3>${clinic.name} - Weekly Schedule</h3>
        <p>${clinic.description}</p>
      </div>
      <div class="weekly-cards">
        ${generateWeeklyCards(clinic)}
      </div>
    </div>
  `;

  clinicsGrid.innerHTML = weeklyScheduleHTML;
}

function generateWeeklyCards(clinic) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return days
    .map((day) => {
      const doctor = clinic.doctors.find((doc) => doc.day === day);

      if (!doctor) {
        return `
        <div class="day-card unavailable">
          <div class="day-header">
            <h4>${day}</h4>
            <span class="status-badge closed">Closed</span>
          </div>
          <div class="day-content">
            <p class="no-doctor">No doctor available</p>
          </div>
        </div>
      `;
      }

      const queue = hospitalAPI.getQueue(doctor.id);
      const currentPatient = queue.find((patient) => patient.isCurrentPatient);
      const estimatedWait = hospitalAPI.getEstimatedWaitTime(doctor.id);
      const queueLength = queue.length;

      const status =
        queueLength === 0 ? "available" : queueLength > 5 ? "busy" : "moderate";
      const statusText =
        queueLength === 0 ? "Available" : queueLength > 5 ? "Busy" : "Moderate";

      return `
      <div class="day-card available" onclick="showDayDetails(${
        doctor.id
      })" data-doctor-id="${doctor.id}">
        <div class="day-header">
          <h4>${day}</h4>
          <span class="status-badge ${status}">${statusText}</span>
        </div>
        <div class="day-content">
          <div class="doctor-info">
            <h5>${doctor.name}</h5>
            <p class="specialty">${doctor.specialty}</p>
          </div>
          <div class="queue-stats">
            <div class="stat-item">
              <span class="stat-number">${
                currentPatient ? currentPatient.position : "-"
              }</span>
              <span class="stat-label">Current Patient</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${queueLength}</span>
              <span class="stat-label">In Queue</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${estimatedWait}</span>
              <span class="stat-label">Wait (min)</span>
            </div>
          </div>
        </div>
        <div class="day-actions">
          <span class="view-details">Click to view queue details</span>
        </div>
      </div>
    `;
    })
    .join("");
}

function showDayDetails(doctorId) {
  const modal = document.getElementById("queueModal");
  const doctor = hospitalAPI.getDoctorById(doctorId);

  if (!modal || !doctor) return;

  // Set current doctor ID for updates
  modal.setAttribute("data-current-doctor", doctorId);

  // Update modal header with doctor and day info
  document.getElementById(
    "modalDoctorName"
  ).textContent = `${doctor.name} - ${doctor.day}`;

  // Update queue information
  updateQueueModal(doctorId);

  // Show modal
  modal.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function updateClinicModal(clinicId) {
  const clinic = hospitalAPI.getClinics().find((c) => c.id === clinicId);
  if (!clinic) return;

  const doctors = clinic.doctors;
  let totalPatients = 0;
  let currentlyServing = 0;
  let totalWaitTime = 0;

  // Calculate clinic-wide statistics
  doctors.forEach((doctor) => {
    const queue = hospitalAPI.getQueue(doctor.id);
    totalPatients += queue.length;
    if (queue.length > 0 && queue[0].isCurrentPatient) {
      currentlyServing++;
    }
    totalWaitTime += hospitalAPI.getEstimatedWaitTime(doctor.id);
  });

  const averageWait =
    doctors.length > 0 ? Math.round(totalWaitTime / doctors.length) : 0;

  // Update stats
  document.getElementById("currentPatient").textContent = currentlyServing;
  document.getElementById("queueLength").textContent = totalPatients;
  document.getElementById("estimatedWait").textContent = averageWait;

  // Do not update queue list - only summary should be displayed
}

// Keep the original function for backward compatibility
function showQueueModal(doctorId) {
  const modal = document.getElementById("queueModal");
  const doctor = hospitalAPI.getDoctorById(doctorId);

  if (!modal || !doctor) return;

  // Set current doctor ID for updates
  modal.setAttribute("data-current-doctor", doctorId);

  // Update modal header
  document.getElementById("modalDoctorName").textContent = doctor.name;

  // Update queue information
  updateQueueModal(doctorId);

  // Show modal
  modal.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function updateQueueModal(doctorId) {
  const queue = hospitalAPI.getQueue(doctorId);
  const currentPatient = queue.find((patient) => patient.isCurrentPatient);
  const estimatedWait = hospitalAPI.getEstimatedWaitTime(doctorId);

  // Update only summary stats (no patient names)
  document.getElementById("currentPatient").textContent = currentPatient
    ? currentPatient.position
    : "-";
  document.getElementById("queueLength").textContent = queue.length;
  document.getElementById("estimatedWait").textContent = estimatedWait;

  // Do not update queue list - only summary should be displayed
}

function setupModalHandlers() {
  const modal = document.getElementById("queueModal");
  const closeBtn = document.getElementById("closeModal");
  const refreshBtn = document.getElementById("refreshQueue");

  if (!modal) return;

  // Close modal handlers
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Refresh queue handler
  refreshBtn.addEventListener("click", function () {
    const doctorId = modal.getAttribute("data-current-doctor");
    if (doctorId) {
      // Add loading state to button
      this.textContent = "Refreshing...";
      this.disabled = true;

      // Simulate refresh delay
      setTimeout(() => {
        updateQueueModal(parseInt(doctorId));
        // Only update the modal, don't reset the clinics display

        // Remove loading state
        this.textContent = "Refresh Queue";
        this.disabled = false;

        showNotification("Queue status updated!");
      }, 1000);
    }
  });
}

function closeModal() {
  const modal = document.getElementById("queueModal");
  if (modal) {
    modal.classList.remove("show");
    modal.removeAttribute("data-current-doctor");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Simulate queue progression for demo purposes
function simulateQueueProgression() {
  setInterval(() => {
    const doctorIds = [1, 2, 3, 4, 5];

    doctorIds.forEach((doctorId) => {
      // 20% chance per doctor to advance their queue every 2 minutes
      if (Math.random() < 0.2) {
        hospitalAPI.advanceQueue(doctorId);
      }
    });

    // Update display if on clinics page
    if (window.location.pathname.includes("clinics.html")) {
      updateClinicsDisplay();
    }
  }, 120000); // Every 2 minutes
}

// Add some sample patients periodically for demo
function simulateNewPatients() {
  const sampleNames = [
    "Alex Morgan",
    "Taylor Swift",
    "Jordan Smith",
    "Casey Johnson",
    "Riley Davis",
    "Morgan Lee",
    "Quinn Wilson",
    "Avery Brown",
    "Sage Martinez",
    "River Garcia",
    "Phoenix Miller",
    "Skylar Anderson",
  ];

  setInterval(() => {
    // 30% chance to add a new patient every 5 minutes
    if (Math.random() < 0.3) {
      const randomDoctorId = Math.floor(Math.random() * 5) + 1;
      const randomName =
        sampleNames[Math.floor(Math.random() * sampleNames.length)];

      hospitalAPI.addToQueue(randomDoctorId, randomName);

      // Update display if on clinics page
      if (window.location.pathname.includes("clinics.html")) {
        updateClinicsDisplay();
      }
    }
  }, 300000); // Every 5 minutes
}

// Start simulations for demo purposes
simulateQueueProgression();
simulateNewPatients();

// Add real-time clock
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Add clock to page if it doesn't exist
  let clock = document.getElementById("live-clock");
  if (!clock) {
    clock = document.createElement("div");
    clock.id = "live-clock";
    clock.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 999;
            box-shadow: var(--shadow);
        `;
    document.body.appendChild(clock);
  }

  clock.textContent = `Current Time: ${timeString}`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call
