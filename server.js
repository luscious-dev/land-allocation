const dotenv = require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`APP STARTED ON PORT ${process.env.APP_PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
