const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");

// Create a new appointment
const createAppointment = async (req, res) => {
  // Check if doctor is valid and appointment slot is empty

  const doctorId = req.body.doctor;
  const doctor = await Doctor.findOne({
    user: doctorId,
  });

  if (!doctor) {
    return res.status(404).send("Doctor with given id does not exist");
  }

  console.log(doctor);
  console.log(doctor.availability);

  const { appointmentDate, timeSlot } = req.body;

  // We need to check if timeslot is within the doctor's availability
  // Date in JS, how to get the day for that date?

  const dayOfWeek = new Date(appointmentDate).toLocaleString("en-US", {
    weekday: "long",
  });

  console.log(dayOfWeek);
  const availableDay = doctor.availability.find(
    (avail) => avail.day === dayOfWeek
  );

  if (!availableDay) {
    return res.status(400).send("Doctor does not sit on the requested day");
  }

  const timeSlotExists = availableDay.timeSlots.includes(timeSlot);

  if (!timeSlotExists) {
    return res.status(400).send("The time slot does not exist for this day");
  }

  const appointmentExists = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: appointmentDate,
    timeSlot: timeSlot,
  });

  if (appointmentExists) {
    return res.status(400).send("The time slot is already booked");
  }

  const appointment = await Appointment.create({
    ...req.body,
  });
  res.status(201).send(appointment);
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment by ID
const updateAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete appointment by ID
const deleteAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patient's appointments
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientId,
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
  getPatientAppointments,
};
