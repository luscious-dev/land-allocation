import axios from "axios";
import { showAlert } from "./alerts";

export const addLand = function (data) {
  axios
    .post("/api/v1/land", data)
    .then((res) => {
      showAlert("success", "Land Added Successfully!");
      setTimeout(() => {
        location.assign("/lands");
      }, 1500);
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};

export const updateLand = function (id, data) {
  axios
    .patch(`/api/v1/land/${id}`, data)
    .then((res) => {
      showAlert("success", "Land Updated Successfully!");
      console.log("Land Added 1");
      setTimeout(() => {
        location.assign("/lands");
      }, 1500);
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};

export const deleteLand = function (id, domItem) {
  axios
    .delete(`/api/v1/land/${id}`)
    .then((res) => {
      showAlert("success", "Land deleted successfully!");
      console.log("Land deleted");
      domItem.remove();
    })
    .catch((err) => {
      showAlert("failure", err.response.data.message);
    });
};

export const applyForCofo = function (data) {
  axios
    .post("/api/v1/certificate-of-ownership/", data)
    .then((res) => {
      console.log(res);
      showAlert("success", "Application sent successfully!");
      setTimeout(() => {
        location.assign("/my-lands");
      }, 1500);
    })
    .catch((err) => {
      console.log(err);
      showAlert("failure", err.response.data.message);
    });
};

export const printCofo = function (id) {
  axios
    .get(`/api/v1/certificate-of-ownership/print-certficate/${id}`)
    .then((res) => {
      showAlert("success", "Success!");
    })
    .catch((err) => {
      console.log(err);
      showAlert("failure", err.response.data.message);
    });
};

export const approveCofo = function (id, lastChanged, articleCard) {
  axios
    .patch(`/api/v1/certificate-of-ownership/${id}`, {
      Approved: 1,
      LastChanged: lastChanged,
    })
    .then((res) => {
      showAlert("success", "Application Approved Successfully!");
      articleCard.remove();
    })
    .catch((err) => {
      console.log(err);
      showAlert("failure", err.response.data.message);
    });
};
export const rejectCofo = function (id, lastChanged, articleCard) {
  axios
    .patch(`/api/v1/certificate-of-ownership/${id}`, {
      DelFlag: 1,
      LastChanged: lastChanged,
    })
    .then((res) => {
      showAlert("success", "Application Rejected Successfully!");
      articleCard.remove();
    })
    .catch((err) => {
      console.log(err);
      showAlert("failure", err.response.data.message);
    });
};
