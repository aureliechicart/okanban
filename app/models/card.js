const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Card extends Model {};

Card.init({
  content: DataTypes.TEXT,
  color: DataTypes.TEXT,
  position: DataTypes.INTEGER
}, {
  sequelize,
  tableName: "card"
});

module.exports = Card;