const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await new User().readAll();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.Id;
  next();
};

exports.getOne = catchAsync(async (req, res, next) => {
  const user = await new User().readOne(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const user = await new User().create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const user = await new User().deleteOne(req.params.id, { out: true });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.Id;
  next();
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const user = await new User().updateOne(
    req.params.id,
    req.body.LastChanged,
    req.body
  );
  if (!user) {
    return next(new AppError("No user found with ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
