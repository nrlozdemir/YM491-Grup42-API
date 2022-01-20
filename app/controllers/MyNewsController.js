const My_News = require("../models/My_News");
const News = require("../models/News");
const sequelize = require("../../config/database");
const moment = require("moment-timezone");

exports.list = async (req, res, next) => {
  const { id } = req.params;

  const query = `SELECT news.title, news.label, my_news.datetime, news.id AS id 
  FROM my_news 
  LEFT JOIN news ON news.id = my_news.news 
  WHERE my_news.user = '${id}' ORDER BY my_news.datetime DESC`;

  await sequelize
    .query(query)
    .then((e) => {
      console.log("e:", e);
      res.send({ message: "OK", data: e[0] });
    })
    .catch((err) => {
      console.log("err:", err);
      res.send({ message: "ERROR", data: [] });
    });
};

exports.insert = async (req, res, next) => {
  const { user, news } = req.body;

  My_News.create({
    user: user,
    news: news,
    datetime: moment.utc().utcOffset("+0300").format("YYYY-MM-DD HH:mm:ss"),
  }).then(function (e) {
    if (e) {
      res.send({ message: "OK", data: e });
    } else {
      res.send({ message: "ERROR", data: [] });
    }
  });
};
