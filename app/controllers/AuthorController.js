const News = require("../models/News");
const Sequelize = require("sequelize");

exports.detail = (req, res, next) => {
  const id = parseInt(req.params.id);

  News.findOne({ where: { id: id } })
    .then((newsItem) => {
      if (newsItem) {
        const author = newsItem.author;

        News.findAll({
          offset: 0,
          limit: 100,
          where: {
            author: {
              [Sequelize.Op.like]: `%${author}%`,
            },
          },
          attributes: ["id", "title", "label", "text", "author"],
        })
          .then((list) => {
            if (list) {
              res.send({ data: list, author: author, message: "OK" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.send({ data: [], author: author, message: "OK" });
          });
      }
    })
    .catch((err) => console.log(err));
};
