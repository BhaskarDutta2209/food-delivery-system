import i18n from 'i18n';
import { body, validationResult, matchedData, check } from 'express-validator';

const validationRules = () => {
  return [
    check('id')
      .trim()
      .exists({ checkNull: true, checkFalsy: true }).withMessage({ message: i18n.__('errors.validation.order.id.required') })
      .bail()
      .isUUID().withMessage({ message: i18n.__('errors.validation.order.id.invalid') }),
    body('order.items')
      .isArray({ min: 1 }).withMessage({ message: i18n.__('errors.validation.order.items.must_be_array') })
      .bail()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.order.items.required') }),
    body('order.items.*.id')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.order.items.id.required') })
      .bail()
      .isUUID().withMessage({ message: i18n.__('errors.validation.order.items.id.invalid') }),
    body('order.items.*.count')
      .isInt().withMessage({ message: i18n.__('errors.validation.order.items.count.invalid') }),
  ];
}

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