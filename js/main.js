// Main JavaScript for general functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the application
  initializeApp();
});

function initializeApp() {
  // Add smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Add loading states to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (this.type === "submit") {
        this.classList.add("loading");
        // Remove loading state after 2 seconds (simulated processing)
        setTimeout(() => {
          this.classList.remove("loading");
        }, 2000);
      }
    });
  });

  // Add hover effects to cards
  const cards = document.querySelectorAll(
    ".feature-card, .clinic-card, .doctor-card"
  );
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Simulate real-time updates for queue data
  if (window.location.pathname.includes("clinics.html")) {
    simulateRealTimeUpdates();
  }
}

// Simulate real-time queue updates (for demo purposes)
function simulateRealTimeUpdates() {
  setInterval(() => {
    // Randomly advance queues to simulate real hospital activity
    const doctorIds = [1, 2, 3, 4, 5];
    const randomDoctorId =
      doctorIds[Math.floor(Math.random() * doctorIds.length)];

    // 30% chance to advance a queue every 30 seconds
    if (Math.random() < 0.3) {
      if (typeof hospitalAPI !== "undefined") {
        hospitalAPI.advanceQueue(randomDoctorId);

        // Update the display if the clinics page is currently loaded
        if (typeof updateClinicsDisplay === "function") {
          updateClinicsDisplay();
        }
      }
    }
  }, 30000); // Every 30 seconds
}

// Utility function to format time
function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Utility function to format date
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Show notification (for success/error messages)
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

  // Add notification styles if they don't exist
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                background-color: #e8f5e8;
                border-left: 4px solid var(--primary-color);
                color: var(--primary-color);
            }
            .notification-error {
                background-color: #ffebee;
                border-left: 4px solid #f44336;
                color: #f44336;
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  // Close notification
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.remove();
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 5000);
}

// Validate form inputs
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    const formGroup = input.closest(".form-group");
    const existingError = formGroup.querySelector(".error-message");

    // Remove existing error messages
    if (existingError) {
      existingError.remove();
    }
    formGroup.classList.remove("error");

    // Validate input
    if (!input.value.trim()) {
      isValid = false;
      formGroup.classList.add("error");
      const errorMsg = document.createElement("span");
      errorMsg.className = "error-message";
      errorMsg.textContent = `${input.previousElementSibling.textContent} is required`;
      formGroup.appendChild(errorMsg);
    } else if (input.type === "email" && !isValidEmail(input.value)) {
      isValid = false;
      formGroup.classList.add("error");
      const errorMsg = document.createElement("span");
      errorMsg.className = "error-message";
      errorMsg.textContent = "Please enter a valid email address";
      formGroup.appendChild(errorMsg);
    }
  });

  return isValid;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Local storage helpers
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}
