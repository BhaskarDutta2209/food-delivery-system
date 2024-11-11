import '../db/sequelize.js';
import express from 'express';
import errorHandler from './middleware/error-handler.js';
import commonMiddlewares from './middleware/common-middlewares.js';
import customerRoutes from './routes/customer/index.js';
import restaurantRoutes from './routes/restaurant/index.js';
import  './middleware/auth.js';

const app = express();

app.set('trust proxy', 1);

app.use(commonMiddlewares);

customerRoutes(app);
restaurantRoutes(app);

app.use(errorHandler); // Global error handler

export default app;
