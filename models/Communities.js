const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Communities extends Model {}

Communities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    api_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
    },
    premiere: {
      type: DataTypes.DATEONLY,
    },
    ended: {
      type: DataTypes.DATEONLY,
    },
    runtime: {
      type: DataTypes.INTEGER,
    },
    officialSite: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'communities',
  }
);



module.exports = Communities;
