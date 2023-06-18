const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");

const signToken = (Id) => {
  const token = jwt.sign({ Id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const setJwtCookie = function (res, token) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
};

// Sign up
exports.signup = catchAsync(async (req, res, next) => {
  if (req.body) {
    if (req.body.Password != req.body.PasswordConfirm) {
      return next(new AppError("Your passwords do not match!", 400));
    }
  }
  const user = await new User().create(req.body);
  const token = signToken(user.Id);

  setJwtCookie(res, token);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

// Login
exports.login = catchAsync(async (req, res, next) => {
  const userList = await new User().readConditional(
    `Email = '${req.body.Email}'`
  );
  if (!userList) {
    return new next(new AppError("Incorrect username or password", 401));
  }
  const user = userList[0];
  if (!(await bcrypt.compare(req.body.Password, user.Password))) {
    return new next(new AppError("Incorrect username or password", 401));
  }
  delete user["Password"];
  delete user["PasswordChangedAt"];
  delete user["DateCreated"];

  const token = signToken(user.Id);
  setJwtCookie(res, token);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

// Protect
exports.protect = catchAsync(async (req, res, next) => {
  // Check if there is cookie
  if (!req.cookies.jwt) {
    return next(new AppError("You are not logged in!", 401));
  }

  // Check if the user exists
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  const user = await new User().readOne(decoded.Id);

  if (!user) {
    return next(
      new AppError("The user for which token was generated was deleted", 401)
    );
  }

  req.user = user;
  next();
});

// Restrict
exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role)) {
      return next(
        new AppError("You are not authorized to view this resource", 403)
      );
    }
    next();
  };
};
