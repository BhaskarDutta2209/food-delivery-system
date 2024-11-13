import express from 'express';
import passport from 'passport';

import * as createValidator from '../../middleware/restaurant/validator/items/create.validator.js';
import * as updateValidator from '../../middleware/restaurant/validator/items/update.validator.js';

import { create, index, show, update, destroy } from '../../controllers/restaurant/items.controllers.js';

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), createValidator.validationRules(), createValidator.validate, create);
router.get('/', passport.authenticate('jwt', { session: false }), index);
router.get('/:id', passport.authenticate('jwt', { session: false }), show);
router.put('/:id', passport.authenticate('jwt', { session: false }), updateValidator.validationRules(), updateValidator.validate, update);
router.delete('/:id', passport.authenticate('jwt', { session: false }), destroy);

export default router;