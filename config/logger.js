import 'winston-daily-rotate-file';
import expressWinston from 'express-winston';
import winston from 'winston';

const environment = process.env.NODE_ENV;

const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${level}: ${timestamp} | ${stack || message}`;
  }
);

const logFilename = () => {
  return `food_delivery_app-${environment}-%DATE%.log`;
};

const transports = () => {
  const transportArray = [];

  transportArray.push(
    new winston.transports.DailyRotateFile({
      filename: logFilename(),
      zippedArchive: true,
      maxFiles: '14d',
      utc: true,
      createSymlink: true,
      symlinkName: 'current.log',
      dirname: './log',
    })
  );

  return transportArray;
};

const loggerConfiguration = () => {
  const configuration = {
    transports: transports(),
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      logFormat
    ),
    meta: true,
    msg: function (req, res) {
      const params = req.body;
      if (params && params.password) delete params.password;
      return (
        req.id +
        ' | ' +
        req.ip +
        ' | HTTP {{req.method}} {{req.url}} | ' +
        JSON.stringify(params) +
        ' | {{res.statusCode}} | {{res.responseTime}}ms'
      );
    },
    expressFormat: false,
    colorize: true,
    ignoreRoute: function (req, res) {
      return false;
    },
  };

  return configuration;
};

const logger = expressWinston.logger(loggerConfiguration());

export default logger;
