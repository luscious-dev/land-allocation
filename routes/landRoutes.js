const express = require("express");
const router = express.Router();
const landController = require("../controllers/landController");

const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrict("admin"));

router.get("/", landController.getAll);
// Danwake
router.get("/:id", landController.getOne);

router.post(
  "/",
  authController.protect,
  authController.restrict("admin"),
  landController.uploadLandImages,
  landController.resizeUploadedLandImage,
  landController.createOne
);

router.delete("/:id", landController.deleteOne);

router.patch(
  "/:id",
  authController.protect,
  authController.restrict("admin"),
  landController.uploadLandImages,
  landController.resizeUploadedLandImage,
  landController.updateOne
);

module.exports = router;
