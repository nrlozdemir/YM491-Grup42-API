const env = require("dotenv");
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

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
