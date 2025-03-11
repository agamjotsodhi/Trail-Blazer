import { createContext, useState, useEffect } from "react";
import TrailBlazerApi from "../api";

// Context for managing the current user's authentication state.
const CurrentUserContext = createContext();

/**
 * CurrentUserProvider
 * 
 * Provides user authentication state and functions (login, logout, register)
 * to all components that need user context.
 */
export const CurrentUserProvider = ({ children }) => {
  // Holds the current user's details.
  const [user, setUser] = useState(null);
  
  // Manages the authentication token (stored in local storage).
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  /**
   * Fetches and sets user data if a valid token exists.
   * Runs whenever the token changes.
   */
  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          const userData = await TrailBlazerApi.getUserDetails();
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token"); // Clear invalid token
        }
      } else {
        setUser(null); // Reset user state if no token
      }
    }
    fetchUser();
  }, [token]);

  /**
   * Logs in the user and updates authentication state.
   * 
   * @param {object} loginInfo - User's login credentials.
   * @throws {Error} - Throws error if login fails.
   */
  const login = async (loginInfo) => {
    try {
      const response = await TrailBlazerApi.loginUser(loginInfo);
      localStorage.setItem("token", response.token);
      setToken(response.token);

      // Fetch and store user details after login
      const userData = await TrailBlazerApi.getUserDetails();
      setUser(userData);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  /**
   * Registers a new user and updates authentication state.
   * 
   * @param {object} registerInfo - User registration details.
   * @throws {Error} - Throws error if registration fails.
   */
  const register = async (registerInfo) => {
    try {
      const response = await TrailBlazerApi.registerUser(registerInfo);
      localStorage.setItem("token", response.token);
      setToken(response.token);

      // Fetch and store user details after registration
      const userData = await TrailBlazerApi.getUserDetails();
      setUser(userData);
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  /**
   * Logs out the user, clearing stored authentication data.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    // Provides authentication state and functions to all components
    <CurrentUserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserContext;
