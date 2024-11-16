import sessionsRouter from './sessions.routes.js';
import profileRouter from './profile.routes.js';
import itemsRouter from './items.routes.js';
import restaurantsRouter from './restaurants.routes.js';
import ordersRouter from './orders.routes.js';

export default function (app) {
  app.get('/api/customer/health', (_req, res) =>
    res.status(200).send('<h2>CUSTOMER HEALTHY V1.0.0</h2>')
  );
  
  app.use('/api/customer/sessions', sessionsRouter);
  app.use('/api/customer/profile', profileRouter);
  app.use('/api/customer/items', itemsRouter);
  app.use('/api/customer', ordersRouter);
  app.use('/api/customer/restaurants', restaurantsRouter);
}
