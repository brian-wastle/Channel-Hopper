const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Calendars extends Model {}

Calendars.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    community_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'communityusers',
        key: 'community_id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    time: {
      type: DataTypes.TIME,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'calendars',
  }
);

module.exports = Calendars;
