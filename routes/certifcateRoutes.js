const express = require("express");
const router = express.Router();

const certificatesController = require("../controllers/certificatesController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrict("admin"));
router.get("/", certificatesController.getAllCertificates);
// Danwake
router.get("/:id", certificatesController.getOneCertificate);

router.post("/", certificatesController.addCertificates);

router.delete("/:id", certificatesController.deleteCertificate);

router.patch("/:id", certificatesController.updateCertifcate);

module.exports = router;
