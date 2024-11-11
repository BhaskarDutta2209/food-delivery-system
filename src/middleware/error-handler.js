import i18n from 'i18n';
import logger from '../../config/winstonLogger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const errorName = err.name;

  switch (errorName) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      return res
        .status(400)
        .send({ error: err.errors.map((err) => err.message).join(',') });
    case 'TokenExpiredError':
      return res
        .status(400)
        .send({ error: i18n.__('errors.general.token_expired') });
    default:
      return res.sendStatus(500);
  }
};

export default errorHandler;
