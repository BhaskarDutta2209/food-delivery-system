import i18n from 'i18n';
import { body, check, validationResult, matchedData } from 'express-validator';
import { ITEM_TYPE } from '../../../../models/Item.js';

const validationRules = () => {
  return [
    check('id')
      .trim()
      .exists({ checkNull: true, checkFalsy: true }).withMessage({ message: i18n.__('errors.validation.item.id.required') })
      .bail()
      .isUUID(),
    body('item.name')
      .trim()
      .optional()
      .isString().withMessage({ message: i18n.__('errors.validation.item.name.must_be_string') })
      .toLowerCase(),
    body('item.description')
      .trim()
      .optional()
      .isString().withMessage({ message: i18n.__('errors.validation.item.description.must_be_string') }),
    body('item.price')
      .trim()
      .optional()
      .isFloat().withMessage({ message: i18n.__('errors.validation.item.price.must_be_float') }),
    body('item.type')
      .trim()
      .optional()
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