const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const allocatedController = require("../controllers/allocatedController");

router.use(authController.protect);
router.use(authController.restrict("admin"));
router.get(
  "/",
  authController.protect,
  authController.restrict("admin"),
  allocatedController.getAll
);
// Danwake
router.get("/:id", allocatedController.getOne);

router.post("/", allocatedController.createOne);

router.delete("/:id", allocatedController.deleteOne);

router.patch("/:id", allocatedController.updateOne);

module.exports = router;
