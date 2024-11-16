import express from 'express';
import passport from 'passport';

import * as createValidator from '../../middleware/customer/validator/orders/create.validator.js';
import { create, index, show } from '../../controllers/customer/orders.controllers.js';

const router = express.Router();

router.post('/restaurants/:id/orders', passport.authenticate('jwt', { session: false }), createValidator.validationRules(), createValidator.validate, create);
router.get('/orders', passport.authenticate('jwt', { session: false }), index);
router.get('/orders/:id', passport.authenticate('jwt', { session: false }), show);

export default router;