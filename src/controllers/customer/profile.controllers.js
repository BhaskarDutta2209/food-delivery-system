import db from '../../models/index.js';

const { Customer } = db;

export const profile = async(req, res, next) => {
  try {
    const customer = req.user;

    delete customer.dataValues.password;
    delete customer.dataValues.createdAt;
    delete customer.dataValues.updatedAt;
    delete customer.dataValues.deletedAt;

    return res.status(200).send({ customer });
  } catch(error) {
    next(error);
  }
}

export const updateProfile = async(req, res, next) => {
  try {
    await Customer.update(
      req.params.customer,
      { where: { id: req.user.id } }
    );

    return res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};