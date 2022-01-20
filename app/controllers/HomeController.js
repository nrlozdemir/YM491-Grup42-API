const News = require("../models/News");

exports.news = (req, res, next) => {
  const offset = parseInt(req.params.offset);
  News.count().then((c) => {
    News.findAll({
      offset: offset * 10,
      limit: 10,
    })
      .then((newsItems) => {
        console.log(c);
        if (newsItems) {
          res.send({ data: newsItems, count: c });
        }
      })
      .catch((err) => console.log(err));
  });
};
