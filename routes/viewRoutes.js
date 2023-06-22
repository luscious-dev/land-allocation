const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).render("home");
});
router.get("/about", (req, res, next) => {
  res.status(200).render("about-us");
});
router.get("/land-listing", (req, res, next) => {
  res.status(200).render("land-listings");
});
router.get("/land/:id", (req, res, next) => {
  res.status(200).render("land-details");
});
router.get("/404", (req, res, next) => {
  res.status(200).render("404");
});

module.exports = router;
