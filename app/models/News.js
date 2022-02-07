const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const News = sequelize.define(
  "news",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        // unique: true,
        fields: ["label"],
      },
      {
        // unique: true,
        fields: ["author"],
      },
    ],
  }
);

module.exports = News;
