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
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doctorService } from "../services/api";
import { Appointment } from "../types";

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.userId) return;
      try {
        const appointmentsData = await doctorService.getDoctorAppointments(
          user.userId
        );
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: "completed" | "cancelled"
  ) => {
    try {
      setLoading(true);
      // Here you would typically call an API to update the appointment status
      // For now, we'll just update the local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Doctor Dashboard
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Appointments
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patient.name}</TableCell>
                    <TableCell>
                      {new Date(appointment.appointmentDate).toDateString()}
                    </TableCell>
                    <TableCell>{appointment.timeSlot}</TableCell>
                    <TableCell>
                      {new Date(appointment.createdAt).toDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default DoctorDashboard;
