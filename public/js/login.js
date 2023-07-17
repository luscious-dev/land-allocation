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
      showAlert("success", "Logged out successfuly!");
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};
