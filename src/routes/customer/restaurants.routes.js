import express from 'express';

import { index, show, restaurantItems } from '../../controllers/customer/restaurants.controllers.js';

const router = express.Router();

router.get('/', index);
router.get('/:id', show);
router.get('/:id/items', restaurantItems);

export default router;