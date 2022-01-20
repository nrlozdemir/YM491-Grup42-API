const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const My_News = sequelize.define(
  "my_news",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    news: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["user"],
      },
    ],
  }
);

module.exports = My_News;
