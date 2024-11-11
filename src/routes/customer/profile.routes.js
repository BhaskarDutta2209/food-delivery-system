import express from 'express';
import passport from 'passport';

import * as updateValidator from '../../middleware/customer/validator/profile/update.validator.js';

import { profile, updateProfile } from '../../controllers/customer/profile.controllers.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), profile);
router.put('/', passport.authenticate('jwt', { session: false }), updateValidator.validationRules(), updateValidator.validate, updateProfile);

export default router;