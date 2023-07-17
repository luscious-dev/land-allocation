const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const authController = require("../controllers/authController");

router.post(
  "/checkout-session/:landId",
  authController.protect,
  purchaseController.createCheckoutSession
);

module.exports = router;
