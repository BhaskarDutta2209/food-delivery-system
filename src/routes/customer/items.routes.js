import express from 'express';

import { index } from '../../controllers/customer/items.controllers.js';

const router = express.Router();

router.get('/', index);

export default router;