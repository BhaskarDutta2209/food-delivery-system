import db from '../../models/index.js';
import { ORDER_STATUS } from '../../models/Order.js';

const { Order } = db;

export const index = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        restaurant_id: req.user.id,
        status: [ORDER_STATUS.WAITING_RESTAURANT_CONFIRMATION, ORDER_STATUS.RESTAURANT_CONFIRMED, ORDER_STATUS.DELIVERING],
      },
      attributes: ['id', 'status'],
      include: [
        {
          association: 'items',
          attributes: ['id', 'name', 'price'],
          through: { attributes: [ 'count' ] },
        },
        {
          association: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    })

    return res.status(200).send({ orders });
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        restaurant_id: req.user.id,
      },
      attributes: ['id', 'status'],
      include: [
        {
          association: 'items',
          attributes: ['id', 'name', 'price'],
          through: { attributes: [ 'count' ] },
        },
        {
          association: 'customer',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    });

    return res.status(200).send({ order });
  } catch(error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    await Order.update(
      req.params.order,
      {
        where: {
          id: req.params.id,
          restaurant_id: req.user.id,
        }
      }
    )

    return res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};