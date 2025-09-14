// Hospital Management System Data - Maternity & Infant Care Hospital
const hospitalData = {
  clinics: [
    {
      id: 1,
      name: "Prenatal Care Clinic",
      description: "For pregnant mothers",
      type: "pregnant",
      available: true,
      doctors: [
        {
          id: 1,
          name: "Dr. Priyanka Perera",
          day: "Monday",
          specialty: "Obstetrics & Gynecology",
        },
        {
          id: 2,
          name: "Dr. Chamila Fernando Silva",
          day: "Tuesday",
          specialty: "Obstetrics & Gynecology",
        },
        {
          id: 3,
          name: "Dr. Nimesha Fernando",
          day: "Wednesday",
          specialty: "Obstetrics & Gynecology",
        },
        {
          id: 4,
          name: "Dr. Sanduni Rajapaksa",
          day: "Thursday",
          specialty: "Obstetrics & Gynecology",
        },
        {
          id: 5,
          name: "Dr. Dilani Wickramasinghe",
          day: "Friday",
          specialty: "Obstetrics & Gynecology",
        },
      ],
    },
    {
      id: 2,
      name: "Infant Care Clinic",
      description: "For mothers with babies under 1 year",
      type: "mother_with_infant",
      available: true,
      doctors: [
        {
          id: 6,
          name: "Dr. Ruwan Jayasinghe",
          day: "Monday",
          specialty: "Pediatrics",
        },
        {
          id: 7,
          name: "Dr. Samanthi Gunasekara",
          day: "Tuesday",
          specialty: "Pediatrics",
        },
        {
          id: 8,
          name: "Dr. Kasun Bandara",
          day: "Wednesday",
          specialty: "Pediatrics",
        },
        {
          id: 9,
          name: "Dr. Sunethra Dias",
          day: "Thursday",
          specialty: "Pediatrics",
        },
        {
          id: 10,
          name: "Dr. Thilini Rathnayake",
          day: "Friday",
          specialty: "Pediatrics",
        },
      ],
    },
  ],

  // Legacy doctors array for compatibility (flattened from clinics)
  doctors: [
    {
      id: 1,
      name: "Dr. Priyanka Perera",
      specialty: "Obstetrics & Gynecology",
      day: "Monday",
      clinicType: "pregnant",
      available: true,
    },
    {
      id: 2,
      name: "Dr. Chamila Silva",
      specialty: "Obstetrics & Gynecology",
      day: "Tuesday",
      clinicType: "pregnant",
      available: true,
    },
    {
      id: 3,
      name: "Dr. Nimesha Fernando",
      specialty: "Obstetrics & Gynecology",
      day: "Wednesday",
      clinicType: "pregnant",
      available: true,
    },
    {
      id: 4,
      name: "Dr. Sanduni Rajapaksa",
      specialty: "Obstetrics & Gynecology",
      day: "Thursday",
      clinicType: "pregnant",
      available: true,
    },
    {
      id: 5,
      name: "Dr. Dilani Wickramasinghe",
      specialty: "Obstetrics & Gynecology",
      day: "Friday",
      clinicType: "pregnant",
      available: true,
    },
    {
      id: 6,
      name: "Dr. Ruwan Jayasinghe",
      specialty: "Pediatrics",
      day: "Monday",
      clinicType: "mother_with_infant",
      available: true,
    },
    {
      id: 7,
      name: "Dr. Samanthi Gunasekara",
      specialty: "Pediatrics",
      day: "Tuesday",
      clinicType: "mother_with_infant",
      available: true,
    },
    {
      id: 8,
      name: "Dr. Kasun Bandara",
      specialty: "Pediatrics",
      day: "Wednesday",
      clinicType: "mother_with_infant",
      available: true,
    },
    {
      id: 9,
      name: "Dr. Sunethra Dias",
      specialty: "Pediatrics",
      day: "Thursday",
      clinicType: "mother_with_infant",
      available: true,
    },
    {
      id: 10,
      name: "Dr. Thilini Rathnayake",
      specialty: "Pediatrics",
      day: "Friday",
      clinicType: "mother_with_infant",
      available: true,
    },
  ],

  // Simulated patient data for queues (using Sri Lankan names)
  queues: {
    // 1: [
    //   // Dr. Priyanka Perera - Monday (Prenatal)
    //   {
    //     id: 1,
    //     name: "Kavitha Amarasinghe",
    //     position: 1,
    //     isCurrentPatient: true,
    //     weeks: 28,
    //   },
    //   {
    //     id: 2,
    //     name: "Nadeeka Peiris",
    //     position: 2,
    //     isCurrentPatient: false,
    //     weeks: 24,
    //   },
    //   {
    //     id: 3,
    //     name: "Shamali Rajapaksa",
    //     position: 3,
    //     isCurrentPatient: false,
    //     weeks: 32,
    //   },
    //   {
    //     id: 4,
    //     name: "Manjula Fernando",
    //     position: 4,
    //     isCurrentPatient: false,
    //     weeks: 16,
    //   },
    // ],
    2: [
      // Dr. Chamila Silva - Tuesday (Prenatal)
      {
        id: 5,
        name: "Sumudu Jayasinghe",
        position: 1,
        isCurrentPatient: true,
        weeks: 20,
      },
      {
        id: 6,
        name: "Chalani Wijesekara",
        position: 2,
        isCurrentPatient: false,
        weeks: 36,
      },
      {
        id: 7,
        name: "Ruwanthi Bandara",
        position: 3,
        isCurrentPatient: false,
        weeks: 12,
      },
    ],
    // 3: [
    //   // Dr. Nimesha Fernando - Wednesday (Prenatal)
    //   {
    //     id: 8,
    //     name: "Shirani Gunaratne",
    //     position: 1,
    //     isCurrentPatient: true,
    //     weeks: 30,
    //   },
    //   {
    //     id: 9,
    //     name: "Amali Senanayake",
    //     position: 2,
    //     isCurrentPatient: false,
    //     weeks: 18,
    //   },
    //   {
    //     id: 10,
    //     name: "Dilani Karunanayake",
    //     position: 3,
    //     isCurrentPatient: false,
    //     weeks: 22,
    //   },
    //   {
    //     id: 11,
    //     name: "Nalini Wickramasinghe",
    //     position: 4,
    //     isCurrentPatient: false,
    //     weeks: 26,
    //   },
    //   {
    //     id: 12,
    //     name: "Sanduni Rathnayake",
    //     position: 5,
    //     isCurrentPatient: false,
    //     weeks: 14,
    //   },
    // ],
    // 4: [
    //   // Dr. Sanduni Rajapaksa - Thursday (Prenatal)
    //   {
    //     id: 13,
    //     name: "Thilini Gunasekara",
    //     position: 1,
    //     isCurrentPatient: true,
    //     weeks: 34,
    //   },
    //   {
    //     id: 14,
    //     name: "Chamika Silva",
    //     position: 2,
    //     isCurrentPatient: false,
    //     weeks: 28,
    //   },
    // ],
    // 5: [
    //   // Dr. Dilani Wickramasinghe - Friday (Prenatal)
    //   {
    //     id: 15,
    //     name: "Malsha Perera",
    //     position: 1,
    //     isCurrentPatient: true,
    //     weeks: 38,
    //   },
    //   {
    //     id: 16,
    //     name: "Priyangika De Silva",
    //     position: 2,
    //     isCurrentPatient: false,
    //     weeks: 16,
    //   },
    //   {
    //     id: 17,
    //     name: "Sachini Mendis",
    //     position: 3,
    //     isCurrentPatient: false,
    //     weeks: 24,
    //   },
    //   {
    //     id: 18,
    //     name: "Uthpala Dharmasena",
    //     position: 4,
    //     isCurrentPatient: false,
    //     weeks: 20,
    //   },
    //   {
    //     id: 19,
    //     name: "Ishara Herath",
    //     position: 5,
    //     isCurrentPatient: false,
    //     weeks: 32,
    //   },
    //   {
    //     id: 20,
    //     name: "Chathuri Jayawardena",
    //     position: 6,
    //     isCurrentPatient: false,
    //     weeks: 28,
    //   },
    // ],
    // 6: [
    //   // Dr. Ruwan Jayasinghe - Monday (Infant Care)
    //   {
    //     id: 21,
    //     name: "Lakshika with Baby Sahan",
    //     position: 1,
    //     isCurrentPatient: true,
    //     babyAge: 8,
    //   },
    //   {
    //     id: 22,
    //     name: "Madushani with Baby Nethmi",
    //     position: 2,
    //     isCurrentPatient: false,
    //     babyAge: 3,
    //   },
    //   {
    //     id: 23,
    //     name: "Kushani with Baby Dinul",
    //     position: 3,
    //     isCurrentPatient: false,
    //     babyAge: 11,
    //   },
    // ],
    7: [
      // Dr. Samanthi Gunasekara - Tuesday (Infant Care)
      {
        id: 24,
        name: "Nimasha with Baby Isuru",
        position: 1,
        isCurrentPatient: true,
        babyAge: 6,
      },
      {
        id: 25,
        name: "Sunethra with Baby Kavya",
        position: 2,
        isCurrentPatient: false,
        babyAge: 2,
      },
      {
        id: 26,
        name: "Chandrika with Baby Ranul",
        position: 3,
        isCurrentPatient: false,
        babyAge: 9,
      },
      {
        id: 27,
        name: "Miyuru with Baby Senara",
        position: 4,
        isCurrentPatient: false,
        babyAge: 4,
      },
      {
        id: 28,
        name: "Hansika with Baby Thehan",
        position: 5,
        isCurrentPatient: false,
        babyAge: 5,
      },
      {
        id: 29,
        name: "Purnima with Baby Anuki",
        position: 6,
        isCurrentPatient: false,
        babyAge: 7,
      },
      {
        id: 30,
        name: "Samadhi with Baby Yasas",
        position: 7,
        isCurrentPatient: false,
        babyAge: 10,
      },
    ],
    // 8: [
    //   // Dr. Kasun Bandara - Wednesday (Infant Care)
    //   {
    //     id: 28,
    //     name: "Hansika with Baby Thehan",
    //     position: 1,
    //     isCurrentPatient: true,
    //     babyAge: 5,
    //   },
    //   {
    //     id: 29,
    //     name: "Purnima with Baby Anuki",
    //     position: 2,
    //     isCurrentPatient: false,
    //     babyAge: 7,
    //   },
    //   {
    //     id: 30,
    //     name: "Samadhi with Baby Yasas",
    //     position: 3,
    //     isCurrentPatient: false,
    //     babyAge: 10,
    //   },
    // ],
    // 9: [
    //   // Dr. Sunethra Dias - Thursday (Infant Care)
    //   {
    //     id: 31,
    //     name: "Maheshi with Baby Dilan",
    //     position: 1,
    //     isCurrentPatient: true,
    //     babyAge: 1,
    //   },
    //   {
    //     id: 32,
    //     name: "Thanuja with Baby Minoli",
    //     position: 2,
    //     isCurrentPatient: false,
    //     babyAge: 12,
    //   },
    // ],
    // 10: [
    //   // Dr. Thilini Rathnayake - Friday (Infant Care)
    //   {
    //     id: 33,
    //     name: "Anuradha with Baby Sathya",
    //     position: 1,
    //     isCurrentPatient: true,
    //     babyAge: 3,
    //   },
    //   {
    //     id: 34,
    //     name: "Harshani with Baby Pasindu",
    //     position: 2,
    //     isCurrentPatient: false,
    //     babyAge: 8,
    //   },
    //   {
    //     id: 35,
    //     name: "Sewwandi with Baby Amaya",
    //     position: 3,
    //     isCurrentPatient: false,
    //     babyAge: 6,
    //   },
    //   {
    //     id: 36,
    //     name: "Chathurika with Baby Nimesh",
    //     position: 4,
    //     isCurrentPatient: false,
    //     babyAge: 11,
    //   },
    // ],
  },

  // Registered patients storage
  registeredPatients: [],
};

