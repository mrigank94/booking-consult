import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doctorService, appointmentService } from "../services/api";
import { Doctor, Appointment } from "../types";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, appointmentsData] = await Promise.all([
          doctorService.getAllDoctors(),
          appointmentService.getPatientAppointments(user?.userId || ""),
        ]);
        setDoctors(doctorsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.userId]);

  // Update available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && date) {
      const doctor = doctors.find((d) => d.id === selectedDoctor);
      if (doctor) {
        // Get the day of week from the selected date
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.toLocaleString("en-US", {
          weekday: "long",
        });

        // Find the availability for the selected day
        const dayAvailability = doctor.availability.find(
          (avail) => avail.day === dayOfWeek
        );

        // Set the available time slots for that day
        setAvailableSlots(dayAvailability?.timeSlots || []);
      }
    } else {
      setAvailableSlots([]);
    }
    setSelectedTime(""); // Reset selected time when doctor or date changes
  }, [selectedDoctor, date, doctors]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !date || !selectedTime) return;

    try {
      setLoading(true);
      await appointmentService.bookAppointment({
        patient: user?.userId,
        doctor: selectedDoctor,
        appointmentDate: date,
        timeSlot: selectedTime,
      });
      // Refresh appointments
      const updatedAppointments =
        await appointmentService.getPatientAppointments(user?.userId || "");
      setAppointments(updatedAppointments);
      // Reset form
      setSelectedDoctor("");
      setDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patient Dashboard
        </Typography>

        {/* Book Appointment Form */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Book New Appointment
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                value={selectedDoctor}
                label="Select Doctor"
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization} (₹{doctor.fees})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split("T")[0], // Disable past dates
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Time Slot</InputLabel>
              <Select
                value={selectedTime}
                label="Select Time Slot"
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={
                  !selectedDoctor || !date || availableSlots.length === 0
                }
              >
                {availableSlots.length === 0 ? (
                  <MenuItem disabled value="">
                    No slots available
                  </MenuItem>
                ) : (
                  availableSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleBookAppointment}
              disabled={loading || !selectedDoctor || !date || !selectedTime}
            >
              Book Appointment
            </Button>
          </Box>
        </Paper>

        {/* Appointments List */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Appointments
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Booked on</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => {
                  const doctor = doctors.find(
                    (d) => d.id === appointment.doctor
                  );
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{doctor?.name}</TableCell>
                      <TableCell>
                        {new Date(appointment.appointmentDate).toDateString()}
                      </TableCell>
                      <TableCell>{appointment.timeSlot}</TableCell>
                      <TableCell>
                        {new Date(appointment.createdAt).toDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientDashboard;
