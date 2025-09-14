// Contact page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeContactPage();
});

function initializeContactPage() {
  setupContactForm();
  setupPhoneNumberFormatting();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", handleContactFormSubmission);

  // Real-time validation
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });
}

function setupPhoneNumberFormatting() {
  const phoneInput = document.getElementById("contactPhone");
  if (!phoneInput) return;

  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    // Format for Sri Lankan mobile numbers
    if (value.startsWith("0")) {
      if (value.length <= 10) {
        e.target.value = value;
      }
    } else if (value.startsWith("94")) {
      if (value.length <= 11) {
        e.target.value = "+" + value;
      }
    } else {
      e.target.value = value;
    }
  });
}

function handleContactFormSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate entire form
  if (!validateContactForm(form)) {
    showNotification("Please fill in all required fields correctly.", "error");
    return;
  }

  // Check for emergency inquiries
  const inquiryType = form.querySelector('[name="inquiryType"]').value;
  if (inquiryType === "emergency") {
    showEmergencyAlert();
    return;
  }

  // Show loading state
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  // Collect form data
  const formData = new FormData(form);
  const contactData = {
    inquiryType: formData.get("inquiryType"),
    contactName: formData.get("contactName"),
    contactPhone: formData.get("contactPhone"),
    contactEmail: formData.get("contactEmail") || "",
    contactMessage: formData.get("contactMessage"),
    privacyConsent: formData.get("privacyConsent") === "on",
    timestamp: new Date().toISOString(),
  };

  // Simulate form submission
  setTimeout(() => {
    try {
      // Store the inquiry (in a real app, this would send to server)
      saveContactInquiry(contactData);

      // Show success message
      showContactSuccess(contactData);

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      showNotification(
        "Failed to send message. Please try again or call directly.",
        "error"
      );
    } finally {
      // Remove loading state
      submitBtn.textContent = "Send Message";
      submitBtn.disabled = false;
    }
  }, 2000);
}

function validateContactForm(form) {
  let isValid = true;

  // Clear previous errors
  form.querySelectorAll(".error-message").forEach((error) => error.remove());
  form
    .querySelectorAll(".form-group")
    .forEach((group) => group.classList.remove("error"));

  // Required fields
  const requiredFields = [
    { name: "inquiryType", label: "Type of Inquiry" },
    { name: "contactName", label: "Your Name" },
    { name: "contactPhone", label: "Phone Number" },
    { name: "contactMessage", label: "Message" },
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

  // Validate phone number
  const phone = form.querySelector('[name="contactPhone"]');
  if (phone && phone.value) {
    const phoneRegex = /^(\+94|0)7\d{8}$/;
    if (!phoneRegex.test(phone.value.replace(/\s/g, ""))) {
      isValid = false;
      const formGroup = phone.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("error");
        const errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Please enter a valid Sri Lankan mobile number";
        formGroup.appendChild(errorMsg);
      }
    }
  }

  // Validate email if provided
  const email = form.querySelector('[name="contactEmail"]');
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

  // Check privacy consent
  const consent = form.querySelector('[name="privacyConsent"]');
  if (!consent || !consent.checked) {
    isValid = false;
    const formGroup = consent?.closest(".form-group");
    if (formGroup) {
      formGroup.classList.add("error");
      const errorMsg = document.createElement("span");
      errorMsg.className = "error-message";
      errorMsg.textContent = "Privacy consent is required";
      formGroup.appendChild(errorMsg);
    }
  }

  return isValid;
}

function validateField(field) {
  const formGroup = field.closest(".form-group");
  if (!formGroup) return;

  // Remove existing errors
  const existingError = formGroup.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
    formGroup.classList.remove("error");
  }

  // Validate based on field type
  let isValid = true;
  let errorMessage = "";

  if (field.required && !field.value.trim()) {
    isValid = false;
    errorMessage = "This field is required";
  } else if (
    field.type === "email" &&
    field.value &&
    !isValidEmail(field.value)
  ) {
    isValid = false;
    errorMessage = "Please enter a valid email address";
  } else if (field.name === "contactPhone" && field.value) {
    const phoneRegex = /^(\+94|0)7\d{8}$/;
    if (!phoneRegex.test(field.value.replace(/\s/g, ""))) {
      isValid = false;
      errorMessage = "Please enter a valid Sri Lankan mobile number";
    }
  }

  if (!isValid) {
    formGroup.classList.add("error");
    const errorMsg = document.createElement("span");
    errorMsg.className = "error-message";
    errorMsg.textContent = errorMessage;
    formGroup.appendChild(errorMsg);
  }
}

