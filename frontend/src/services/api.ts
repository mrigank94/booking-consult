import axios from "axios";
import { User, Doctor, Appointment, AuthResponse } from "../types";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: async (userData: {
    userId: string;
    password: string;
    name: string;
    userType: "DOCTOR" | "PATIENT";
  }) => {
    const response = await api.post<AuthResponse>("/auth/signup", userData);
    return response.data;
  },

  login: async (credentials: { userId: string; password: string }) => {
    const response = await api.post<string>("/auth/signin", credentials);
    return response.data;
  },
};

export const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get<Doctor[]>("/doctors");
    return response.data;
  },

  getDoctorAppointments: async (doctorId: string) => {
    const response = await api.get<Appointment[]>(
      `/doctors/${doctorId}/appointments`
    );
    return response.data;
  },
};

export const appointmentService = {
  bookAppointment: async (appointmentData: {
    doctor: string;
    patient?: string;
    appointmentDate: string;
    timeSlot: string;
  }) => {
    const response = await api.post<Appointment>(
      "/appointments",
      appointmentData,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  },

  getPatientAppointments: async (patientId: string) => {
    const response = await api.get<Appointment[]>(
      `/appointments/patient/${patientId}`,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  },
};
