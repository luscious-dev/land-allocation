import { showAlert } from "./alerts";
import { login, logout } from "./login";
import { buyLand } from "./stripe";
import Dropzone from "dropzone";

const signInPopup = document.getElementById("sign-popup");
const email = document.querySelector("[name=username]");
const password = document.querySelector("[name=password]");
const signInBtn = document.querySelector("#sign-in");
const logoutBtn = document.querySelector("#log-out");

const purchaseLandBtn = document.querySelector(".post-comment-sec .btn2");

if (signInPopup) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    login(email.value, password.value);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

if (purchaseLandBtn) {
  console.log("In here!!!!!!!!!");
  purchaseLandBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.target.textContent = "Processing...";
    const landId = purchaseLandBtn.dataset.landId;
    const LastChanged = purchaseLandBtn.dataset.lastChanged;
    console.log(LastChanged);
    await buyLand(landId, LastChanged);
  });
}

const createLandBtn = document.querySelector("#create-land");

const LandName = document.querySelector("[name=LandName]");
const ZoningReg = document.querySelector("[name=ZoningReg]");
const Topography = document.querySelector("[name=Topography]");
const Size = document.querySelector("[name=Size]");
const LandBoundaries = document.querySelector("[name=LandBoundaries]");
const Price = document.querySelector("[name=Price]");
const Location = document.querySelector("[name=Location]");
const State = document.querySelector("[name=State]");
const City = document.querySelector("[name=City]");
const LGA = document.querySelector("[name=LGA]");
const Lng = document.querySelector("[name=Lng]");
const Lat = document.querySelector("[name=Lat]");
const Description = document.querySelector("[name=Description]");

const fields = [
  "LandName",
  "ZoningReg",
  "Topography",
  "Size",
  "LandBoundaries",
  "Price",
  "Location",
  "State",
  "City",
  "LGA",
  "Lng",
  "Lat",
  "Description",
];

function validateForm() {
  let valid = true;

  for (let field of fields) {
    console.log(field);
    let element = document.querySelector(`[name=${field}]`);

    if (element) {
      if (element.value.trim() == "") {
        let selectViz = element.parentElement.querySelector(
          ".ui-selectmenu-button"
        );
        if (selectViz) {
          selectViz.classList.add("error");
        } else {
          element.classList.add("error");
        }
        valid = false;
      }
    }
  }
  return valid;
}
if (createLandBtn) {
  const createLandFormData = new FormData();
  // Initialize Dropzone
  var myDropzone = new Dropzone("#myDropZone", {
    autoProcessQueue: false, // Disable automatic upload
    dictDefaultMessage: "Drop files here or click to upload.",
    paramName: "uploadedFiles",
    url: "javascript:void(0)",
  });

  // Listen for the addedfile event
  myDropzone.on("addedfile", function (file) {
    // Add the file to the addArtformData object
    createLandFormData.append("uploadedFiles", file);
  });

  createLandBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      for (let field of fields) {
        createLandFormData.append(
          field,
          document.querySelector(`[name=${field}]`).value
        );
      }
      console.log(createLandFormData);
    }
  });
}
