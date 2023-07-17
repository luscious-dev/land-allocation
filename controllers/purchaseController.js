const AllocatedTo = require("../models/AllocatedTo");
const AppError = require("../utils/appError");
const Land = require("../models/Land");
const catchAsync = require("../utils/catchAsync");

// Require stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create checkout session

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const land = await new Land().readOne(req.params.landId);

  if (!land) return next(new AppError("No land with that ID", 404));

  if (land.Allocated)
    return next(new AppError("Land already belongs to somone", 400));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?LandId=${
      land.Id
    }&LastChanged=${JSON.stringify(req.body.LastChanged)}`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.Email,
    mode: "payment",
    client_reference_id: land.Id,

    line_items: [
      {
        price_data: {
          currency: "ngn",
          unit_amount: land.Price * 100,
          product_data: {
            name: land.LandName,
            description: land.Description,
            images: [
              `https://services-media.propertylogic.net/blog/1448297869/land_1.jpg`,
            ],
          },
        },
        quantity: 1,
      },
    ],
  });

  // await new AllocatedTo().create({
  //   UserId: req.user.Id,
  //   LandId: land.Id,
  // });

  // await new Land().updateOne(land.Id, req.body.LastChanged, {
  //   Allocated: true,
  // });

  // Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createPurchaseCheckout = catchAsync(async (req, res, next) => {
  const { LandId, LastChanged } = req.query;

  if (!LandId && !LastChanged) return next();

  await new AllocatedTo().create({
    UserId: req.user.Id,
    LandId,
  });

  await new Land().updateOne(LandId, JSON.parse(LastChanged), {
    Allocated: true,
  });

  res.redirect(req.originalUrl.split("?")[0]);
});
