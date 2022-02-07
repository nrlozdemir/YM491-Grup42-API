const News = require("../models/News");
const Sequelize = require("sequelize");

const { Client } = require("@elastic/elasticsearch");

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

const pingElasticSearch = async (client) => {
  try {
    const data = await client.ping();
    const res = data.body;
    return { pong: res };
  } catch (err) {
    console.log("ElasticSearch ping error");
    throw new Error(`ElasticSearch Error: ${err}`);
  }
};

const findQuery = (res, searchQuery) => {
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

exports.autoComplete = async (req, res, next) => {
  const client = new Client({ node: "http://localhost:9200" });
  const searchQuery = req.body.query;

  if (searchQuery.length > 1) {
    await pingElasticSearch(client)
      .then(async (a) => {
        const { body } = await client.search({
          index: "news",
          body: {
            size: 1000,
            query: {
              multi_match: {
                query: searchQuery,
                fields: ["title", "author", "text"],
              },
            },
          },
        });

        let indexerResult = [];

        !!body &&
          !!body.hits &&
          !!body.hits.hits &&
          body.hits.hits.length > 0 &&
          body.hits.hits.map((d, i) => {
            indexerResult.push(d._source);
          });

        if (!!indexerResult && indexerResult.length > 0) {
          console.log(indexerResult.length);
          res.send({ data: indexerResult, message: "OK" });
        } else {
          findQuery(res, searchQuery);
        }
      })
      .catch((err) => {
        return findQuery(res, searchQuery);
      });
  } else {
    res.send({ data: [], message: "OK" });
  }
};

exports.create = async (req, res, next) => {
  const { title, text, author } = req.body;

  const label = 0;

  News.create({
    title: title,
    author: author,
    text: text,
    label: label,
  }).then(function (e) {
    if (e) {
      res.send({
        data: e,
        message: "OK",
      });
    } else {
      res.send({ message: "ERROR", data: [] });
    }
  });
};
