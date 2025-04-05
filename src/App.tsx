import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import theme from "./theme";

// Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";
import Navbar from "./components/Navbar";

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  userType?: "DOCTOR" | "PATIENT";
}> = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userType && user.userType !== userType) {
    const redirectPath = user.userType === "DOCTOR" ? "/doctor" : "/patient";
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/doctor"
              element={
                <PrivateRoute userType="DOCTOR">
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient"
              element={
                <PrivateRoute userType="PATIENT">
                  <PatientDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
