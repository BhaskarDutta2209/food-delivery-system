export default function (app) {
  app.get('/api/customer/health', (_req, res) =>
    res.status(200).send('<h2>CUSTOMER HEALTHY V1.0.0</h2>')
  );
}
