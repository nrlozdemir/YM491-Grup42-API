const validator = require("validator");
const User = require("../models/User");

exports.login = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push("Please enter a valid email address.");
  if (validator.isEmpty(req.body.password))
    validationErrors.push("Password cannot be blank.");
  if (validationErrors.length) {
    return res.send({ message: "ERROR", error: validationErrors });
  }

  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  })
    .then((user) => {
      if (user) {
        return res.send({ message: "OK", data: user });
      } else {
        return res.send({ message: "ERROR", error: "No user found." });
      }
    })
    .catch((err) => console.log(err));
};

exports.logout = (req, res, next) => {
  if (res.locals.isAuthenticated) {
  } else {
    return res.send({ message: "OK" });
  }
};

exports.signUp = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        const user = new User({
          fullName: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        user
          .save()
          .then((e) => {
            console.log(e);
            res.send({ message: "OK" });
          })
          .catch((error) => {
            console.log(error);
            res.send({ message: "ERROR", error: error });
          });
      } else {
        res.send({ message: "ERROR", error: null });
      }
    })
    .catch((err) => console.log(err));
};

exports.signUpGmail = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        const user = new User({
          fullName: req.body.name,
          email: req.body.email,
          password: "password",
        });
        user
          .save()
          .then((e) => {
            console.log(e);
            res.send({ message: "OK", data: e.dataValues });
          })
          .catch((error) => {
            console.log(error);
            res.send({ message: "ERROR", error: error });
          });
      } else if (!!user) {
        console.log(user);
        res.send({ message: "OK", data: user.dataValues });
      } else {
        res.send({ message: "ERROR", error: null });
      }
    })
    .catch((err) => console.log(err));
};
