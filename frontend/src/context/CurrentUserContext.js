import { createContext, useState, useEffect } from "react";
import TrailBlazerApi from "../api";

// Creates user context - used for accessing the current user's data
const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  //  State to hold user details
  const [user, setUser] = useState(null);
  
  // State to manage authentication token (stored in local storage)
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          const userData = await TrailBlazerApi.getUserDetails(); // Fetch user details
          setUser(userData); // Ensure user state is updated
        } catch (err) {
          console.error("Failed to fetch user:", err);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null); // Reset user state if no token
      }
    }
    fetchUser();
  }, [token]); // Runs when token changes
  


  // Login function (sets token & fetches user details)
  const login = async (loginInfo) => {
    try {
      const response = await TrailBlazerApi.loginUser(loginInfo); // API call to log in
      localStorage.setItem("token", response.token); // Store token in local storage
      setToken(response.token);
      
      // After login, fetch user details and update state
      const userData = await TrailBlazerApi.getUserDetails();
      setUser(userData);
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // Pass error to the calling component for handling
    }
  };


  // Register function (same logic as login)
  const register = async (registerInfo) => {
    try {
      const response = await TrailBlazerApi.registerUser(registerInfo);
      localStorage.setItem("token", response.token);
      setToken(response.token);
      
      // Fetch user details after successful registration
      const userData = await TrailBlazerApi.getUserDetails();
      setUser(userData);
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  // Logout function (clears user data and token)
  const logout = () => {
    localStorage.removeItem("token"); // Removes token from local storage
    setToken(null);
    setUser(null); // Resets user state to null
  };

  return (
    // Provides user data and auth functions to all components
    <CurrentUserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserContext;
