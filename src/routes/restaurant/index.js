import sessionsRouter from './sessions.routes.js';
import profileRouter from './profile.routes.js';
import itemsRouter from './items.routes.js';
import ordersRouter from './orders.routes.js';

export default function (app) {
  app.get('/api/restaurant/health', (_req, res) =>
    res.status(200).send('<h2>RESTAURANT HEALTHY V1.0.0</h2>')
  );

  app.use('/api/restaurant/sessions', sessionsRouter);
  app.use('/api/restaurant/profile', profileRouter);
  app.use('/api/restaurant/items', itemsRouter);
  app.use('/api/restaurant/orders', ordersRouter);
}
