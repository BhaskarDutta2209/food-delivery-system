import i18n from 'i18n';
import { body, validationResult, matchedData } from 'express-validator';
import { REGEX_FOR_VALID_PASSWORD } from '../../../../../config/constants.js'

const validationRules = () => {
  return [
    body('restaurant.name')
      .trim()
      .optional()
      .isString().withMessage({ message: i18n.__('errors.validation.restaurant.name.must_be_string') }),
    body('restaurant.address')
      .trim()
      .optional()
      .isString().withMessage({ message: i18n.__('errors.validation.restaurant.address.address') }),
    body('restaurant.password')
      .trim()
      .optional()
      .isString().withMessage({ message: i18n.__('errors.validation.restaurant.password.must_be_string') })
      .bail()
      .isLength({ min: 8 }).withMessage({ message: i18n.__('errors.validation.restaurant.password.min_length') })
      .bail()
      .custom((value) => {
        return value.match(REGEX_FOR_VALID_PASSWORD)
      })
      .withMessage({ message: i18n.__('errors.validation.restaurant.password.invalid') }),

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