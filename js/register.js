// Registration page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Add a small delay to ensure all scripts are loaded
  setTimeout(() => {
    initializeRegistrationPage();
  }, 100);
});

function initializeRegistrationPage() {
  setupFormHandlers();
  setupPatientTypeHandler();
  loadSavedData();
}

function setupPatientTypeHandler() {
  const patientTypeSelect = document.getElementById("patientType");
  const pregnancyWeeksGroup = document.getElementById("pregnancyWeeksGroup");
  const babyAgeGroup = document.getElementById("babyAgeGroup");
  const clinicSelection = document.getElementById("clinicSelection");

  if (!patientTypeSelect) return;

  patientTypeSelect.addEventListener("change", function () {
    const selectedType = this.value;

    // Show/hide relevant fields
    if (selectedType === "pregnant") {
      pregnancyWeeksGroup.style.display = "block";
      babyAgeGroup.style.display = "none";
      pregnancyWeeksGroup.querySelector("input").required = true;
      babyAgeGroup.querySelector("input").required = false;
    } else if (selectedType === "mother_with_infant") {
      pregnancyWeeksGroup.style.display = "none";
      babyAgeGroup.style.display = "block";
      pregnancyWeeksGroup.querySelector("input").required = false;
      babyAgeGroup.querySelector("input").required = true;
    } else {
      pregnancyWeeksGroup.style.display = "none";
      babyAgeGroup.style.display = "none";
      pregnancyWeeksGroup.querySelector("input").required = false;
      babyAgeGroup.querySelector("input").required = false;
    }

    // Update clinic selection
    populateClinicSelection(selectedType);
  });
}

function populateClinicSelection(patientType) {
  const clinicSelection = document.getElementById("clinicSelection");

  if (!clinicSelection || !patientType) {
    if (clinicSelection) {
      clinicSelection.innerHTML =
        '<p style="color: var(--text-secondary);">Please select patient category first</p>';
    }
    return;
  }

  // Check if hospitalAPI is available
  if (typeof hospitalAPI === "undefined") {
    clinicSelection.innerHTML =
      '<p style="color: var(--text-secondary);">Loading doctors...</p>';
    return;
  }

  const doctors = hospitalAPI.getDoctorsByClinicType(patientType);
  const clinic = hospitalAPI.getClinicByType(patientType);

  if (!doctors.length || !clinic) {
    clinicSelection.innerHTML =
      '<p style="color: var(--text-secondary);">No doctors available for selected category</p>';
    return;
  }

  clinicSelection.innerHTML = `
    <div class="clinic-info">
      <h4>${clinic.name}</h4>
      <p>${clinic.description}</p>
    </div>
    <div class="doctor-selection">
      ${doctors
        .map(
          (doctor) => `
        <div class="doctor-card" data-doctor-id="${doctor.id}">
          <input type="radio" id="doctor-${doctor.id}" name="doctorId" value="${doctor.id}" required>
          <label for="doctor-${doctor.id}" class="doctor-info">
            <div class="doctor-name">${doctor.name}</div>
            <div class="doctor-specialty">${doctor.specialty}</div>
            <div class="doctor-day">${doctor.day}</div>
          </label>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // Add click handlers for doctor cards
  const doctorCards = clinicSelection.querySelectorAll(".doctor-card");
  doctorCards.forEach((card) => {
    card.addEventListener("click", function () {
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;

      // Update visual selection
      doctorCards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");

      // Save selection
      if (typeof saveToLocalStorage === "function") {
        saveToLocalStorage("selectedDoctorId", radio.value);
      }
    });
  });
}

function setupFormHandlers() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  form.addEventListener("submit", handleFormSubmission);

  // Save form data as user types
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("input", saveFormData);
    input.addEventListener("change", saveFormData); // For select elements
  });

  // Auto-format phone number
  const phoneInput = document.getElementById("patientPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", formatPhoneNumber);
  }
}

function handleFormSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate form
  if (!validateRegistrationForm(form)) {
    showNotification("Please fill in all required fields correctly.", "error");
    return;
  }

  // Check if patient type is selected
  const patientType = form.querySelector('select[name="patientType"]').value;
  if (!patientType) {
    showNotification("Please select patient category.", "error");
    return;
  }

  // Check if doctor is selected
  const selectedDoctor = form.querySelector('input[name="doctorId"]:checked');
  if (!selectedDoctor) {
    showNotification("Please select a doctor.", "error");
    return;
  }

  // Check acknowledgment checkbox
  const acknowledge = form.querySelector(
    'input[name="freeServiceAcknowledge"]'
  );
  if (!acknowledge || !acknowledge.checked) {
    showNotification("Please acknowledge the free service terms.", "error");
    return;
  }

  // Show loading state
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  // Collect form data
  const formData = new FormData(form);
  const patientData = {
    patientName: formData.get("patientName"),
    patientEmail: formData.get("patientEmail") || "",
    patientPhone: formData.get("patientPhone"),
    patientAge: parseInt(formData.get("patientAge")),
    nicNumber: formData.get("nicNumber"),
    patientType: formData.get("patientType"),
    pregnancyWeeks: formData.get("pregnancyWeeks")
      ? parseInt(formData.get("pregnancyWeeks"))
      : null,
    babyAge: formData.get("babyAge") ? parseInt(formData.get("babyAge")) : null,
    doctorId: parseInt(formData.get("doctorId")),
    appointmentReason: formData.get("appointmentReason"),
    freeServiceAcknowledge: formData.get("freeServiceAcknowledge") === "on",
  };

  // Simulate API call delay
  setTimeout(() => {
    try {
      // Register patient using hospital API
      const registeredPatient = hospitalAPI.registerPatient(patientData);

      // Show success message
      showRegistrationSuccess(registeredPatient);

      // Clear form and saved data
      form.reset();
      clearSavedData();

      // Clear doctor selection
      const doctorCards = document.querySelectorAll(".doctor-card");
      doctorCards.forEach((card) => card.classList.remove("selected"));
    } catch (error) {
      console.error("Registration error:", error);
      showNotification("Registration failed. Please try again.", "error");
    } finally {
      // Remove loading state
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }, 1500); // Simulate network delay
}

function showRegistrationSuccess(patientData) {
  const form = document.getElementById("registrationForm");
  const successDiv = document.getElementById("registrationSuccess");
  const doctor = hospitalAPI.getDoctorById(patientData.doctorId);

  // Hide form and show success message
  form.style.display = "none";
  successDiv.style.display = "block";

  // Update success message with patient details
  successDiv.innerHTML = `
        <h3>Registration Successful!</h3>
        <div class="success-details">
            <p><strong>Patient:</strong> ${patientData.patientName}</p>
            <p><strong>Doctor:</strong> ${doctor.name}</p>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
            <p><strong>Clinic Day:</strong> ${doctor.day}</p>
            <p><strong>Queue Position:</strong> #${patientData.queuePosition}</p>
            <p><strong>Registration ID:</strong> ${patientData.id}</p>
        </div>
        <div class="success-actions">
            <a href="clinics.html" class="btn btn-secondary">Check Queue Status</a>
            <button onclick="registerAnother()" class="btn btn-secondary">Register Another Patient</button>
        </div>
    `;

  // Scroll to success message
  successDiv.scrollIntoView({ behavior: "smooth" });

  // Show notification
  showNotification(
    `Successfully registered! You are #${patientData.queuePosition} in queue for ${doctor.name}.`
  );
}

function registerAnother() {
  const form = document.getElementById("registrationForm");
  const successDiv = document.getElementById("registrationSuccess");

  // Show form and hide success message
  form.style.display = "block";
  successDiv.style.display = "none";

  // Scroll to top of form
  form.scrollIntoView({ behavior: "smooth" });
}

function formatPhoneNumber(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2");
  }

  e.target.value = value;
}

