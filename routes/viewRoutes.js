const express = require("express");

const authController = require("../controllers/authController");
const purchaseController = require("../controllers/purchaseController");
const viewControllers = require("../controllers/viewController");
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

router.get("/dashboard", viewControllers.getDashboard);

router.get("/profile", viewControllers.getProfile);

router.get("/add-land", viewControllers.addLand);

router.get("/lands", viewControllers.allLands);

router.get("/edit-land/:slug", viewControllers.editLand);
router.get("/my-lands", viewControllers.myLands);

module.exports = router;
