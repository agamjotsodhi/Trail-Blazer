import "./styles/App.css";
import { useEffect, useState, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import TrailBlazerRoutes from "./Routes";
import Navbar from "./components/Navbar";
import TrailBlazerApi from "./api";
import CurrentUserContext from "./context/CurrentUserContext";
import { jwtDecode } from "jwt-decode";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  // Logs user out
  const logOutUser = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    TrailBlazerApi.logoutUser();
  }, [setToken]);

  // Gets user details when token is available (Restores user on page reload) 
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

  // Registers new user 
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

  //  Logs in existing user 
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
      <CurrentUserContext.Provider
        value={{ token, currentUser, logOutUser, setTokenAfterRegister, setTokenAfterLogin }}
      >
        <Navbar logOutUser={logOutUser} />
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