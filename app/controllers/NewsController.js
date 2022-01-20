const News = require("../models/News");
const Sequelize = require("sequelize");

exports.detail = (req, res, next) => {
  const id = parseInt(req.params.id);

  News.findOne({ where: { id: id } })
    .then((newsItem) => {
      if (newsItem) {
        res.send(newsItem);
      }
    })
    .catch((err) => console.log(err));
};

exports.autoComplete = (req, res, next) => {
  const searchQuery = req.body.query;

  News.findAll({
    offset: 0,
    limit: 100,
    where: {
      title: {
        [Sequelize.Op.like]: `%${searchQuery}%`,
      },
    },
    attributes: ["id", "title"],
  })
    .then((newsItems) => {
      if (newsItems) {
        res.send({ data: newsItems, message: "OK" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ data: [], message: "OK" });
    });
};
