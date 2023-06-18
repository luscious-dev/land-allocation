const express = require("express");
const router = express.Router();
const landImageController = require("../controllers/landImageController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrict("admin"));

router.get("/", landImageController.getAll);
// Danwake
router.get("/:id", landImageController.getOne);

router.post("/", landImageController.createOne);

router.delete("/:id", landImageController.deleteOne);

router.patch("/:id", landImageController.updateOne);

module.exports = router;
