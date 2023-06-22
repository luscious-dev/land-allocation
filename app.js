// Libraries
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

// Routes
const userRoute = require("./routes/userRoutes");
const landRoute = require("./routes/landRoutes");
const landImageRoute = require("./routes/landImageRoutes");
const certificateRoute = require("./routes/certifcateRoutes");
const allocatedRoute = require("./routes/allocatedRoutes");
const viewRoute = require("./routes/viewRoutes");

// Controllers
const errorController = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handlers
app.use("/api/v1/user", userRoute);
app.use("/api/v1/land", landRoute);
app.use("/api/v1/land-image", landImageRoute);
app.use("/api/v1/certificate-of-ownership", certificateRoute);
app.use("/api/v1/allocated-to", allocatedRoute);
app.use("/", viewRoute);

// ERROR HANDLING
app.use(errorController);

module.exports = app;
