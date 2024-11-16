import { Op } from 'sequelize';
import db from '../../models/index.js';
import { ITEM_TYPE } from '../../models/Item.js';

const { Item } = db;

export const index = async (req, res, next) => {
  try {
    const { search, min_price, max_price, onlyVeg } = req.query;
    
    let whereConditions = {};
    if(search) whereConditions.name = { [Op.iLike]: `%${search}%` };
    if(min_price) whereConditions.price = { [Op.gte]: min_price };
    if(max_price) whereConditions.price = { [Op.lte]: max_price };
    if(onlyVeg) whereConditions.type = ITEM_TYPE.VEG;

    const items = await Item.findAll({
      where: whereConditions,
      attributes: ['id', 'name', 'description', 'price', 'type'],
      include: [{
        association: 'restaurant',
        attributes: ['id', 'name', 'address'],
        where: { active: true }
      }],
      order: [['name', 'ASC']]
    });

    return res.status(200).send({ items });
  } catch(error) {
    next(error);
  }
};