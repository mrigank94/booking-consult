const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
  getPatientAppointments,
} = require("../controllers/appointment.controller");
const { verifyToken } = require("../middlewares/auth");

// Appointment routes
router.post("/", verifyToken, createAppointment);
router.get("/patient/:patientId", verifyToken, getPatientAppointments);
router.get("/:id", verifyToken, getAppointmentById);
router.put("/:id", verifyToken, updateAppointmentById);
router.delete("/:id", verifyToken, deleteAppointmentById);

module.exports = router;
