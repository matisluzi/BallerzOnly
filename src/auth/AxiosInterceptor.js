import axios from "axios";
import AuthService from "./AuthService";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      // Token might be expired, log the user out
      AuthService.logout();
      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axios;
