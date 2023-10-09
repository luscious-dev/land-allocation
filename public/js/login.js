import axios from "axios";
import { showAlert } from "./alerts";

export const login = function (email, password) {
  axios
    .post("/api/v1/user/login", {
      Email: email,
      Password: password,
    })
    .then((res) => {
      showAlert("success", "Logged in successfully!");
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};

export const logout = function () {
  axios
    .get("/api/v1/user/logout")
    .then((res) => {
      showAlert("success", "Logged out successfully!");
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};

export const signUp = function (data) {
  axios
    .post("/api/v1/user/signup", data)
    .then((res) => {
      showAlert("success", "Sign up successfull");
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};

export const updateProfile = async function (data) {
  try {
    const res = await axios.patch("/api/v1/user/updateMe", data);
    showAlert("success", "Profile updated successfully");
    return res.data;
  } catch (err) {
    showAlert("failure", err.response.data.message);
  }
};

export const updatePassword = async function (data) {
  try {
    const res = await axios.patch("/api/v1/user/updatePassword", data);
    showAlert("success", "Password updated successfully");
    return res.data;
  } catch (err) {
    showAlert("failure", err.response.data.message);
  }
};