function showEmergencyAlert() {
  const alertModal = document.createElement("div");
  alertModal.className = "emergency-alert-modal";
  alertModal.innerHTML = `
    <div class="emergency-alert-content">
      <h3>🚨 Emergency Alert</h3>
      <p>For medical emergencies, please <strong>call directly</strong> instead of using this form:</p>
      <div class="emergency-numbers">
        <div class="emergency-number-item">
          <strong>Hospital Emergency:</strong> <a href="tel:+94912222261">+94 91 222 2261</a>
        </div>
        <div class="emergency-number-item">
          <strong>National Ambulance:</strong> <a href="tel:1990">1990</a>
        </div>
      </div>
      <p>This contact form is for non-urgent inquiries only.</p>
      <button onclick="closeEmergencyAlert()" class="btn btn-primary">I Understand</button>
    </div>
  `;

  document.body.appendChild(alertModal);

  // Style the modal
  alertModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  const content = alertModal.querySelector(".emergency-alert-content");
  content.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    margin: 1rem;
    text-align: center;
  `;
}

function closeEmergencyAlert() {
  const modal = document.querySelector(".emergency-alert-modal");
  if (modal) {
    modal.remove();
  }

  // Reset inquiry type
  const inquirySelect = document.getElementById("inquiryType");
  if (inquirySelect) {
    inquirySelect.value = "";
  }
}

function saveContactInquiry(contactData) {
  // Save to localStorage for demo purposes
  const inquiries = JSON.parse(
    localStorage.getItem("contactInquiries") || "[]"
  );
  contactData.id = Date.now();
  inquiries.push(contactData);
  localStorage.setItem("contactInquiries", JSON.stringify(inquiries));
}

function showContactSuccess(contactData) {
  const successMessage = `
    <div class="contact-success-modal">
      <div class="success-content">
        <h3>✅ Message Sent Successfully!</h3>
        <p>Thank you, <strong>${
          contactData.contactName
        }</strong>. Your inquiry has been received.</p>
        <div class="success-details">
          <p><strong>Inquiry Type:</strong> ${getInquiryTypeLabel(
            contactData.inquiryType
          )}</p>
          <p><strong>Reference ID:</strong> #${contactData.id}</p>
        </div>
        <div class="response-time-info">
          <h4>What happens next?</h4>
          <ul>
            <li><strong>Appointment requests:</strong> We'll call you within 24 hours</li>
            <li><strong>General inquiries:</strong> Response within 2-3 business days</li>
            <li><strong>Medical inquiries:</strong> Doctor will review and respond within 48 hours</li>
            <li><strong>Complaints:</strong> Investigation and response within 1 week</li>
          </ul>
        </div>
        <button onclick="closeSuccessModal()" class="btn btn-primary">Close</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", successMessage);

  // Style the modal
  const modal = document.querySelector(".contact-success-modal");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  const content = modal.querySelector(".success-content");
  content.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    margin: 1rem;
    max-height: 80vh;
    overflow-y: auto;
  `;
}

function closeSuccessModal() {
  const modal = document.querySelector(".contact-success-modal");
  if (modal) {
    modal.remove();
  }
}

function getInquiryTypeLabel(type) {
  const labels = {
    appointment: "Appointment Request",
    general: "General Information",
    complaint: "Complaint or Feedback",
    medical: "Medical Inquiry",
    emergency: "Emergency",
  };
  return labels[type] || type;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Make functions globally available
window.closeEmergencyAlert = closeEmergencyAlert;
window.closeSuccessModal = closeSuccessModal;
