const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);
router.get("/me", userController.getMe, userController.getOne);
router.post("/updateMe", userController.updateMe, userController.updateOne);

router.use(authController.restrict("admin"));

// Danwake
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.post("/", userController.createOne);
router.delete("/:id", userController.deleteOne);
router.patch("/:id", userController.updateOne);

module.exports = router;
