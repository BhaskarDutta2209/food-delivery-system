import { Op } from 'sequelize';
import db from '../../models/index.js';
import { ITEM_TYPE } from '../../models/Item.js';

const { Restaurant, Item } = db;

export const index = async (req, res, next) => {
  try {
    const { search } = req.query;

    let whereConditions = { active: true };
    if(search) whereConditions.name = { [Op.iLike]: `%${search}%` };

    const restaurants = await Restaurant.findAll({
      where: whereConditions,
      attributes: ['id', 'name', 'address'],
      order: [['name', 'ASC']]
    });

    return res.status(200).send({ restaurants });
  } catch(error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      attributes: ['id', 'name', 'address']
    });

    if(!restaurant) {
      return res.status(404).send({ message: 'Restaurant not found' });
    }

    return res.status(200).send({ restaurant });
  } catch(error) {
    next(error);
  }
};

export const restaurantItems = async (req, res, next) => {
  try {
    const { search, min_price, max_price, onlyVeg } = req.query;

    let whereConditions = { restaurant_id: req.params.id };
    if(search) whereConditions.name = { [Op.iLike]: `%${search}%` };
    if(min_price) whereConditions.price = { [Op.gte]: min_price };
    if(max_price) whereConditions.price = { [Op.lte]: max_price };
    if(onlyVeg) whereConditions.type = ITEM_TYPE.VEG;

    const items = await Item.findAll({
      where: whereConditions,
      attributes: ['id', 'name', 'description', 'price', 'type'],
      order: [['name', 'ASC']]
    });

    return res.status(200).send({ items });
  } catch(error) {
    next(error);
  }
};