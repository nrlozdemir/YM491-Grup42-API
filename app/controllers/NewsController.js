const News = require("../models/News");
const Sequelize = require("sequelize");
const { Client } = require("@elastic/elasticsearch");
const axios = require("axios");

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
        console.log("pong:", a);
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

const parser = (strTuple) => {
  const splitStr = strTuple.split(",");
  const first = splitStr[0]
    .replace("(", "")
    .replace(")", "")
    .replace("'", "")
    .replace("'", "")
    .replace(" ", "")
    .replace(" ", "");
  const second = splitStr[1]
    .replace("(", "")
    .replace(")", "")
    .replace("'", "")
    .replace("'", "")
    .replace(" ", "")
    .replace(" ", "");

  return [parseFloat(first), parseFloat(second)];
};

exports.create = async (req, res, next) => {
  const { newsTitle, newsText } = req.body;

  const getLRScore = await axios
    .post(`${process.env.BACKEND}/predict_LR`, {
      title: newsTitle,
      text: newsText,
    })
    .then((e) => {
      return e.data;
    })
    .catch((e) => {
      console.log("error", e);
      return false;
    });

  const getPAScore = await axios
    .post(`${process.env.BACKEND}/predict_PA`, {
      title: newsTitle,
      text: newsText,
    })
    .then((e) => {
      return e.data;
    })
    .catch((e) => {
      console.log("error", e);
      return false;
    });

  const lrScore = parser(getLRScore);
  const paScore = parser(getPAScore);

  const predictLRLabel = lrScore[0];
  const predictLRScore = lrScore[1];
  const predictPALabel = paScore[0];
  const predictPAScore = paScore[1];

  if (!!getLRScore && !!getPAScore) {
    res.send({
      data: {
        title: newsTitle,
        text: newsText,
        lrLabel: predictLRLabel,
        lrScore: predictLRScore,
        paLabel: predictPALabel,
        paScore: predictPAScore,
      },
      message: "OK",
    });
  } else {
    res.send({ message: "ERROR", data: [] });
  }
};
