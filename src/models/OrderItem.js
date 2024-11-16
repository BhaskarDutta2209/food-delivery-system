'use strict';
import { Model } from 'sequelize';

const OrderItem = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: 'order_id', constraints: false, as: 'order' });
      this.belongsTo(models.Item, { foreignKey: 'item_id', constraints: false, as: 'item' });
    }
  }
  OrderItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: sequelize.models.Order,
        key: 'id',
      }
    },
    item_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: sequelize.models.Item,
        key: 'id',
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'OrderItem',
  });
  return OrderItem;
};

export { OrderItem };