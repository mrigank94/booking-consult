const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  getDoctorAppointments,
} = require("../controllers/doctor.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");

// Doctor routes
router.post("/", [verifyToken, verifyAdmin], createDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/appointments", getDoctorAppointments);
router.put("/:id", updateDoctorById);
router.delete("/:id", [verifyToken, verifyAdmin], deleteDoctorById);

module.exports = router;
