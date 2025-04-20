const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

const seedDatabase = async (req, res) => {
  console.log("Seeding database");
  try {
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});

    // Create users
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        userType: "PATIENT",
        userId: "john123",
        userStatus: "APPROVED",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        userType: "PATIENT",
        userId: "jane123",
        userStatus: "APPROVED",
      },
      {
        name: "Dr. Sarah Johnson",
        email: "sarah@example.com",
        password: "password123",
        userType: "DOCTOR",
        userId: "sarah123",
        userStatus: "APPROVED",
      },
      {
        name: "Dr. Michael Brown",
        email: "michael@example.com",
        password: "password123",
        userType: "DOCTOR",
        userId: "michael123",
        userStatus: "APPROVED",
      },
    ];

    const createdUsers = await User.insertMany(users);

    // Create doctors
    const doctors = [
      {
        user: createdUsers[2]._id,
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        availability: [
          {
            day: "Monday",
            timeSlots: [
              "10:00-11:00",
              "11:00-12:00",
              "14:00-15:00",
              "15:00-16:00",
            ],
          },
          {
            day: "Tuesday",
            timeSlots: [
              "10:00-11:00",
              "11:00-12:00",
              "14:00-15:00",
              "15:00-16:00",
            ],
          },
          {
            day: "Wednesday",
            timeSlots: [
              "10:00-11:00",
              "11:00-12:00",
              "14:00-15:00",
              "15:00-16:00",
            ],
          },
        ],
        experience: 10,
        fees: 1000,
      },
      {
        user: createdUsers[3]._id,
        name: "Dr. Michael Brown",
        specialization: "Neurology",
        availability: [
          {
            day: "Monday",
            timeSlots: [
              "10:00-11:00",
              "11:00-12:00",
              "14:00-15:00",
              "15:00-16:00",
            ],
          },
          {
            day: "Tuesday",
            timeSlots: [
              "10:00-11:00",
              "11:00-12:00",
              "14:00-15:00",
              "15:00-16:00",
            ],
          },
          {
            day: "Wednesday",
            timeSlots: [
              "10:00-11:00",
              "11:00-12:00",
              "14:00-15:00",
              "15:00-16:00",
            ],
          },
        ],
        experience: 10,
        fees: 1000,
      },
    ];

    const createdDoctors = await Doctor.insertMany(doctors);

    // Create appointments
    const appointments = [
      {
        doctorId: createdDoctors[0]._id,
        patientId: createdUsers[0]._id,
        appointmentDate: "2024-04-10",
        timeSlot: "09:00-10:00",
      },
      {
        doctorId: createdDoctors[0]._id,
        patientId: createdUsers[1]._id,
        appointmentDate: "2024-04-10",
        timeSlot: "10:00-11:00",
      },
      {
        doctorId: createdDoctors[1]._id,
        patientId: createdUsers[0]._id,
        appointmentDate: "2024-04-11",
        timeSlot: "14:00-15:00",
      },
      {
        doctorId: createdDoctors[1]._id,
        patientId: createdUsers[1]._id,
        appointmentDate: "2024-04-11",
        timeSlot: "15:00-16:00",
      },
    ];

    await Appointment.insertMany(appointments);

    res.status(200).json({
      message: "Database seeded successfully",
      users: createdUsers.length,
      doctors: createdDoctors.length,
      appointments: appointments.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
};

module.exports = {
  seedDatabase,
};
