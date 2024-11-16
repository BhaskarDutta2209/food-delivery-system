import db from '../../models/index.js';
import i18n from 'i18n';

const { Item } = db;

export const create = async (req, res, next) => {
  try {
    const item = await Item.create({
      ...req.params.item,
      restaurant_id: req.user.id
    });

    delete item.dataValues.restaurant_id;
    delete item.dataValues.createdAt;
    delete item.dataValues.updatedAt;
    delete item.dataValues.deletedAt;

    return res.status(201).send({item});
  } catch(error) {
    next(error);
  }
};

export const index = async (req, res, next) => {
  try {
    const items = await Item.findAll({
      where: {
        restaurant_id: req.user.id
      },
      attributes: ['id', 'name', 'description', 'price', 'type'],
      order: [['name', 'ASC']]
    });

    return res.send({ items });
  } catch(error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.id,
        restaurant_id: req.user.id
      },
      attributes: ['id', 'name', 'description', 'price', 'type']
    });

    if(!item) return res.status(404).send({ errors: { id: i18n.__('errors.restaurant.item_not_found') } });

    return res.send({ item });
  } catch(error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.id,
        restaurant_id: req.user.id
      }
    })
    if(!item) return res.status(404).send({ errors: { id: i18n.__('errors.restaurant.item_not_found') } });

    await Item.update(req.params.item, {
      where: {
        id: req.params.id
      }
    });

    delete item.dataValues.restaurant_id;
    delete item.dataValues.createdAt;
    delete item.dataValues.updatedAt;
    delete item.dataValues.deletedAt;

    return res.sendStatus(200);
  } catch(error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.id,
        restaurant_id: req.user.id
      }
    });
    if(!item) return res.status(404).send({ errors: { id: i18n.__('errors.restaurant.item_not_found') } });

    await item.destroy();

    return res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};