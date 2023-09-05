const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CommunityUsers extends Model {}

CommunityUsers.init(
  {
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'communities',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
      },
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


