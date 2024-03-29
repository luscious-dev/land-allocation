const Land = require("../models/Land");
const LandImage = require("../models/LandImage");
const CofOApplication = require("../models/CofOApplication");
const User = require("../models/User");
const AllocatedTo = require("../models/AllocatedTo");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHome = catchAsync(async (req, res, next) => {
  const lands = await new Land().readConditional(
    "isPopular = 1 AND DelFlag = 0"
  );
  for (let land of lands) {
    const landImages = await new LandImage().readConditional(
      `LandId = ${land.Id}`
    );
    const landImage = landImages[landImages.length - 1];
    if (landImage) land.image = landImage.ImageName;
  }
  res.status(200).render("home", { lands, title: "Home", page: "home" });
});

exports.getAbout = (req, res, next) => {
  res.status(200).render("about-us", { title: "About Me", page: "about" });
};

exports.getListings = catchAsync(async (req, res, next) => {
  const lands = await new Land().readAll();
  for (let land of lands) {
    const landImages = await new LandImage().readConditional(
      `LandId = ${land.Id}`
    );
    const landImage = landImages[landImages.length - 1];
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
  const lands = await new Land().readConditional(`DelFlag = 0`);
  for (let land of lands) {
    const landImages = await new LandImage().readConditional(
      `LandId = ${land.Id}`
    );
    const landImage = landImages[landImages.length - 1];
    if (landImage) land.image = landImage.ImageName;
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
  const landCount = (await new Land().readConditional(`DelFlag = 0`)).length;
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
  const lands = await new Land().readConditional(`DelFlag = 0`);
  for (let land of lands) {
    const landImages = await new LandImage().readConditional(
      `LandId = ${land.Id}`
    );
    const landImage = landImages[landImages.length - 1];
    if (landImage) land.Image = landImage.ImageName;
  }
  lands.sort((a, b) => {
    return a.Allocated - b.Allocated;
  });
  res
    .status(200)
    .render("admin/lands", { title: "All Lands", page: "lands", lands });
});

exports.editLand = catchAsync(async (req, res, next) => {
  const land = (
    await new Land().readConditional(
      `DelFlag = 0 AND Slug = '${req.params.slug}'`
    )
  )[0];

  const landImages = await new LandImage().readConditional(
    `LandId = ${land.Id}`
  );
  const landImage = landImages[landImages.length - 1];
  land.Image = landImage.ImageName;
  res.status(200).render("admin/edit-land", { title: "Edit Land", land });
});

exports.myLands = async (req, res, next) => {
  const myAllocations = await new AllocatedTo().readConditional(
    `UserId = ${req.user.Id}`
  );
  const myLands = [];
  for (let allocation of myAllocations) {
    const land = await new Land().readOne(allocation.LandId);
    land.hasCofo = false;

    if (land) {
      const landImages = await new LandImage().readConditional(
        `LandId = ${land.Id}`
      );
      const landImage = landImages[landImages.length - 1];
      const cofoApplication = await new CofOApplication().readConditional(
        `UserId = ${req.user.Id} AND LandId = ${land.Id} AND Approved = 1`
      );
      if (cofoApplication.length > 0) {
        land.hasCofo = true;
        land.cofoId = cofoApplication[0].Id;
      }
      land.Image = landImage.ImageName;

      // console.log(land);
      myLands.push(land);
    }
  }
  res
    .status(200)
    .render("admin/my-lands", { title: "My Lands", page: "my lands", myLands });
};

exports.applyCofo = async (req, res, next) => {
  const land = (
    await new Land().readConditional(
      `DelFlag = 0 AND Slug = '${req.params.slug}'`
    )
  )[0];
  if (!land)
    return next(new AppError("You don't have ownership of this land", 400));

  // Check if user owns the land in the first place
  const myAllocations = await new AllocatedTo().readConditional(
    `UserId = ${req.user.Id} AND LandId = ${land.Id}`
  );

  if (myAllocations.length == 0)
    return next(new AppError("You don't have ownership of this land", 400));

  const existingApplication = (
    await new CofOApplication().readConditional(
      `UserId = ${req.user.Id} AND LandId = ${land.Id} AND Approved = 1`
    )
  )[0];

  if (existingApplication)
    return next(new AppError("You already have a CofO on this land", 400));

  res
    .status(200)
    .render("admin/apply-cofo", { title: "CofO Application Form", land });
};

exports.getCofoApplications = catchAsync(async (req, res, next) => {
  const applications = await new CofOApplication().readConditional(
    "Approved = 0 AND DelFlag = 0"
  );
  for (let application of applications) {
    const land = await new Land().readOne(application.LandId);
    const user = await new User().readOne(application.UserId);
    application.LandName = land.LandName;
    application.FirstName = user.FirstName;
    application.LastName = user.LastName;
    application.Email = user.Email;
    application.Phone = user.Phone;
  }

  console.log(applications);
  res.render("admin/cofo-applications", {
    page: "cofo",
    title: "CofO Applications",
    applications,
  });
});
exports.viewCofoApplication = catchAsync(async (req, res, next) => {
  const application = (
    await new CofOApplication().readConditional(
      `Id = ${req.params.id} AND DelFlag = 0`
    )
  )[0];

  if (!application)
    return next(new AppError("Application does not exist!", 404));
  const land = await new Land().readOne(application.LandId);
  const user = await new User().readOne(application.UserId);
  application.FirstName = user.FirstName;
  application.LastName = user.LastName;
  application.Email = user.Email;
  application.Phone = user.Phone;
  application.LandName = land.LandName;
  application.Location = land.Location;
  application.ZoningReg = land.ZoningReg;

  console.log(application);
  res.render("admin/cofo-application-info", {
    page: "cofo",
    title: "CofO Applications",
    application,
  });
});
