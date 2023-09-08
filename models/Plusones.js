const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Plusones extends Model {}

Plusones.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    //   allowNull: false,
      onDelete: 'CASCADE',
      references: 'users',
      referencesKey: 'id',
      foreignKey:'user_id'
    },
    review_id: {
      type: DataTypes.INTEGER,
    //   allowNull: false,
      onDelete: 'CASCADE',
      references: 'reviews',
      referencesKey: 'id',
      foreignKey:'review_id'
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'plusones',
  }
);



module.exports = Plusones;
