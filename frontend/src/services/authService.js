import axios from "axios";

const API_URL = "http://localhost:8000";

class AuthService {
  login(username, password) {
    return axios
      .post(`${API_URL}/login`, {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          // Store the JWT token in local storage
          localStorage.setItem("accessToken", response.data.accessToken);
        }
        return response.data;
      });
  }

  logout() {
    // Remove the JWT token from local storage on logout
    localStorage.removeItem("accessToken");
  }

  register(username, password) {
    return axios.post(`${API_URL}/register`, {
      username,
      password,
    });
  }

  getCurrentUser() {
    // Retrieve the JWT token from local storage
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Decode the JWT token to get user information
      const user = parseJwt(accessToken);
      return user;
    }

    return null;
  }
}

const authServiceInstance = new AuthService(); 

export default authServiceInstance;

// Helper function to parse JWT token and extract user information
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(atob(base64));
}
