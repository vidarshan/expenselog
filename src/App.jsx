import "./App.css";
import { MantineProvider } from "@mantine/core";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
import YearlyPage from "./pages/YearlyPage";
import MonthlyPage from "./pages/MonthlyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        defaultRadius: "lg",
        primaryColor: "lime",
      }}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:year"
          element={
            <ProtectedRoute>
              <YearlyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:year/:month"
          element={
            <ProtectedRoute>
              <MonthlyPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </MantineProvider>
  );
}

export default App;
