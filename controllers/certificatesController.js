const CofOApplication = require("../models/CofOApplication");
const Land = require("../models/Land");
const AllocatedTo = require("../models/AllocatedTo");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");

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

exports.printCertifcate = catchAsync(async (req, res, next) => {
  const application = await new CofOApplication().readOne(req.params.id);

  if (!application)
    return next(new AppError("Certificate does not exist", 404));
  if (application.UserId != req.user.Id)
    return next(
      new AppError("The Ownership right does not belong to you!", 403)
    );
  if (!application.Approved)
    return next(new AppError("You have not yet been given a certificate", 400));

  const land = await new Land().readOne(application.LandId);
  if (!land) return next(new AppError("Something went wrong!", 500));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const content = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Ownership</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }
            .certificate {
                border: 2px solid #000;
                padding: 20px;
                text-align: center;
                width: 70%;
                margin: 0 auto;
            }
            .logo {
                width: 100px;
                height: auto;
            }
            h1 {
                margin-bottom: 10px;
            }
            p {
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <img class="logo" src="https://th.bing.com/th/id/OIP.YyBCjNC4AkVogJUMIiVvMwAAAA?pid=ImgDet&rs=1" alt="Nigeria National Emblem">
            <h1>Certificate of Ownership</h1>
            <p>This is to certify that</p>
            <p><strong>${req.user.FirstName} ${req.user.LastName}</strong></p>
            <p>is the rightful owner of the land described below:</p>
            <p><strong>Land Parcel:</strong> ${land.LandName}</p>
            <p><strong>Location:</strong> ${land.Location}</p>
            <p><strong>Certificate ID:</strong> ${application.Id}</p>
            <p>This certificate is issued under the laws of Nigeria to confirm the ownership of the above-mentioned land.</p>
            <p>Date of Issue: ${new Date(
              application.ApplicationDate
            ).toLocaleDateString()}</p>
            <p>This certificate is non-transferable and serves as proof of ownership.</p>
        </div>
    </body>
    </html>
    `;
  await page.setContent(content);
  // await page.addStyleTag({ path: path.join(__dirname, "../custom.css") });
  const pdfBuffer = await page.pdf();

  await browser.close();

  if (!pdfBuffer)
    return next(
      new AppError("Something went wrong while downloading the file", 500)
    );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="certifcate_of_ownership-${req.params.id}.pdf"`
  );
  res.send(pdfBuffer);
});
