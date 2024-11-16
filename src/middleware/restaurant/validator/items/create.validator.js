import i18n from 'i18n';
import { body, validationResult, matchedData } from 'express-validator';
import { ITEM_TYPE } from '../../../../models/Item.js';

const validationRules = () => {
  return [
    body('item.name')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.item.name.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.item.name.must_be_string') })
      .toLowerCase(),
    body('item.description')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.item.description.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.item.description.must_be_string') }),
    body('item.price')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.item.price.required') })
      .bail()
      .isFloat().withMessage({ message: i18n.__('errors.validation.item.price.must_be_float') }),
    body('item.type')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.item.type.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.item.type.must_be_string') })
      .bail()
      .isIn(Object.values(ITEM_TYPE)).withMessage({ message: i18n.__('errors.validation.item.type.invalid') }),
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