// Custom validation function for registration form
function validateRegistrationForm(form) {
  let isValid = true;
  const errors = [];

  // Clear previous errors
  form.querySelectorAll(".error-message").forEach((error) => error.remove());
  form
    .querySelectorAll(".form-group")
    .forEach((group) => group.classList.remove("error"));

  // Validate required fields
  const requiredFields = [
    { name: "patientName", label: "Mother's Full Name" },
    { name: "patientPhone", label: "Phone Number" },
    { name: "patientAge", label: "Mother's Age" },
    { name: "nicNumber", label: "NIC Number" },
    { name: "patientType", label: "Patient Category" },
  ];

  requiredFields.forEach((field) => {
    const input = form.querySelector(`[name="${field.name}"]`);
    const formGroup = input?.closest(".form-group");

    if (!input || !input.value.trim()) {
      isValid = false;
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = `${field.label} is required`;
        formGroup.appendChild(errorMsg);
      }
    }
  });

  // Validate conditional fields
  const patientType = form.querySelector('[name="patientType"]')?.value;

  if (patientType === "pregnant") {
    const pregnancyWeeks = form.querySelector('[name="pregnancyWeeks"]');
    const formGroup = pregnancyWeeks?.closest(".form-group");
    if (!pregnancyWeeks || !pregnancyWeeks.value) {
      isValid = false;
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Pregnancy weeks is required";
        formGroup.appendChild(errorMsg);
      }
    } else if (
      parseInt(pregnancyWeeks.value) < 1 ||
      parseInt(pregnancyWeeks.value) > 42
    ) {
      isValid = false;
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Pregnancy weeks must be between 1 and 42";
        formGroup.appendChild(errorMsg);
      }
    }
  }

  if (patientType === "mother_with_infant") {
    const babyAge = form.querySelector('[name="babyAge"]');
    const formGroup = babyAge?.closest(".form-group");
    if (!babyAge || !babyAge.value) {
      isValid = false;
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Baby's age is required";
        formGroup.appendChild(errorMsg);
      }
    } else if (parseInt(babyAge.value) < 0 || parseInt(babyAge.value) > 12) {
      isValid = false;
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Baby's age must be between 0 and 12 months";
        formGroup.appendChild(errorMsg);
      }
    }
  }

  // Validate email if provided
  const email = form.querySelector('[name="patientEmail"]');
  if (email && email.value && !isValidEmail(email.value)) {
    isValid = false;
    const formGroup = email.closest(".form-group");
    if (formGroup) {
      formGroup.classList.add("error");
      const errorMsg = document.createElement("span");
      errorMsg.className = "error-message";
      errorMsg.textContent = "Please enter a valid email address";
      formGroup.appendChild(errorMsg);
    }
  }

  // Validate phone number format (Sri Lankan mobile)
  const phone = form.querySelector('[name="patientPhone"]');
  if (phone && phone.value) {
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phone.value.replace(/\D/g, ""))) {
      isValid = false;
      const formGroup = phone.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent =
          "Please enter a valid Sri Lankan mobile number (07XXXXXXXX)";
        formGroup.appendChild(errorMsg);
      }
    }
  }

  // Validate NIC number format
  const nic = form.querySelector('[name="nicNumber"]');
  if (nic && nic.value) {
    const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
    if (!nicRegex.test(nic.value)) {
      isValid = false;
      const formGroup = nic.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent =
          "Please enter a valid NIC number (XXXXXXXXXV or XXXXXXXXXXXX)";
        formGroup.appendChild(errorMsg);
      }
    }
  }

  // Validate age range
  const age = form.querySelector('[name="patientAge"]');
  if (age && age.value) {
    const ageValue = parseInt(age.value);
    if (ageValue < 15 || ageValue > 50) {
      isValid = false;
      const formGroup = age.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Age must be between 15 and 50 years";
        formGroup.appendChild(errorMsg);
      }
    }
  }

  return isValid;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function saveFormData() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  const formData = {
    patientName: form.patientName?.value || "",
    patientEmail: form.patientEmail?.value || "",
    patientPhone: form.patientPhone?.value || "",
    patientAge: form.patientAge?.value || "",
    nicNumber: form.nicNumber?.value || "",
    patientType: form.patientType?.value || "",
    pregnancyWeeks: form.pregnancyWeeks?.value || "",
    babyAge: form.babyAge?.value || "",
    appointmentReason: form.appointmentReason?.value || "",
  };

  saveToLocalStorage("registrationFormData", formData);
}

function loadSavedData() {
  const savedData = getFromLocalStorage("registrationFormData");
  const selectedDoctorId = getFromLocalStorage("selectedDoctorId");

  if (savedData) {
    const form = document.getElementById("registrationForm");
    Object.keys(savedData).forEach((key) => {
      const input = form[key];
      if (input && savedData[key]) {
        input.value = savedData[key];
      }
    });

    // Trigger patient type change if saved
    if (savedData.patientType) {
      const patientTypeSelect = form.patientType;
      if (patientTypeSelect) {
        patientTypeSelect.dispatchEvent(new Event("change"));
      }
    }
  }

  // Load doctor selection after a short delay to ensure clinic selection is populated
  if (selectedDoctorId) {
    setTimeout(() => {
      const radio = document.querySelector(
        `input[value="${selectedDoctorId}"]`
      );
      const card = document.querySelector(
        `[data-doctor-id="${selectedDoctorId}"]`
      );

      if (radio && card) {
        radio.checked = true;
        card.classList.add("selected");
      }
    }, 100);
  }
}

function clearSavedData() {
  localStorage.removeItem("registrationFormData");
  localStorage.removeItem("selectedDoctorId");
}

// Auto-save form data every 30 seconds
setInterval(saveFormData, 30000);
