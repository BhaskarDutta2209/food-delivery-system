import i18n from 'i18n';
import { body, validationResult, matchedData } from 'express-validator';

const validationRules = () => {
  return [
    body('email')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.restaurant.email.required') })
      .bail()
      .isEmail().withMessage({ message: i18n.__('errors.validation.restaurant.email.invalid') })
      .toLowerCase(),
    body('password')
      .trim()
      .notEmpty().withMessage({ message: i18n.__('errors.validation.restaurant.password.required') })
      .bail()
      .isString().withMessage({ message: i18n.__('errors.validation.restaurant.password.must_be_string') })
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