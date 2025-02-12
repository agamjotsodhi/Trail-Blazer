import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "./context/CurrentUserContext";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PlanTrip from "./pages/PlanTrip";
import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";
import RequireAuth from "./components/RequireAuth";

function TrailBlazerRoutes({ setTokenAfterRegister, setTokenAfterLogin }) {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Routes>
      {/* Redirect logged-in users away from Landing Page */}
      <Route path="/" element={currentUser ? <Navigate to="/home" replace /> : <LandingPage />} />

      {/* Restrict signup and login to logged-out users */}
      <Route path="/signup" element={currentUser ? <Navigate to="/home" replace /> : <Signup setTokenAfterRegister={setTokenAfterRegister} />} />
      <Route path="/login" element={currentUser ? <Navigate to="/home" replace /> : <Login setTokenAfterLogin={setTokenAfterLogin} />} />

      {/* Protected Routes (RequireAuth ensures user is logged in) */}
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/plan-trip" element={<RequireAuth><PlanTrip /></RequireAuth>} />
      <Route path="/my-trips" element={<RequireAuth><MyTrips /></RequireAuth>} />
      <Route path="/trips/:tripId" element={<RequireAuth><TripDetails /></RequireAuth>} />
      
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default TrailBlazerRoutes;
