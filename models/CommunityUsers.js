const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CommunityUsers extends Model {}

CommunityUsers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: 'communities',
      referencesKey: 'id',
      foreignKey:'community_id'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: 'users',
      referencesKey: 'id',
      foreignKey:'user_id'
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'communityusers',
  }
);

module.exports = CommunityUsers;


