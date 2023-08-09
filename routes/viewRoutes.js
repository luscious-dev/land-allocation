const express = require("express");

const authController = require("../controllers/authController");
const purchaseController = require("../controllers/purchaseController");
const viewControllers = require("../controllers/viewController");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.use(authController.isLoggedIn);
router.get(
  "/",
  purchaseController.createPurchaseCheckout,
  viewControllers.getHome
);
router.get("/about", viewControllers.getAbout);
router.get("/land-listing", viewControllers.getListings);
router.get("/land/:slug", viewControllers.getOneLand);

router.use(authController.protect);

router.get(
  "/dashboard",
  authController.restrict("admin"),
  viewControllers.getDashboard
);

router.get(
  "/cofo-applications",
  authController.restrict("admin"),
  catchAsync(async (req, res, next) => {
    res.render("admin/bookings");
  })
);

router.get("/profile", viewControllers.getProfile);

router.get(
  "/add-land",
  authController.restrict("admin"),
  viewControllers.addLand
);

router.get(
  "/lands",
  authController.restrict("admin"),
  viewControllers.allLands
);

router.get(
  "/edit-land/:slug",
  authController.restrict("admin"),
  viewControllers.editLand
);
router.get("/my-lands", viewControllers.myLands);
router.get("/apply-cofo/:slug", viewControllers.applyCofo);

module.exports = router;
