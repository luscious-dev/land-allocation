const CofOApplication = require("../models/CofOApplication");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
  const application = await new CofOApplication().create(req.body);
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
