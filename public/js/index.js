import { login, logout, signUp } from "./login";
import { buyLand } from "./stripe";
import {
  addLand,
  updateLand,
  deleteLand,
  applyForCofo,
  printCofo,
  approveCofo,
  rejectCofo,
} from "./land";
import Dropzone from "dropzone";

const signInPopup = document.getElementById("sign-popup");
const email = document.querySelector("[name=username]");
const password = document.querySelector("[name=password]");
const signInBtn = document.querySelector("#sign-in");
const logoutBtn = document.querySelector("#log-out");
const signupBtn = document.querySelector("#register");

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
  purchaseLandBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.target.textContent = "Processing...";
    const landId = purchaseLandBtn.dataset.landId;
    const LastChanged = purchaseLandBtn.dataset.lastChanged;
    console.log(LastChanged);
    await buyLand(landId, LastChanged);
  });
}

if (signupBtn) {
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const firstName = document.querySelector("[name=firstname]");
    const lastName = document.querySelector("[name=lastname]");
    const middleName = document.querySelector("[name=middlename]");
    const phone = document.querySelector("[name=phone]");
    const email = document.querySelector("[name=email]");
    const password = document.querySelector("#password");
    const passwordConfirm = document.querySelector("#passwordConfirm");

    let isValid = true;
    if (firstName.value.trim() == "") {
      firstName.setAttribute("style", "border: 1px solid red;");
      isValid = false;
      setTimeout(() => {
        firstName.removeAttribute("style");
      }, 2000);
    }
    if (lastName.value.trim() == "") {
      lastName.setAttribute("style", "border: 1px solid red;");
      isValid = false;
      setTimeout(() => {
        lastName.removeAttribute("style");
      }, 2000);
    }
    if (email.value.trim() == "") {
      email.setAttribute("style", "border: 1px solid red;");
      isValid = false;
      setTimeout(() => {
        email.removeAttribute("style");
      }, 2000);
    }
    if (phone.value.trim() == "") {
      phone.setAttribute("style", "border: 1px solid red;");
      isValid = false;
      setTimeout(() => {
        phone.removeAttribute("style");
      }, 2000);
    }
    if (password.value.trim() == "") {
      password.setAttribute("style", "border: 1px solid red;");
      isValid = false;
      setTimeout(() => {
        password.removeAttribute("style");
      }, 2000);
    }
    if (passwordConfirm.value.trim() == "") {
      passwordConfirm.setAttribute("style", "border: 1px solid red;");
      isValid = false;
      setTimeout(() => {
        passwordConfirm.removeAttribute("style");
      }, 2000);
    }
    if (isValid) {
      signUp({
        FirstName: firstName.value,
        LastName: lastName.value,
        MiddleName: middleName.value,
        Email: email.value,
        Phone: phone.value,
        Password: password.value,
        PasswordConfirm: password.value,
      });
    }
  });
}

const createLandBtn = document.querySelector("#create-land");
const updateLandBtn = document.querySelector("#update-land");

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
  "Accessibility",
  "nearShops",
  "nearHospital",
  "hasElectricity",
  "hasWater",
  "isFenced",
  "isCleared",
  "isPopular",
];

let checkboxFields = [
  "Accessibility",
  "nearShops",
  "nearHospital",
  "hasElectricity",
  "hasWater",
  "isFenced",
  "isCleared",
  "isPopular",
];

function validateForm() {
  let valid = true;

  for (let field of fields) {
    let element = document.querySelector(`[name=${field}]`);

    if (element) {
      if (element.value.trim() == "") {
        let selectViz = element.parentElement.querySelector(
          ".ui-selectmenu-button"
        );
        if (selectViz) {
          selectViz.classList.add("error");
          setTimeout(() => {
            selectViz.classList.remove("error");
          }, 1500);
        } else {
          element.classList.add("error");
          setTimeout(() => {
            element.classList.remove("error");
          }, 3000);
        }
        console.log(element.value);
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
        if (checkboxFields.includes(field)) {
          createLandFormData.set(
            field,
            !!document.querySelector(`[name=${field}]`).checked
          );
        } else {
          createLandFormData.set(
            field,
            document.querySelector(`[name=${field}]`).value
          );
        }
      }

      addLand(createLandFormData);
      console.log("Land Added 2");
    }
  });
}

if (updateLandBtn) {
  fields.push("LastChanged");

  const updateLandFormData = new FormData();
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
    updateLandFormData.append("uploadedFiles", file);
  });

  updateLandBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      for (let field of fields) {
        console.log(field);
        if (checkboxFields.includes(field)) {
          updateLandFormData.set(
            field,
            document.querySelector(`[name=${field}]`).checked
          );
        } else {
          updateLandFormData.set(
            field,
            document.querySelector(`[name=${field}]`).value
          );
        }
      }
      const landId = updateLandBtn.dataset.landId;

      updateLand(landId, updateLandFormData);
      console.log("Land Added 2");
    }
  });
}

const deleteLandButtons = document.querySelectorAll(".delete-land a");

for (let btn of deleteLandButtons) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const landId = btn.closest(".delete-land").dataset.landId;
    const propertyBlock = btn.closest(".property-block");
    console.log(`${landId} deleted`);
    const choice = window.confirm("Do you really want to delete this land?");
    if (choice) {
      deleteLand(landId, propertyBlock);
    }
  });
}

const printCofoBtn = document.querySelector("#print-cofo");
if (printCofoBtn) {
  printCofoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const applicationId = printCofoBtn.dataset.cofoId;
    if (applicationId) printCofo(applicationId);
  });
}

const applyForCofoBtn = document.querySelector("#apply-cofo");
if (applyForCofoBtn) {
  applyForCofoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cofoApplicationFormData = new FormData();
    cofoApplicationFormData.set(
      "passportPhoto",
      document.querySelector("#passport-photo").files[0]
    );
    cofoApplicationFormData.set(
      "evidenceOfLandUse",
      document.querySelector("#land-use").files[0]
    );
    cofoApplicationFormData.set(
      "buildingPlan",
      document.querySelector("#building-plan").files[0]
    );
    cofoApplicationFormData.set(
      "businessProposal",
      document.querySelector("#business-proposal").files[0]
    );
    cofoApplicationFormData.set(
      "affidavit",
      document.querySelector("#land-use").files[0]
    );
    cofoApplicationFormData.set(
      "siteLayout",
      document.querySelector("#site-layout").files[0]
    );
    cofoApplicationFormData.set("LandId", applyForCofoBtn.dataset.landId);

    applyForCofo(cofoApplicationFormData);
  });
}

const applicationPage = document.querySelector(".applications");

if (applicationPage) {
  const acceptBtns = document.querySelectorAll(".accept");
  const rejectBtns = document.querySelectorAll(".reject");

  for (let acceptBtn of acceptBtns) {
    acceptBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const applicationId = acceptBtn.dataset.applicationId;
      const lastChanged = JSON.parse(acceptBtn.dataset.lastChanged);
      const articleCard = acceptBtn.closest("article");
      if (confirm("Do you really wish to approve this application?"))
        approveCofo(applicationId, lastChanged, articleCard);
    });
  }
  for (let rejectBtn of rejectBtns) {
    rejectBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const applicationId = rejectBtn.dataset.applicationId;
      const lastChanged = JSON.parse(rejectBtn.dataset.lastChanged);
      const articleCard = rejectBtn.closest("article");
      if (confirm("Do you really wish to reject this application?"))
        rejectCofo(applicationId, lastChanged, articleCard);
    });
  }
}
