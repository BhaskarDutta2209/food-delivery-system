import express from 'express';
import passport from 'passport';

import * as signUpValidator from '../../middleware/restaurant/validator/sessions/sign-up.validator.js';
import * as signInValidator from '../../middleware/restaurant/validator/sessions/sign-in.validator.js';
import { signUp, signIn, refreshAccessToken, signOut } from '../../controllers/restaurant/sessions.controllers.js';

const router = express.Router();

router.post('/sign_up', signUpValidator.validationRules(), signUpValidator.validate, signUp);
router.post('/sign_in', signInValidator.validationRules(), signInValidator.validate, signIn);
router.get('/refresh', refreshAccessToken);
router.delete('/sign_out', passport.authenticate('jwt', { session: false}), signOut);

export default router;