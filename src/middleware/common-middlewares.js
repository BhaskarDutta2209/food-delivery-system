import { json, static as staticExpress } from 'express';
import addRequestId from 'express-request-id';
import logger from '../../config/logger.js';
import limiter from '../../config/rate-limiter.js';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import i18n from 'i18n';
import passport from 'passport';
import cors from 'cors';

i18n.configure({
  locales: ['en'],
  directory: `${process.cwd()}/src/locales`,
  objectNotation: true,
});

export default [
  json(),
  staticExpress('public'),
  addRequestId({ setHeader: false }),
  process.env.NODE_ENV != 'test' ? logger : (req, res, next) => next(), // Disable logging in test environment,
  limiter,
  cookieParser(),
  hpp(),
  cors({
    origin: true,
    credentials: true,
  }),
  helmet({
    contentSecurityPolicy: false,
  }),
  i18n.init,
  passport.initialize(),
];
