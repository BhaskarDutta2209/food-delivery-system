import i18n from 'i18n';
import { body, check, validationResult, matchedData } from 'express-validator';
import { ORDER_STATUS } from '../../../../models/Order.js';

const validationRules = () => {
  return [
    check('id')
      .trim()
      .exists({ checkNull: true, checkFalsy: true }).withMessage({ message: i18n.__('errors.validation.item.id.required') })
      .bail()
      .isUUID(),
    body('order.status')
      .trim()
      .optional()
      .isString().withMessage({ message: i18n.__('errors.validation.order.status.must_be_string') })
      .bail()
      .isIn([ORDER_STATUS.RESTAURANT_CONFIRMED, ORDER_STATUS.RESTAURANT_CANCELLED]).withMessage({ message: i18n.__('errors.validation.order.status.invalid') }),
  ];
};

const validate = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    req.params = matchedData(req);
    return next();
  }
  const errors = {};

  validationErrors.array().map((err) => (errors[err.path] = err.msg.message));

  return res.status(422).json({ errors });
};

export { validationRules, validate };