import express from 'express';
import passport from 'passport';

import * as updateValidator from '../../middleware/restaurant/validator/orders/update.validator.js';

import { index, show, update } from '../../controllers/restaurant/orders.controllers.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), index);
router.get('/:id', passport.authenticate('jwt', { session: false }), show);
router.put('/:id', passport.authenticate('jwt', { session: false }), updateValidator.validationRules(), updateValidator.validate, update);

export default router;