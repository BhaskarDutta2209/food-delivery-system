'use strict';
import { Model } from 'sequelize';

const REFRESH_TOKEN_RESOURCE_TYPES = {
  CUSTOMER: 'customer',
  RESTAURANT: 'restaurant',
}

const RefreshToken = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Customer, { foreignKey: 'resource_id', constraints: false, as: 'customer' });
      this.belongsTo(models.Restaurant, { foreignKey: 'resource_id', constraints: false, as: 'restaurant' });
    }
  }
  RefreshToken.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: DataTypes.STRING(500),
    resource_id: DataTypes.UUID,
    resource_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(REFRESH_TOKEN_RESOURCE_TYPES)],
      }
    }
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'RefreshToken',
  });
  return RefreshToken;
};

export { RefreshToken, REFRESH_TOKEN_RESOURCE_TYPES };