const LandImage = require("../models/LandImage");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
  const landImages = await new LandImage().readAll();
  res.status(200).json({
    status: "success",
    data: {
      landImages,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const landImage = await new LandImage().readOne(req.params.id);
  if (!landImage) {
    return next(new AppError("No land image found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      landImage,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const landImage = await new LandImage().create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      landImage,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const landImage = await new LandImage().deleteOne(req.params.id, {
    out: true,
  });
  if (!landImage) {
    return next(new AppError("No land image found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const landImage = await new LandImage().updateOne(
    req.params.id,
    undefined,
    req.body
  );
  if (!landImage) {
    return next(new AppError("No land image found with ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      landImage,
    },
  });
});
