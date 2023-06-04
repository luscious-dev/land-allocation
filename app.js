const express = require("express");
const User = require("./models/User");
const { spitDate } = require("./utils/dateUtils");

const app = express();

app.get("/", async function (req, res, next) {
  // const user = await new User().deleteOne(5, { out: true });
  // const user = await new User().readOne(5);
  // let oldUser = await new User().readOne(3);
  // const user = await new User().updateOne(3, oldUser.LastChanged, {
  //   FirstName: "Salim",
  // });
  const user = await new User().readConditional("FirstName = 'Salim'");

  console.log(user);

  res.send("This is the home page");
});

// WHAT WE WANT

// SECURITY

// ERROR HANDLING

module.exports = app;
