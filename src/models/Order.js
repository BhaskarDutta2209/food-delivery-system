'use strict';
import { Model } from 'sequelize';

const ORDER_STATUS = {
  WAITING_RESTAURANT_CONFIRMATION: 'waiting_restaurant_confirmation',
  RESTAURANT_CONFIRMED: 'restaurant_confirmed',
  RESTAURANT_CANCELLED: 'restaurant_cancelled',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

const Order = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Item, { through: models.OrderItem, foreignKey: 'order_id', as: 'items' });
      this.belongsTo(models.Customer, { foreignKey: 'customer_id', constraints: false, as: 'customer' });
      this.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id', constraints: false, as: 'restaurant' });
    }
  }
  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: sequelize.models.Customer,
        key: 'id',
      }
    },
    restaurant_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: sequelize.models.Restaurant,
        key: 'id',
      }
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [Object.values(ORDER_STATUS)]
      },
      defaultValue: ORDER_STATUS.WAITING_RESTAURANT_CONFIRMATION,
    },
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Order',
  });
  return Order;
};

export { Order, ORDER_STATUS };