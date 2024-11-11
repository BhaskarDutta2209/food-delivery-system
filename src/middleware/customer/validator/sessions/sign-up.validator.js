import i18n from 'i18n';
import { body, validationResult, matchedData } from 'express-validator';
import { REGEX_FOR_VALID_PASSWORD } from '../../../../../config/constants.js'

const validationRules = () => {
  return [
    body('customer.first_name')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.customer.first_name.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.customer.first_name.must_be_string') })
      .toLowerCase(),
    body('customer.last_name')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.customer.last_name.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.customer.last_name.must_be_string') })
      .toLowerCase(),
    body('customer.email')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.customer.email.required') })
      .bail()
      .isEmail().withMessage({ message: i18n.__('errors.validation.customer.email.invalid') })
      .toLowerCase(),
    body('customer.password')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.customer.password.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.customer.password.must_be_string') })
      .bail()
      .isLength({ min: 8 }).withMessage({ message: i18n.__('errors.validation.customer.password.min_length') })
      .bail()
      .custom((value) => {
        return value.match(REGEX_FOR_VALID_PASSWORD)
      })
      .withMessage({ message: i18n.__('errors.validation.customer.password.invalid') }),

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