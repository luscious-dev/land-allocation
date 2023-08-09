const Land = require("../models/Land");
const LandImage = require("../models/LandImage");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFileter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("You can only upload images", 400), false);
  }
};

exports.uploadLandImages = multer({
  storage: multerStorage,
  fileFilter: multerFileter,
}).array("uploadedFiles");

exports.resizeUploadedLandImage = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const newFiles = req.files.map((file) => {
    file.filename = `lands-${req.body.LandName.replace(
      /[.\s]/g,
      "-"
    )}-${Date.now()}.png`;
    const sizes = [
      {
        width: 370,
        height: 295,
        output: path.join(
          __dirname,
          `../public/img/land/home/${file.filename}`
        ),
      },
      {
        width: 800,
        height: 638,
        output: path.join(
          __dirname,
          `../public/img/land/detail/${file.filename}`
        ),
      },
      {
        width: 112,
        height: 89,
        output: path.join(
          __dirname,
          `../public/img/land/mini/${file.filename}`
        ),
      },
    ];

    sizes.forEach(({ width, height, output }) => {
      return sharp(file.buffer)
        .resize(width, height, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toFormat("png", { force: true })
        .png({ quality: 90 })
        .toFile(output);
    });
  });

  await Promise.all(newFiles);

  next();
});

exports.getAll = catchAsync(async (req, res, next) => {
  const lands = await new Land().readAll();
  res.status(200).json({
    status: "success",
    data: {
      lands,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const land = await new Land().readOne(req.params.id);
  if (!land) {
    return next(new AppError("No land found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      land,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  console.log("From the browser ---");
  console.log(req.body);
  req.body.AddedBy = req.user.Id;
  if (req.files.length == 0)
    return next(new AppError("Land must have at least one image", 400));
  const land = await new Land().create(req.body);
  if (land) {
    console.log(req.files);
    for (let file of req.files) {
      await new LandImage().create({
        LandId: land.Id,
        ImageName: file.filename,
      });
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      land,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const tmpLand = await new Land().readOne(req.params.id);
  if (!tmpLand) return next(new AppError("No Land found with that ID 1", 404));

  const land = await new Land().deleteOneFlag(
    req.params.id,
    tmpLand.LastChanged
  );
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  console.log("From the browser! --");
  console.log(req.body);
  const land = await new Land().updateOne(
    req.params.id,
    JSON.parse(req.body.LastChanged),
    req.body
  );

  if (!land) {
    return next(new AppError("No land found with ID", 400));
  }
  if (req.files.length != 0) {
    if (land) {
      for (let file of req.files) {
        await new LandImage().create({
          LandId: land.Id,
          ImageName: file.filename,
        });
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      land,
    },
  });
});
