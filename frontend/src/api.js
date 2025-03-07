import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

class TrailBlazerApi {
  static token = localStorage.getItem("token") || null;

  /** Ensures API always has the latest token */
  static setToken(newToken) {
    if (newToken) {
      localStorage.setItem("token", newToken);
      this.token = newToken;
    } else {
      localStorage.removeItem("token");
      this.token = null;
    }
  }

  /** Sends API requests */
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", method.toUpperCase(), endpoint, data);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response);
      if (err.response?.status === 401) {
        this.logoutUser(); // Auto logout on 401 Unauthorized
      }
      const message = err.response?.data?.error || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Registers a new user */
  static async registerUser(registerInfo) {
    try {
      let response = await this.request("auth/register", registerInfo, "post");
      if (response.token) {
        console.log("[API] Registration successful, setting token.");
        this.setToken(response.token);
        return response;
      }
    } catch (error) {
      console.error("[API] Registration failed:", error);
      throw error;
    }
  }

  /** Logs in an existing user */
  static async loginUser(loginInfo) {
    try {
      let response = await this.request("auth/token", loginInfo, "post");
      if (response.token) {
        console.log("[API] Login successful, setting token.");
        this.setToken(response.token);
        return response;
      }
    } catch (error) {
      console.error("[API] Login failed:", error);
      throw error;
    }
  }

  /** Fetches user details */
  static async getUserDetails() {
    if (!this.token) return null;

    try {
      const decoded = jwtDecode(this.token);
      if (!decoded.username) throw new Error("Invalid token structure");

      return await this.request(`users/${decoded.username}`);
    } catch (error) {
      console.error("[API] Token decoding failed:", error);
      return null;
    }
  }

  /** Logs out the user */
  static logoutUser() {
    console.log("[API] Logging out user.");
    this.setToken(null);
    window.location.href = "/";
  }

  // ======== TRIP ROUTES =========

  /** Fetches all trips for the logged-in user */
  static async getTrips() {
    try {
      console.log("[API] Fetching user trips...");
      const response = await this.request("trips");
      return response.trips;
    } catch (error) {
      console.error("[API] Error fetching trips:", error);
      throw error;
    }
  }

  /** Creates a new trip for the logged-in user */
  static async createTrip(tripData) {
    try {
      console.log("[API] Creating trip:", tripData);
      const response = await this.request("trips", tripData, "post");
      return response.trip;
    } catch (error) {
      console.error("[API] Error creating trip:", error);
      throw error;
    }
  }

  /** Fetches details of a specific trip */
  static async getTripDetails(tripId) {
    try {
      console.log("[API] Fetching details for trip:", tripId);
      const response = await this.request(`trips/${tripId}`);
      return response;
    } catch (error) {
      console.error("[API] Error fetching trip details:", error);
      throw error;
    }
  }

  /** Updates a trip */
  static async updateTrip(tripId, tripData) {
    try {
      console.log("[API] Updating trip:", tripId);
      const response = await this.request(`trips/${tripId}`, tripData, "patch");
      return response.updatedTrip;
    } catch (error) {
      console.error("[API] Error updating trip:", error);
      throw error;
    }
  }

  /** Deletes a trip */
  static async deleteTrip(tripId) {
    try {
      console.log("[API] Deleting trip with ID:", tripId);
      const response = await this.request(`trips/${tripId}`, {}, "delete");
      return response.message;
    } catch (error) {
      console.error("[API] Error deleting trip:", error);
      throw error;
    }
  }

  // ======== DESTINATIONS ROUTES =========

  /** Fetches all destinations */
  static async getAllDestinations() {
    return await this.request("destinations");
  }

  /** Fetches a destination by country name */
  static async getCountryDetails(countryName) {
    return await this.request(`destinations/country/${encodeURIComponent(countryName)}`);
  }

  /** Fetches country suggestions based on user input */
static async getCountrySuggestions(query) {
  try {
    const response = await this.request(`destinations/suggestions/${encodeURIComponent(query)}`);
    return response.suggestions || [];
  } catch (error) {
    console.error("[API] Error fetching country suggestions:", error);
    return [];
  }
}


}

export default TrailBlazerApi;