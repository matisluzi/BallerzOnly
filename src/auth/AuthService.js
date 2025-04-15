import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  // Register user
  register(name, email, password) {
    return axios.post(API_BASE_URL + "register.php", {
      name,
      email,
      password,
    });
  }

  // Login user
  login(email, password) {
    return axios
      .post(API_BASE_URL + "login.php", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  // Logout user
  logout() {
    localStorage.removeItem("user");
  }

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  // Check if user is logged in
  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  // Get user profile
  getUserProfile() {
    return axios.get(API_BASE_URL + "profile.php", {
      headers: this.authHeader(),
    });
  }

  // Auth header
  authHeader() {
    const user = this.getCurrentUser();

    if (user && user.token) {
      return { Authorization: "Bearer " + user.token };
    } else {
      return {};
    }
  }
}

export default new AuthService();
