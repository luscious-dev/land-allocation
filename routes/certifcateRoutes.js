const express = require("express");
const router = express.Router();

const certificatesController = require("../controllers/certificatesController");
const authController = require("../controllers/authController");
const AppError = require("../utils/appError");

router.use(authController.protect);
router.post(
  "/",
  certificatesController.uploadCofo,
  certificatesController.addCertificates
);

router.get("/print-certficate/:id", certificatesController.printCertifcate);

router.use(authController.restrict("admin"));
router.get("/", certificatesController.getAllCertificates);

// Danwake
router.get("/:id", certificatesController.getOneCertificate);

router.delete("/:id", certificatesController.deleteCertificate);

router.patch("/:id", certificatesController.updateCertifcate);

module.exports = router;
