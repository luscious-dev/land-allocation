const Land = require("../models/Land");
const LandImage = require("../models/LandImage");
const CofOApplication = require("../models/CofOApplication");
const catchAsync = require("../utils/catchAsync");

exports.getHome = catchAsync(async (req, res, next) => {
  const lands = await new Land().readConditional("isPopular = 1");
  for (let land of lands) {
    const landImage = (
      await new LandImage().readConditional(`LandId = ${land.Id}`)
    )[0];
    land.image = landImage.ImageName;
  }
  res.status(200).render("home", { lands, title: "Home", page: "home" });
});

exports.getAbout = (req, res, next) => {
  res.status(200).render("about-us", { title: "About Me", page: "about" });
};

exports.getListings = catchAsync(async (req, res, next) => {
  const lands = await new Land().readAll();
  for (let land of lands) {
    const landImage = (
      await new LandImage().readConditional(`LandId = ${land.Id}`)
    )[0];
    land.image = landImage.ImageName;
  }

  const popularLands = lands.filter((land) => {
    return land.isPopular == true;
  });

  res.status(200).render("land-listings", {
    lands,
    popularLands,
    title: "Listings",
    page: "listing",
  });
});

exports.getOneLand = catchAsync(async (req, res, next) => {
  const lands = await new Land().readAll();
  for (let land of lands) {
    const landImage = (
      await new LandImage().readConditional(`LandId = ${land.Id}`)
    )[0];
    land.image = landImage.ImageName;
  }

  const popularLands = lands.filter((land) => {
    return land.isPopular == true;
  });
  const land = lands.filter((land) => {
    return land.Slug == req.params.slug;
  })[0];

  res
    .status(200)
    .render("land-details", { land, popularLands, title: land.LandName });
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  const landCount = (await new Land().readAll()).length;
  const unavailableLandCount = (
    await new Land().readConditional("Allocated = 1")
  ).length;
  const availableLandCount = landCount - unavailableLandCount;

  const cofoCount = (await new CofOApplication().readAll()).length;
  const cofoApprovedCount = (
    await new CofOApplication().readConditional("Approved = 1")
  ).length;
  const cofoPendingCount = (
    await new CofOApplication().readConditional("Approved = 1 AND DelFlag = 0")
  ).length;
  const cofoDeletedCount = (
    await new CofOApplication().readConditional("DelFlag = 1")
  ).length;

  const data = {
    landCount,
    unavailableLandCount,
    availableLandCount,
    cofoApprovedCount,
    cofoDeletedCount,
    cofoCount,
    cofoPendingCount,
  };
  console.log(data);
  res.status(200).render("admin/dashboard", {
    title: "Dashboard",
    page: "dashboard",
    data,
  });
});

exports.getProfile = (req, res, next) => {
  res
    .status(200)
    .render("admin/my-profile", { title: "Profile", page: "profile" });
};

exports.addLand = (req, res, next) => {
  res.status(200).render("admin/add-land", { title: "New Land" });
};

exports.allLands = catchAsync(async (req, res, next) => {
  const lands = await new Land().readAll();
  console.log(lands);
  for (let land of lands) {
    const landImage = (
      await new LandImage().readConditional(`LandId = ${land.Id}`)
    )[0];
    land.Image = landImage.ImageName;
  }
  lands.sort((a, b) => {
    return a.Allocated - b.Allocated;
  });
  res
    .status(200)
    .render("admin/lands", { title: "All Lands", page: "lands", lands });
});

exports.editLand = (req, res, next) => {
  res.status(200).render("admin/edit-land", { title: "Edit Land" });
};

exports.myLands = (req, res, next) => {
  res
    .status(200)
    .render("admin/my-lands", { title: "My Lands", page: "my lands" });
};