// Utility functions for backend simulation
const hospitalAPI = {
  // Get all clinics
  getClinics() {
    return hospitalData.clinics;
  },

  // Get clinic by type
  getClinicByType(type) {
    return hospitalData.clinics.find((clinic) => clinic.type === type);
  },

  // Get doctors by clinic type
  getDoctorsByClinicType(clinicType) {
    const clinic = this.getClinics().find(
      (clinic) => clinic.type === clinicType
    );
    return clinic ? clinic.doctors : [];
  },

  // Get all doctors
  getDoctors() {
    return hospitalData.doctors;
  },

  // Get doctor by ID
  getDoctorById(id) {
    return hospitalData.doctors.find((doctor) => doctor.id === parseInt(id));
  },

  // Get queue for a specific doctor
  getQueue(doctorId) {
    return hospitalData.queues[doctorId] || [];
  },

  // Register a new patient
  registerPatient(patientData) {
    const newPatient = {
      id: Date.now(), // Simple ID generation
      ...patientData,
      registrationDate: new Date().toISOString(),
      queuePosition: this.addToQueue(
        patientData.doctorId,
        patientData.patientName
      ),
    };

    hospitalData.registeredPatients.push(newPatient);
    return newPatient;
  },

  // Add patient to doctor's queue
  addToQueue(doctorId, patientName) {
    if (!hospitalData.queues[doctorId]) {
      hospitalData.queues[doctorId] = [];
    }

    const queue = hospitalData.queues[doctorId];
    const newPosition = queue.length + 1;
    const newPatient = {
      id: Date.now(),
      name: patientName,
      position: newPosition,
      isCurrentPatient: false,
    };

    queue.push(newPatient);
    return newPosition;
  },

  // Get clinic status (available, busy, closed)
  getClinicStatus(doctorId) {
    const queue = this.getQueue(doctorId);
    const doctor = this.getDoctorById(doctorId);

    if (!doctor || !doctor.available) {
      return "closed";
    }

    if (queue.length === 0) {
      return "available";
    } else if (queue.length <= 3) {
      return "available";
    } else {
      return "busy";
    }
  },

  // Calculate estimated wait time (in minutes)
  getEstimatedWaitTime(doctorId) {
    const queue = this.getQueue(doctorId);
    const currentPatientIndex = queue.findIndex(
      (patient) => patient.isCurrentPatient
    );
    const patientsAhead = queue.length - currentPatientIndex - 1;

    // Assuming 15 minutes per patient on average
    return Math.max(0, patientsAhead * 15);
  },

  // Simulate advancing the queue (for demo purposes)
  advanceQueue(doctorId) {
    const queue = hospitalData.queues[doctorId];
    if (!queue || queue.length === 0) return;

    // Remove current patient
    const currentIndex = queue.findIndex((patient) => patient.isCurrentPatient);
    if (currentIndex !== -1) {
      queue.splice(currentIndex, 1);
    }

    // Update positions and set new current patient
    queue.forEach((patient, index) => {
      patient.position = index + 1;
      patient.isCurrentPatient = index === 0;
    });
  },

  // Get day name from doctor ID for display
  getDayName(doctorId) {
    const doctor = this.getDoctorById(doctorId);
    return doctor ? doctor.day : "";
  },
};

// Export for use in other files (if using modules)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { hospitalData, hospitalAPI };
}
