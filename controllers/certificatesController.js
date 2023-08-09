const CofOApplication = require("../models/CofOApplication");
const Land = require("../models/Land");
const AllocatedTo = require("../models/AllocatedTo");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const fs = require("fs");

function deleteImages(filesObject) {
  let keys = Object.keys(filesObject);
  for (let key of keys) {
    const path = filesObject[key][0].path;
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "passportPhoto") {
      cb(null, "public/img/cofo/passport");
    } else if (file.fieldname === "evidenceOfLandUse") {
      cb(null, "public/img/cofo/landuse");
    } else if (file.fieldname === "buildingPlan") {
      cb(null, "public/img/cofo/buildingplan");
    } else if (file.fieldname === "businessProposal") {
      cb(null, "public/img/cofo/proposal");
    } else if (file.fieldname === "affidavit") {
      cb(null, "public/img/cofo/affidavit");
    } else if (file.fieldname === "siteLayout") {
      cb(null, "public/img/cofo/sitelayout");
    }
  },
  filename: (req, file, cb) => {
    let ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${req.user.Id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("You can only upload images and pdfs", 400), false);
  }
};

exports.uploadCofo = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).fields([
  { name: "passportPhoto", maxCount: 1 },
  { name: "evidenceOfLandUse", maxCount: 1 },
  { name: "buildingPlan", maxCount: 1 },
  { name: "businessProposal", maxCount: 1 },
  { name: "affidavit", maxCount: 1 },
  { name: "siteLayout", maxCount: 1 },
]);

exports.getAllCertificates = catchAsync(async (req, res, next) => {
  const applications = await new CofOApplication().readAll();
  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  });
});

exports.getOneCertificate = catchAsync(async (req, res, next) => {
  const application = await new CofOApplication().readOne(req.params.id);
  if (!application) {
    return next(new AppError("No CofO application with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});

exports.addCertificates = catchAsync(async (req, res, next) => {
  // Check if user owns the land in the first place
  const existingAllocation = await new AllocatedTo().readConditional(
    `UserId = ${req.user.Id} AND LandId = ${req.body.LandId}`
  );

  if (existingAllocation.length == 0) {
    deleteImages(req.files);
    return next(new AppError("You don't have ownership of this land", 400));
  }

  // Check if theres an application for the land
  const existingApplication = (
    await new CofOApplication().readConditional(
      `UserId = ${req.user.Id} AND LandId = ${req.body.LandId}`
    )
  )[0];

  if (existingApplication) {
    if (existingApplication.Approved) {
      deleteImages(req.files);
      return next(
        new AppError("You already have an application on this land", 400)
      );
    }

    // I need to ensure that users can only place one application in a week
    let applicationDate = new Date(existingApplication.ApplicationDate);
    let applicationExpiry = new Date(
      applicationDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // If the user places another request within 1 week of the previous request, throw error
    if (applicationExpiry > Date.now()) {
      deleteImages(req.files);
      return next(
        new AppError(
          `You have an application already in progress. Try again after ${applicationExpiry.toLocaleString()}`
        )
      );
    } else {
      // Otherwise delete the old request
      await new CofOApplication().deleteOne(existingApplication.Id);
    }
  }
  const land = (
    await new Land().readConditional(
      `DelFlag = 0 AND Id = '${req.body.LandId}'`
    )
  )[0];

  if (!land)
    return next(new AppError("Cannot apply for CofO on this land!", 400));

  const application = await new CofOApplication().create({
    UserId: req.user.Id,
    LandId: req.body.LandId,
    SiteLayout: req.files.siteLayout
      ? req.files.siteLayout[0].filename
      : undefined,
    AffidavitOfLandUse: req.files.affidavit
      ? req.files.affidavit[0].filename
      : undefined,
    BusinessProposal: req.files.businessProposal
      ? req.files.businessProposal[0].filename
      : undefined,
    ProposedBuildingPlan: req.files.buildingPlan
      ? req.files.buildingPlan[0].filename
      : undefined,
    PurposeOfLandUse: Land.ZoningReg,
    EvidenceOfLandUse: req.files.evidenceOfLandUse
      ? req.files.evidenceOfLandUse[0].filename
      : undefined,
    PassportPhoto: req.files.passportPhoto
      ? req.files.passportPhoto[0].filename
      : undefined,
  });
  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});

exports.deleteCertificate = catchAsync(async (req, res, next) => {
  const application = await new CofOApplication().deleteOne(req.params.id, {
    out: true,
  });
  if (!application) {
    return next(new AppError("No CofO application with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateCertifcate = catchAsync(async (req, res, next) => {
  const application = await new CofOApplication().updateOne(
    req.params.id,
    req.body.LastChanged,
    req.body
  );
  if (!application) {
    return next(new AppError("No CofO application with that ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});
