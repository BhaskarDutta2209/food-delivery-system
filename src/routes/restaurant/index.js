export default function (app) {
  app.get('/api/restaurant/health', (_req, res) =>
    res.status(200).send('<h2>RESTAURANT HEALTHY V1.0.0</h2>')
  );
}
