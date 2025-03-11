import "./styles/App.css";
import { useEffect, useState, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import TrailBlazerRoutes from "./Routes";
import Navbar from "./components/Navbar";
import TrailBlazerApi from "./api";
import CurrentUserContext from "./context/CurrentUserContext";
import { jwtDecode } from "jwt-decode";

/**
 * App Component
 * 
 * - Manages user authentication state.
 * - Provides user context for login, logout, and authentication persistence.
 * - Handles routing and navigation.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null); // Stores logged-in user details
  const [token, setToken] = useLocalStorage("token", null); // Manages token in localStorage
  const [isFetchingUser, setIsFetchingUser] = useState(false); // Tracks if user data is being fetched

  /**
   * Logs the user out by clearing token and user data.
   */
  const logOutUser = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    TrailBlazerApi.logoutUser();
  }, [setToken]);

  /**
   * Restores user session on page reload if a token is available.
   * Ensures authentication state persists across sessions.
   */
  useEffect(() => {
    const restoreUser = async () => {
      if (token && !currentUser && !isFetchingUser) {
        setIsFetchingUser(true);
        try {
          const decoded = jwtDecode(token);
          if (!decoded.username) throw new Error("Invalid token structure");

          TrailBlazerApi.token = token;
          const user = await TrailBlazerApi.getUserDetails();
          setCurrentUser(user);
        } catch (err) {
          console.error("[App] Error restoring session:", err);
          logOutUser();
        } finally {
          setIsFetchingUser(false);
        }
      }
    };

    restoreUser();
  }, [token, currentUser, isFetchingUser, logOutUser]);

  /**
   * Registers a new user and updates authentication state.
   * 
   * @param {object} data - User registration details.
   * @returns {boolean} - True if registration succeeds, otherwise false.
   */
  const setTokenAfterRegister = async (data) => {
    try {
      let response = await TrailBlazerApi.registerUser(data);
      if (response.token) {
        setToken(response.token);
        TrailBlazerApi.token = response.token;
        const userData = await TrailBlazerApi.getUserDetails();
        setCurrentUser(userData);
        return true;
      }
    } catch (err) {
      console.error("[App] Registration failed:", err);
      return false;
    }
  };

  /**
   * Logs in an existing user and updates authentication state.
   * 
   * @param {object} data - User login credentials.
   * @returns {boolean} - True if login succeeds, otherwise false.
   */
  const setTokenAfterLogin = async (data) => {
    try {
      let response = await TrailBlazerApi.loginUser(data);
      if (response.token) {
        setToken(response.token);
        TrailBlazerApi.token = response.token;
        const userData = await TrailBlazerApi.getUserDetails();
        setCurrentUser(userData);
        return true;
      }
    } catch (err) {
      console.error("[App] Login failed:", err);
      return false;
    }
  };

  return (
    <div className="App">
      {/* Provides authentication context to the entire app */}
      <CurrentUserContext.Provider
        value={{ token, currentUser, logOutUser, setTokenAfterRegister, setTokenAfterLogin }}
      >
        {/* Navbar with logout functionality */}
        <Navbar logOutUser={logOutUser} />

        {/* Main Application Routes */}
        <main>
          <TrailBlazerRoutes 
            setTokenAfterRegister={setTokenAfterRegister} 
            setTokenAfterLogin={setTokenAfterLogin} 
          />
        </main>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
