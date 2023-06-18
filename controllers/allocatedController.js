const AllocatedTo = require("../models/AllocatedTo");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
  const allocations = await new AllocatedTo().readAll();
  res.status(200).json({
    status: "success",
    data: {
      allocations,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const allocation = await new AllocatedTo().readOne(req.params.id);
  if (!allocation) {
    return next(new AppError("No allocation with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      allocation,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const allocation = await new AllocatedTo().create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      allocation,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const allocation = await new AllocatedTo().deleteOne(req.params.id, {
    out: true,
  });
  if (!allocation) {
    return next(new AppError("No allocation with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.updateOne = catchAsync(async (req, res, next) => {
  const allocation = await new AllocatedTo().updateOne(
    req.params.id,
    undefined,
    req.body
  );
  if (!allocation) {
    return next(new AppError("No allocation with that ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      allocation,
    },
  });
});
