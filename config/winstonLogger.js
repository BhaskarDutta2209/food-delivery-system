import winston from 'winston';
import 'winston-daily-rotate-file'; // This is for side effects only

const environment = process.env.NODE_ENV;

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

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: transports(),
});

export default logger;
