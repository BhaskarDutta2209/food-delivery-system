'use strict';
import { Model } from 'sequelize';
import { toTitleCase } from '../utils/text-formatting.js';

const ITEM_TYPE = {
  VEG: 'veg',
  NON_VEG: 'non-veg',
}

const Item = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id', constraints: false, as: 'restaurant' });
    }
  }
  Item.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: sequelize.models.Restaurant,
        key: 'id',
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        // Convert first letter of each word to uppercase
        const name = this.getDataValue('name');
        return toTitleCase(name);
      }
    },
    description: {
      type: DataTypes.STRING(250),
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [Object.values(ITEM_TYPE)]
      },
      defaultValue: ITEM_TYPE.NON_VEG,
    }
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Item',
  });
  return Item;
};

export { Item, ITEM_TYPE };