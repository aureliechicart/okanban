const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Tag extends Model {};

Tag.init({
  name: DataTypes.TEXT,
  color: DataTypes.TEXT,
}, {
  sequelize,
  tableName: "tag"
});

module.exports = Tag;