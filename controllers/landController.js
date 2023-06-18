const Land = require("../models/Land");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
  const land = await new Land().create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      land,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const land = await new Land().deleteOne(req.params.id, { out: true });
  if (!land) {
    return next(new AppError("No land found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const land = await new Land().updateOne(
    req.params.id,
    req.body.LastChanged,
    req.body
  );
  if (!land) {
    return next(new AppError("No land found with ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      land,
    },
  });
});
