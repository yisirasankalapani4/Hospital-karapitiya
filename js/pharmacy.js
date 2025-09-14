// Pharmacy Prescription Upload and Delivery Calculator

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("prescriptionFile");
  const uploadedFiles = document.getElementById("uploadedFiles");
  const citySelect = document.getElementById("city");
  const urgencySelect = document.getElementById("urgency");
  const calculateBtn = document.getElementById("calculateBtn");
  const prescriptionForm = document.getElementById("prescriptionForm");

  // Cost elements
  const baseFeeElement = document.getElementById("baseFee");
  const distanceChargeElement = document.getElementById("distanceCharge");
  const urgencyFeeElement = document.getElementById("urgencyFee");
  const totalCostElement = document.getElementById("totalCost");

  let uploadedFilesArray = [];

  // Delivery costs configuration (only delivery charges, medicines are free)
  const deliveryCosts = {
    baseFee: 200, // Base delivery fee in Rs.
    distances: {
      galle: 0, // Local delivery - no extra charge
      hikkaduwa: 300, // 15km from Galle
      bentota: 400, // 20km from Galle
      ambalangoda: 500, // 25km from Galle
      baddegama: 350, // 18km from Galle
      elpitiya: 600, // 30km from Galle
    },
    urgency: {
      standard: 0, // 24-48 hours - no extra charge
      express: 500, // 6-12 hours - express charge
      emergency: 1000, // 2-4 hours - emergency charge
    },
  };

  // File upload handling with better simulation
  uploadArea.addEventListener("click", () => fileInput.click());

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });

  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  });

  function handleFiles(files) {
    files.forEach((file) => {
      if (validateFile(file)) {
        // Simulate file upload process
        simulateFileUpload(file);
      }
    });
    fileInput.value = ""; // Clear input
  }

  function simulateFileUpload(file) {
    // Create upload progress indicator
    const uploadDiv = document.createElement("div");
    uploadDiv.className = "uploading-file";
    uploadDiv.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${getFileIcon(file.type)}</span>
                <div class="file-details">
                    <h5>${file.name}</h5>
                    <p>Uploading... <span class="progress">0%</span></p>
                </div>
            </div>
            <div class="upload-progress">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        `;
    uploadedFiles.appendChild(uploadDiv);

    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) progress = 100;

      const progressBar = uploadDiv.querySelector(".progress-bar");
      const progressText = uploadDiv.querySelector(".progress");

      progressBar.style.width = progress + "%";
      progressText.textContent = Math.round(progress) + "%";

      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          uploadDiv.remove();
          uploadedFilesArray.push(file);
          displayUploadedFile(file);
          showMessage(`✅ ${file.name} uploaded successfully!`, "success");
        }, 500);
      }
    }, 200);
  }

  function validateFile(file) {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("❌ File size must be less than 5MB", "error");
      return false;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      showMessage("❌ Only JPG, PNG, and PDF files are allowed", "error");
      return false;
    }

    // Check if file already uploaded
    if (
      uploadedFilesArray.some(
        (f) => f.name === file.name && f.size === file.size
      )
    ) {
      showMessage("⚠️ File already uploaded", "error");
      return false;
    }

    return true;
  }

  function displayUploadedFile(file) {
    const fileDiv = document.createElement("div");
    fileDiv.className = "uploaded-file";
    fileDiv.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${getFileIcon(file.type)}</span>
                <div class="file-details">
                    <h5>${file.name}</h5>
                    <p>${formatFileSize(file.size)} • ${file.type
      .split("/")[1]
      .toUpperCase()} • ✅ Ready</p>
                </div>
            </div>
            <button type="button" class="remove-file" onclick="removeFile('${
              file.name
            }', this)">×</button>
        `;
    uploadedFiles.appendChild(fileDiv);
  }

  function getFileIcon(fileType) {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    return "📎";
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Global function to remove file
  window.removeFile = function (fileName, buttonElement) {
    uploadedFilesArray = uploadedFilesArray.filter(
      (file) => file.name !== fileName
    );
    buttonElement.parentElement.remove();
    showMessage(`🗑️ ${fileName} removed`, "success");
  };

  // Enhanced delivery cost calculation with simulation
  function calculateDeliveryCost() {
    const city = citySelect.value;
    const urgency = urgencySelect.value;

    if (!city) {
      showMessage(
        "📍 Please select a delivery city to calculate cost",
        "error"
      );
      return;
    }

    // Show calculating animation
    showCalculatingAnimation();

    // Simulate calculation delay
    setTimeout(() => {
      const baseFee = deliveryCosts.baseFee;
      const distanceCharge = deliveryCosts.distances[city] || 0;
      const urgencyFee = deliveryCosts.urgency[urgency] || 0;
      const totalCost = baseFee + distanceCharge + urgencyFee;

      // Animate cost updates
      animateValue(baseFeeElement, 0, baseFee, 500);
      animateValue(distanceChargeElement, 0, distanceCharge, 700);
      animateValue(urgencyFeeElement, 0, urgencyFee, 900);
      animateValue(totalCostElement, 0, totalCost, 1200);

      // Show delivery time estimate
      const deliveryTime = getDeliveryTimeEstimate(city, urgency);
      showMessage(
        `💰 Delivery cost: Rs. ${totalCost} | ⏱️ Estimated delivery: ${deliveryTime}`,
        "success"
      );
    }, 1000);
  }

  function showCalculatingAnimation() {
    const elements = [
      baseFeeElement,
      distanceChargeElement,
      urgencyFeeElement,
      totalCostElement,
    ];
    elements.forEach((element) => {
      element.textContent = "Calculating...";
      element.style.color = "#666";
    });
  }

  function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(start + (end - start) * progress);
      element.textContent = `Rs. ${current}`;
      element.style.color = end > 0 ? "var(--primary-color)" : "#28a745";

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  function getDeliveryTimeEstimate(city, urgency) {
    const distances = {
      galle: "30-60 minutes",
      hikkaduwa: "45-90 minutes",
      bentota: "60-120 minutes",
      ambalangoda: "75-150 minutes",
      baddegama: "60-120 minutes",
      elpitiya: "90-180 minutes",
    };

    const baseTime = distances[city] || "60-120 minutes";

    switch (urgency) {
      case "emergency":
        return `2-4 hours (Priority: ${baseTime} travel time)`;
      case "express":
        return `6-12 hours (Express: ${baseTime} travel time)`;
      default:
        return `24-48 hours (Standard: ${baseTime} travel time)`;
    }
  }

  // Auto-calculate when city or urgency changes
  citySelect.addEventListener("change", calculateDeliveryCost);
  urgencySelect.addEventListener("change", calculateDeliveryCost);
  calculateBtn.addEventListener("click", calculateDeliveryCost);

  // Enhanced form submission simulation
  prescriptionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Simulate comprehensive order processing
    simulateOrderSubmission();
  });

  function simulateOrderSubmission() {
    const steps = [
      "Validating prescription files...",
      "Checking medication availability...",
      "Processing delivery information...",
      "Calculating final costs...",
      "Generating order confirmation...",
      "Notifying pharmacy team...",
    ];

    let currentStep = 0;
    showMessage(steps[currentStep], "success");

    const processInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        showMessage(steps[currentStep], "success");
      } else {
        clearInterval(processInterval);

        // Generate order number
        const orderNumber = "PX" + Date.now().toString().slice(-6);
        const totalCost = totalCostElement.textContent;

        showMessage(
          `🎉 Order submitted successfully! 
                Order #${orderNumber} | Total: ${totalCost}
                📞 You will receive a confirmation call within 30 minutes
                📱 SMS with tracking details will be sent shortly`,
          "success"
        );

        // Reset form after successful submission
        setTimeout(() => {
          prescriptionForm.reset();
          uploadedFilesArray = [];
          uploadedFiles.innerHTML = "";
          resetCostCalculator();
        }, 3000);
      }
    }, 800);
  }

  function validateForm() {
    const requiredFields = [
      "patientName",
      "contactNumber",
      "deliveryAddress",
      "city",
    ];
    let isValid = true;

    // Check if at least one file is uploaded
    if (uploadedFilesArray.length === 0) {
      showMessage("📋 Please upload at least one prescription image", "error");
      isValid = false;
    }

    // Check required fields
    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        field.style.borderColor = "#d32f2f";
        isValid = false;
      } else {
        field.style.borderColor = "";
      }
    });

    // Validate contact number
    const contactNumber = document.getElementById("contactNumber").value;
    const phoneRegex = /^[0-9]{10}$/;
    if (contactNumber && !phoneRegex.test(contactNumber.replace(/\D/g, ""))) {
      showMessage("📱 Please enter a valid 10-digit contact number", "error");
      isValid = false;
    }

    if (!isValid) {
      showMessage("❌ Please fill in all required fields correctly", "error");
    }

    return isValid;
  }

  function resetCostCalculator() {
    baseFeeElement.textContent = "Rs. 0";
    distanceChargeElement.textContent = "Rs. 0";
    urgencyFeeElement.textContent = "Rs. 0";
    totalCostElement.textContent = "Rs. 0";
  }

  function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".message");
    existingMessages.forEach((msg) => msg.remove());

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = message.replace(/\n/g, "<br>");

    // Insert message at the top of the form
    const formContainer = document.querySelector(
      ".prescription-form-container"
    );
    formContainer.insertBefore(messageDiv, formContainer.firstChild);

    // Auto-remove message after 8 seconds for longer messages
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 8000);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Format phone number input
  document
    .getElementById("contactNumber")
    .addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      e.target.value = value;
    });

  // Initialize with empty calculator
  resetCostCalculator();
});
