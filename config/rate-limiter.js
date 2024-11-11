import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: parseInt(process.env.WINDOW_DURATION_IN_MIN) * 60 * 1000, // 10 minutes
  max: parseInt(process.env.MAX_REQUEST_PER_WINDOW) // limit each IP to 1000 requests per windowMs
});

export default limiter;
