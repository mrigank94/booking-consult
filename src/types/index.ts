export interface User {
  id: string;
  userId: string;
  name: string;
  userType: "DOCTOR" | "PATIENT";
}

export interface DoctorAvailability {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  timeSlots: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  fees: number;
  availability: DoctorAvailability[];
}

interface Patient {
  name: string;
}
export interface Appointment {
  id: string;
  doctor: string;
  patient: Patient;
  appointmentDate: string;
  timeSlot: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
