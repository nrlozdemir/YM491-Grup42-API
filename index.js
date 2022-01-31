const env = require("dotenv");
var cors = require("cors");
const express = require("express");
const app = express();

const webRoutes = require("./routes/web");
const sequelize = require("./config/database");

env.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   console.log(req.body);
//   next();
// });

app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "http://37.148.211.241",
    preflightContinue: true,
    optionsSuccessStatus: 200,
  })
);

app.use(webRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
    console.log("App listening on port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
