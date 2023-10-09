const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");

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
  delete req.body.Password;
  delete req.body.Email;
  console.log(req.body);
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

exports.updatePassword = catchAsync(async (req, res, next) => {
  const isUser = await bcrypt.compare(
    req.body.currentPassword,
    req.user.Password
  );
  if (isUser && req.body.newPassword == req.body.confirmPassword) {
    const user = await new User().updateOne(
      req.params.id,
      req.body.LastChanged,
      {
        Password: req.body.newPassword,
      }
    );
    if (!user) {
      return next(new AppError("No user found with that ID", 400));
    }
    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }

  return res.status(401).json({
    status: "fail",
    message: "Password change unsuccessful!",
  });
});
