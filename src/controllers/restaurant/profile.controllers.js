import db from '../../models/index.js';

const { Restaurant } = db;

export const profile = async(req, res, next) => {
  try {
    const restaurant = req.user;

    delete restaurant.dataValues.password;
    delete restaurant.dataValues.createdAt;
    delete restaurant.dataValues.updatedAt;
    delete restaurant.dataValues.deletedAt;

    return res.status(200).send({ restaurant });
  } catch(error) {
    next(error);
  }
}

export const updateProfile = async(req, res, next) => {
  try {
    await Restaurant.update(
      req.params.restaurant,
      { where: { id: req.user.id } }
    );

    return res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};