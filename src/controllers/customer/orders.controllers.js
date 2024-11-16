import db from '../../models/index.js';
import i18n from 'i18n';

const { Order, OrderItem, Item } = db;

export const create = async(req, res, next) => {
  try {
    const customerId = req.user.id;
    const restaurantId = req.params.id;

    // Verify all items are present in the restaurant
    const items = await Item.findAll({
      where: {
        id: req.params.order.items.map((item) => item.id),
        restaurant_id: restaurantId
      }
    });

    if(items.length !== req.params.order.items.length) {
      return res.status(422).send({ errors: { item_ids: i18n.__('errors.validation.order.item_ids.invalid') } });
    }

    const transaction = await db.sequelize.transaction();
    
    const order = await Order.create({
      customer_id: customerId,
      restaurant_id: restaurantId,
    }, { transaction });

    await OrderItem.bulkCreate(
      req.params.order.items.map((item) => ({
        order_id: order.id,
        item_id: item.id,
        count: item.count
      })),
      { transaction }
    )

    await transaction.commit();

    return res.sendStatus(201);
  } catch(error) {
    next(error);
  }
};

export const index = async(req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        customer_id: req.user.id
      },
      attributes: ['id', 'status'],
      include: [
        {
          through: {  attributes: ['count'] },
          association: 'items',
          attributes: ['id', 'name', 'price']
        },
        {
          association: 'restaurant',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(200).send({ orders });
  } catch(error) {
    next(error);
  }
};

export const show = async(req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        customer_id: req.user.id
      },
      attributes: ['id', 'status'],
      include: [
        {
          through: { attributes: ['count'] },
          association: 'items',
          attributes: ['id', 'name', 'price']
        },
        {
          association: 'restaurant',
          attributes: ['id', 'name']
        }
      ]
    });

    if(!order) return res.status(404).send({ errors: { id: i18n.__('errors.customer.order_not_found') } });

    return res.status(200).send({ order });
  } catch(error) {
    next(error);
  }
};