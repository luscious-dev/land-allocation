const express = require("express");
const router = express.Router();
const landController = require("../controllers/landController");

const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrict("admin"));

router.get("/", landController.getAll);
// Danwake
router.get("/:id", landController.getOne);

router.post("/", landController.createOne);

router.delete("/:id", landController.deleteOne);

router.patch("/:id", landController.updateOne);

module.exports = router;
